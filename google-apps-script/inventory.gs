/**
 * MOONY INVENTORY — Google Apps Script
 * 
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Rename the first tab to "Inventory"
 * 3. Add headers in Row 1: Product | Size | Stock | LastUpdated
 * 4. Go to Extensions > Apps Script
 * 5. Paste this entire file, then Deploy > New Deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and add it to your .env as SHEETS_INVENTORY_URL
 *
 * The sheet will auto-populate with initial data on first GET request.
 */

const SHEET_NAME_INVENTORY = "Inventory";
const SHEET_NAME_ORDERS = "Orders";

// ─── TELEGRAM NOTIFICATIONS (100% FREE) ───
// 1. Open Telegram and search for "@BotFather"
// 2. Type /newbot, give it a name like "Moony Alerts", and copy the HTTP API Token
const TELEGRAM_BOT_TOKEN = "8636468742:AAGcmfNf0otgS46-JvQodS71HjQBfuAHH1k"; 

// 3. Search for "@userinfobot" in Telegram and press Start to get your chat ID
const TELEGRAM_CHAT_ID = "8607930596"; 

// ─── Helpers ─────────────────────────────────────────────
function getInventorySheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_INVENTORY);
}

function getOrdersSheet() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ORDERS);
  // Auto-create Orders tab if it doesn't exist
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME_ORDERS);
    sheet.appendRow(["Date", "Order ID", "Name", "Email", "Phone", "Product", "Size", "Qty", "Amount", "Status"]);
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRow(sheet, productId, size) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === productId && data[i][1] === size) {
      return i + 1; // 1-indexed for Sheets
    }
  }
  return -1;
}

function sheetToJson(sheet) {
  const data = sheet.getDataRange().getValues();
  const inventory = {};
  for (let i = 1; i < data.length; i++) {
    const [productId, size, stock] = data[i];
    if (!productId) continue;
    if (!inventory[productId]) inventory[productId] = {};
    inventory[productId][size] = Number(stock);
  }
  return inventory;
}

function sendTelegramMessage(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "HTML"
  };
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });
  } catch(err) {
    // Ignore notification errors silently
  }
}

// ─── Initialize default data if sheet is empty ───────────
function initializeIfEmpty() {
  const sheet = getInventorySheet();
  getOrdersSheet(); // Ensures orders sheet exists

  if (sheet.getLastRow() <= 1) {
    // Add headers if missing
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Product", "Size", "Stock", "LastUpdated"]);
      // Bold + freeze header row
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    // Seed with initial inventory
    const initial = [
      ["daydream-set", "S", 9],
      ["daydream-set", "M", 16],
      ["daydream-set", "L", 18],
      ["daydream-set", "XL", 9],
      ["aqua-glow-set", "S", 8],
      ["aqua-glow-set", "M", 13],
      ["aqua-glow-set", "L", 17],
      ["aqua-glow-set", "XL", 8],
    ];
    const now = new Date().toISOString();
    initial.forEach(([p, s, q]) => sheet.appendRow([p, s, q, now]));
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 4);
  }
}

// ─── Web App Handlers ────────────────────────────────────

function doGet(e) {
  initializeIfEmpty();
  const sheet = getInventorySheet();
  const action = e?.parameter?.action || "getAll";

  if (action === "getAll") {
    return jsonResponse(sheetToJson(sheet));
  }

  if (action === "getProduct") {
    const productId = e.parameter.productId;
    const all = sheetToJson(sheet);
    return jsonResponse(all[productId] || {});
  }

  return jsonResponse({ error: "Unknown action" }, 400);
}

function doPost(e) {
  initializeIfEmpty();
  const invSheet = getInventorySheet();
  const body = JSON.parse(e.postData.contents);
  const action = body.action;

  // ── Log Order (and send notification) ──
  if (action === "addOrder") {
    const ordersSheet = getOrdersSheet();
    const now = new Date().toISOString();
    const { orderId, name, email, phone, product, size, quantity, amount, status } = body;
    
    // Append to Google Sheet
    ordersSheet.appendRow([now, orderId, name, email, phone, product, size, quantity, amount, status]);
    
    // Send Free Telegram Notification
    const message = `🎉 <b>NEW ORDER: ${product}</b>\n\n<b>Size:</b> ${size}\n<b>Qty:</b> ${quantity}\n<b>Amount:</b> SAR ${amount}\n\n<b>Customer:</b> ${name}\n<b>Phone:</b> ${phone}\n<b>Email:</b> ${email}\n\n<i>Status: ${status}</i>`;
    sendTelegramMessage(message);
    
    return jsonResponse({ success: true });
  }

  // ── Log Signup (and send notification) ──
  if (action === "addSignup") {
    let signupsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Signups");
    if (!signupsSheet) {
      signupsSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Signups");
      signupsSheet.appendRow(["Date", "Phone Number"]);
      signupsSheet.getRange(1, 1, 2).setFontWeight("bold");
    }
    
    const now = new Date().toISOString();
    signupsSheet.appendRow([now, body.phone]);
    
    // Send Free Telegram Notification
    sendTelegramMessage(`🌟 <b>New VIP Signup!</b>\nPhone: ${body.phone}`);
    
    return jsonResponse({ success: true });
  }

  // ── Set stock to exact value ──
  if (action === "set") {
    const { productId, size, quantity } = body;
    const row = findRow(invSheet, productId, size);
    const now = new Date().toISOString();
    if (row > 0) {
      invSheet.getRange(row, 3).setValue(quantity);
      invSheet.getRange(row, 4).setValue(now);
    } else {
      invSheet.appendRow([productId, size, quantity, now]);
    }
    return jsonResponse({ success: true, stock: quantity });
  }

  // ── Decrement stock ──
  if (action === "decrement") {
    const { productId, size, quantity } = body;
    const row = findRow(invSheet, productId, size);
    if (row < 0) {
      return jsonResponse({ success: false, message: "Not found" }, 404);
    }
    const current = Number(invSheet.getRange(row, 3).getValue());
    if (current < quantity) {
      return jsonResponse({ success: false, message: "Insufficient stock", remaining: current }, 409);
    }
    const newStock = current - quantity;
    const now = new Date().toISOString();
    invSheet.getRange(row, 3).setValue(newStock);
    invSheet.getRange(row, 4).setValue(now);
    
    if (newStock === 0) {
      invSheet.getRange(row, 1, 1, 4).setBackground("#ffcccc");
    }
    
    return jsonResponse({ success: true, remaining: newStock });
  }

  // ── Increment stock (restock) ──
  if (action === "increment") {
    const { productId, size, quantity } = body;
    const row = findRow(invSheet, productId, size);
    if (row < 0) {
      return jsonResponse({ success: false, message: "Not found" }, 404);
    }
    const current = Number(invSheet.getRange(row, 3).getValue());
    const newStock = current + quantity;
    const now = new Date().toISOString();
    invSheet.getRange(row, 3).setValue(newStock);
    invSheet.getRange(row, 4).setValue(now);
    
    if (current === 0 && newStock > 0) {
      invSheet.getRange(row, 1, 1, 4).setBackground(null);
    }
    
    return jsonResponse({ success: true, remaining: newStock });
  }

  return jsonResponse({ error: "Unknown action" }, 400);
}

function jsonResponse(data, code) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Menu for manual actions ─────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Moony Inventory")
    .addItem("Reset to defaults", "resetInventory")
    .addItem("Highlight sold-out", "highlightSoldOut")
    .addToUi();
}

function resetInventory() {
  const sheet = getInventorySheet();
  sheet.clear();
  sheet.appendRow(["Product", "Size", "Stock", "LastUpdated"]);
  sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
  sheet.setFrozenRows(1);
  initializeIfEmpty();
  SpreadsheetApp.getUi().alert("Inventory reset to defaults!");
}

function highlightSoldOut() {
  const sheet = getInventorySheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (Number(data[i][2]) === 0) {
      sheet.getRange(i + 1, 1, 1, 4).setBackground("#ffcccc");
    } else {
      sheet.getRange(i + 1, 1, 1, 4).setBackground(null);
    }
  }
}
