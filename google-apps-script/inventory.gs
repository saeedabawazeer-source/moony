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

const SHEET_NAME = "Inventory";

// ─── Helpers ─────────────────────────────────────────────
function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
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

// ─── Initialize default data if sheet is empty ───────────
function initializeIfEmpty() {
  const sheet = getSheet();
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
  const sheet = getSheet();
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
  const sheet = getSheet();
  const body = JSON.parse(e.postData.contents);
  const action = body.action;

  // ── Set stock to exact value ──
  if (action === "set") {
    const { productId, size, quantity } = body;
    const row = findRow(sheet, productId, size);
    const now = new Date().toISOString();
    if (row > 0) {
      sheet.getRange(row, 3).setValue(quantity);
      sheet.getRange(row, 4).setValue(now);
    } else {
      sheet.appendRow([productId, size, quantity, now]);
    }
    return jsonResponse({ success: true, stock: quantity });
  }

  // ── Decrement stock ──
  if (action === "decrement") {
    const { productId, size, quantity } = body;
    const row = findRow(sheet, productId, size);
    if (row < 0) {
      return jsonResponse({ success: false, message: "Not found" }, 404);
    }
    const current = Number(sheet.getRange(row, 3).getValue());
    if (current < quantity) {
      return jsonResponse({ success: false, message: "Insufficient stock", remaining: current }, 409);
    }
    const newStock = current - quantity;
    const now = new Date().toISOString();
    sheet.getRange(row, 3).setValue(newStock);
    sheet.getRange(row, 4).setValue(now);
    
    // Highlight sold-out rows in red
    if (newStock === 0) {
      sheet.getRange(row, 1, 1, 4).setBackground("#ffcccc");
    }
    
    return jsonResponse({ success: true, remaining: newStock });
  }

  // ── Increment stock (restock) ──
  if (action === "increment") {
    const { productId, size, quantity } = body;
    const row = findRow(sheet, productId, size);
    if (row < 0) {
      return jsonResponse({ success: false, message: "Not found" }, 404);
    }
    const current = Number(sheet.getRange(row, 3).getValue());
    const newStock = current + quantity;
    const now = new Date().toISOString();
    sheet.getRange(row, 3).setValue(newStock);
    sheet.getRange(row, 4).setValue(now);
    
    // Remove red highlight if restocked
    if (current === 0 && newStock > 0) {
      sheet.getRange(row, 1, 1, 4).setBackground(null);
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
  const sheet = getSheet();
  sheet.clear();
  sheet.appendRow(["Product", "Size", "Stock", "LastUpdated"]);
  sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
  sheet.setFrozenRows(1);
  initializeIfEmpty();
  SpreadsheetApp.getUi().alert("Inventory reset to defaults!");
}

function highlightSoldOut() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (Number(data[i][2]) === 0) {
      sheet.getRange(i + 1, 1, 1, 4).setBackground("#ffcccc");
    } else {
      sheet.getRange(i + 1, 1, 1, 4).setBackground(null);
    }
  }
}
