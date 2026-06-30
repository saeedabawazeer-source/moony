import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { useLocation } from "wouter";

const DELIVERY = 0;

export default function CartDrawer() {
  const [location] = useLocation();
  const isAr = location === "/ar";

  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, isOpen, closeCart } = useCart();
  const [step, setStep] = useState<"cart" | "details" | "paying" | "success" | "error">("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [formData, setFormData] = useState({ 
    fullName: "", 
    phone: "", 
    city: "", 
    district: "", 
    houseNumber: "" 
  });
  const [subscribeWhatsapp, setSubscribeWhatsapp] = useState(false);

  const t = {
    cartTitle: isAr ? "السلة" : "Cart",
    emptyCart: isAr ? "سلة التسوق فارغة" : "Your cart is empty",
    continueShopping: isAr ? "مواصلة التسوق" : "Continue Shopping",
    size: isAr ? "المقاس" : "Size",
    subtotal: isAr ? "المجموع الفرعي" : "Subtotal",
    delivery: isAr ? "التوصيل" : "Delivery",
    total: isAr ? "الإجمالي" : "Total",
    proceed: isAr ? "متابعة الدفع ←" : "Proceed to Checkout →",
    backToCart: isAr ? "العودة للسلة" : "Back to Cart",
    deliveryDetails: isAr ? "تفاصيل التوصيل" : "Delivery Details",
    fullName: isAr ? "الاسم الكامل" : "Your Full Name",
    phone: isAr ? "رقم الجوال (05xxxxxxxx)" : "Phone Number (05xxxxxxxx)",
    city: isAr ? "المدينة" : "City",
    district: isAr ? "الحي / الشارع" : "District / Street",
    houseNumber: isAr ? "رقم المنزل / الشقة" : "House / Apt Number",
    whatsappOffer: isAr ? "اشترك في تحديثات واتساب للحصول على خصم 10٪ على هذا الطلب" : "Subscribe to WhatsApp updates for an extra 10% off this order",
    discount: isAr ? "خصم (10%)" : "Discount (10%)",
    connecting: isAr ? "جاري الاتصال بالدفع..." : "Connecting to Payment...",
    payNow: isAr ? "ادفع الآن — ر.س " : "Pay Now — SAR ",
    payment: isAr ? "الدفع" : "Payment",
    done: isAr ? "تم!" : "Done!",
    oops: isAr ? "عذراً" : "Oops",
    securePayment: isAr ? "دفع آمن" : "Secure Payment",
    back: isAr ? "رجوع" : "Back",
    orderReceived: isAr ? "تم استلام الطلب" : "Order Received",
    seeYouSoon: isAr ? "نراك قريباً!" : "See You Soon!",
    orderConfirmed: isAr ? "تم تأكيد طلبك. سنتواصل معك قريباً لتنسيق التوصيل." : "Your order is confirmed. We'll be in touch shortly to finalize delivery.",
    backToBoutique: isAr ? "العودة للمتجر" : "Back to Boutique",
    paymentFailed: isAr ? "فشلت عملية الدفع" : "Payment Failed",
    somethingWentWrong: isAr ? "حدث خطأ ما" : "Something Went Wrong",
    tryAgain: isAr ? "حاول مرة أخرى" : "Try Again",
    cancel: isAr ? "إلغاء" : "Cancel"
  };

  const handleClose = () => {
    closeCart();
    setTimeout(() => {
      setStep("cart");
      setPaymentUrl("");
      setPaymentError("");
      setFormData({ fullName: "", phone: "", city: "", district: "", houseNumber: "" });
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fullAddress = `${formData.city}, ${formData.district}, House/Apt: ${formData.houseNumber}`;
    try {
      const res = await fetch("/api/create-charge-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            size: i.size,
            quantity: i.quantity,
            price: i.product.price,
          })),
          customer: {
            firstName: formData.fullName.split(" ")[0] || formData.fullName,
            lastName: formData.fullName.split(" ").slice(1).join(" ") || "",
            phone: formData.phone,
            address: fullAddress,
          },
          subscribeWhatsapp,
          origin: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) {
        setPaymentUrl(data.url);
        setStep("paying");
      } else {
        console.error("No payment URL returned", data);
        setPaymentError(data.message || "Payment gateway did not return a URL. Please try again.");
        setStep("error");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentError(err?.message || "Something went wrong. Please try again.");
      setStep("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.currentTarget;
      const iframeUrl = iframe.contentWindow?.location.href;
      if (iframeUrl && iframeUrl.includes("/success")) {
        setStep("success");
        clearCart();
      }
    } catch {
      // Cross-origin — can't read URL, that's fine. Tap is still loading.
    }
  };

  const discountAmount = subscribeWhatsapp ? (totalPrice * 0.10) : 0;
  const grandTotal = totalPrice - discountAmount + DELIVERY;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-[95] pointer-events-none flex items-end justify-center sm:items-center p-0 sm:p-6">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "120%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`pointer-events-auto relative w-full sm:max-w-[420px] h-[90vh] sm:h-[85vh] max-h-[800px] bg-white shadow-2xl flex flex-col rounded-t-3xl sm:rounded-b-3xl overflow-hidden ${isAr ? "font-kufi text-right" : "font-sans text-left"}`}
              dir={isAr ? "rtl" : "ltr"}
            >
            {/* Ticket Header (Airlines style) */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#dc2f34] text-white shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1" dir="ltr">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                  <p className="text-sm font-bold tracking-widest uppercase opacity-90">Moony Airlines</p>
                </div>
                <h2 className={`text-2xl font-bold ${isAr ? "font-kufi" : "font-serif"}`}>
                  {step === "paying" ? t.payment : step === "success" ? t.done : step === "error" ? t.oops : `Boarding Pass`}
                </h2>
              </div>
              <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <i className="fas fa-times text-white"></i>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* ── CART STEP ── */}
              {step === "cart" && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
                      <img src="/images/starfish-coral.png" className="w-24 h-24 opacity-30" alt="" />
                      <p className={`font-black text-2xl text-[#5d4037]/40 ${isAr ? "font-kufi" : "font-serif"}`}>{t.emptyCart}</p>
                      <button onClick={handleClose} className="text-sm font-black text-[#e5815c] underline">{t.continueShopping}</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
                        {items.map((item) => (
                          <motion.div
                            key={`${item.product.id}-${item.size}`}
                            layout
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="flex flex-col gap-1 py-4 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "المنتج" : "Item"}</span>
                                <button onClick={() => removeFromCart(item.product.id, item.size)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fas fa-times text-sm"></i></button>
                            </div>
                            <h3 className={`font-bold text-xl text-black ${isAr ? "font-kufi" : "font-serif"}`}>{item.product.name}</h3>
                            <div className="flex justify-between flex-wrap gap-4 mt-3">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.size}</span>
                                    <h3 className="font-bold text-base text-black">{item.size}</h3>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{isAr ? "الكمية" : "Qty"}</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">−</button>
                                        <span className="font-bold text-base text-black min-w-[1rem] text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{isAr ? "السعر" : "Price"}</span>
                                    <h3 className="font-bold text-base text-black font-sans">SAR {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</h3>
                                </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Ticket Perforation / Separator */}
                      <div className="relative w-full h-8 flex items-center shrink-0 overflow-hidden sm:overflow-visible">
                         <div className="absolute -left-4 sm:-left-9 w-8 h-8 bg-black/70 rounded-full" />
                         <div className="w-full border-t-2 border-dashed border-gray-300" />
                         <div className="absolute -right-4 sm:-right-9 w-8 h-8 bg-black/70 rounded-full" />
                      </div>

                      {/* Summary + CTA */}
                      <div className="px-6 pb-6 pt-2 space-y-2 shrink-0 bg-white">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                          <span className="uppercase tracking-widest">{t.subtotal}</span><span className="font-sans">SAR {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="uppercase tracking-widest text-gray-500 font-bold">{t.delivery}</span>
                          <span className="text-green-600 font-black uppercase tracking-widest text-[10px] lg:text-xs">{isAr ? "مجاناً" : "Free"}</span>
                        </div>
                        <div className="flex justify-between items-end mt-4 mb-4">
                          <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">{t.total}</span>
                          <span className="text-3xl font-black text-black font-sans leading-none">SAR {(totalPrice + DELIVERY).toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => setStep("details")}
                          className={`w-full py-4 mt-2 rounded-xl font-bold text-sm uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2 ${isAr ? "font-kufi" : ""}`}
                        >
                          {t.proceed}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* ── DETAILS STEP ── */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className={`font-bold text-xl text-black ${isAr ? "font-kufi" : "font-serif"}`}>{t.deliveryDetails}</h3>
                        <button type="button" onClick={() => setStep("cart")} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors ${isAr ? "flex-row-reverse" : ""}`}>
                          <i className={`fas ${isAr ? "fa-arrow-right" : "fa-arrow-left"}`}></i> {t.back}
                        </button>
                      </div>

                      {/* Minimalist Form */}
                      <div className="space-y-4">
                      <div className="flex flex-col border-b border-gray-200 pb-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.fullName}</label>
                        <input
                          required
                          value={formData.fullName}
                          onChange={e => setFormData(f => ({ ...f, fullName: e.target.value }))}
                          className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300"
                        />
                      </div>

                      <div className="flex flex-col border-b border-gray-200 pb-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.phone}</label>
                        <input
                          required
                          type="tel"
                          minLength={9}
                          maxLength={15}
                          value={formData.phone}
                          onChange={e => setFormData(f => ({ ...f, phone: e.target.value.replace(/[^0-9+]/g, '') }))}
                          className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300"
                          dir="ltr"
                          style={{ textAlign: isAr ? 'right' : 'left' }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col border-b border-gray-200 pb-2">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.city}</label>
                          <input
                            required
                            value={formData.city}
                            onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
                            className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300 min-w-0"
                          />
                        </div>
                        <div className="flex flex-col border-b border-gray-200 pb-2">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.district}</label>
                          <input
                            required
                            value={formData.district}
                            onChange={e => setFormData(f => ({ ...f, district: e.target.value }))}
                            className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300 min-w-0"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col border-b border-gray-200 pb-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.houseNumber}</label>
                        <input
                          required
                          value={formData.houseNumber}
                          onChange={e => setFormData(f => ({ ...f, houseNumber: e.target.value }))}
                          className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300"
                        />
                      </div>

                      </div>
                    </div>

                    {/* Ticket Perforation / Separator */}
                    <div className="relative w-full h-8 flex items-center shrink-0 overflow-hidden sm:overflow-visible">
                       <div className="absolute -left-4 sm:-left-9 w-8 h-8 bg-black/70 rounded-full" />
                       <div className="w-full border-t-2 border-dashed border-gray-300" />
                       <div className="absolute -right-4 sm:-right-9 w-8 h-8 bg-black/70 rounded-full" />
                    </div>

                    {/* Fixed Summary & Pay Button at Bottom */}
                    <div className="px-6 pb-6 pt-2 shrink-0 bg-white mt-auto">
                      
                      {/* WhatsApp Opt-in */}
                      <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200 mb-4 hover:bg-gray-100 transition-colors">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="peer appearance-none w-5 h-5 border-2 border-black rounded bg-white checked:bg-[#25D366] checked:border-[#25D366] transition-colors cursor-pointer"
                            checked={subscribeWhatsapp}
                            onChange={(e) => setSubscribeWhatsapp(e.target.checked)}
                          />
                          <i className="fas fa-check absolute text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                        </div>
                        <div className="flex-1">
                          <p className={`text-[10px] font-bold leading-tight ${subscribeWhatsapp ? "text-[#25D366]" : "text-black"} ${isAr ? "font-kufi" : "uppercase tracking-widest"}`}>
                            {t.whatsappOffer}
                          </p>
                        </div>
                      </label>

                      {/* Compact Order summary mini */}
                      <div className="space-y-1.5 px-2">
                        <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          <span>{t.subtotal}</span><span className="font-sans">SAR {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          <span>{t.delivery}</span><span className="text-green-600 font-sans">{isAr ? "مجاناً" : "Free"}</span>
                        </div>
                        {subscribeWhatsapp && (
                          <div className="flex justify-between text-[11px] font-bold text-[#25D366] uppercase tracking-widest">
                            <span>{t.discount}</span><span className="font-sans">-SAR {discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-end mt-4 mb-4">
                          <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">{t.total}</span>
                          <span className="text-3xl font-black text-black font-sans leading-none">SAR {grandTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.fullName || !formData.phone || !formData.city || !formData.district || !formData.houseNumber}
                        className={`w-full py-4 mt-2 rounded-xl font-bold text-sm uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isAr ? "font-kufi" : ""}`}
                      >
                        {isSubmitting ? t.connecting : t.payNow + grandTotal.toFixed(2)}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── PAYMENT IFRAME STEP ── */}
              {step === "paying" && (
                <motion.div
                  key="paying"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col flex-1 min-h-0 bg-white"
                >
                  <div className={`px-6 py-4 flex items-center gap-2 border-b border-gray-100 ${isAr ? "flex-row-reverse" : ""}`}>
                    <button onClick={() => setStep("details")} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors ${isAr ? "flex-row-reverse" : ""}`}>
                      <i className={`fas ${isAr ? "fa-arrow-right" : "fa-arrow-left"}`}></i> {t.back}
                    </button>
                    <div className="flex-1" />
                    <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                      <i className="fas fa-lock text-green-600 text-xs"></i>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">{t.securePayment}</span>
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <iframe
                      src={paymentUrl}
                      className="absolute inset-0 w-full h-full border-0"
                      title="Tap Payment"
                      allow="payment"
                      onLoad={handleIframeLoad}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── SUCCESS STEP ── */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-between px-6 pt-10 pb-6 text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl mb-2"
                    >
                      <i className="fas fa-check"></i>
                    </motion.div>
                    
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2 font-sans">{t.orderReceived}</p>
                      <h2 className={`text-3xl font-bold text-black ${isAr ? "font-kufi" : "font-serif"}`}>{t.seeYouSoon}</h2>
                      <p className={`text-sm text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto ${isAr ? "font-kufi" : "font-sans"}`}>
                        {t.orderConfirmed}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full mt-auto">
                    {/* Ticket Perforation / Separator */}
                    <div className="relative w-full h-8 flex items-center shrink-0 overflow-hidden sm:overflow-visible mb-6">
                       <div className="absolute -left-4 sm:-left-9 w-8 h-8 bg-black/70 rounded-full" />
                       <div className="w-full border-t-2 border-dashed border-gray-300" />
                       <div className="absolute -right-4 sm:-right-9 w-8 h-8 bg-black/70 rounded-full" />
                    </div>

                    {/* Decorative QR Code Block */}
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-4">
                      <div className="text-left space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order ID</p>
                        <p className="font-bold font-mono text-sm tracking-wider">MNY-{Math.floor(100000 + Math.random() * 900000)}</p>
                      </div>
                      <svg className="w-12 h-12 text-black" viewBox="0 0 29.938 29.938" fill="currentColor">
                        <path d="M7.129 15.683h1.427v1.427h1.426v1.426H2.853V17.11h1.426v-2.853h2.853v1.426h-.003zm18.535 12.83h1.424v-1.426h-1.424v1.426zM8.555 15.683h1.426v-1.426H8.555v1.426zm19.957 12.83h1.427v-1.426h-1.427v1.426zm-17.104 1.425h2.85v-1.426h-2.85v1.426zm12.829 0v-1.426H22.81v1.426h1.427zm-5.702 0h1.426v-2.852h-1.426v2.852zM7.129 11.406v1.426h4.277v-1.426H7.129zm-1.424 1.425v-1.426H2.852v2.852h1.426v-1.426h1.427zm4.276-2.852H.002V.001h9.979v9.978zM8.555 1.427H1.426v7.127h7.129V1.427zm-5.703 25.66h4.276V22.81H2.852v4.277zm14.256-1.427v1.427h1.428V25.66h-1.428zM7.129 2.853H2.853v4.275h4.276V2.853zM29.938.001V9.98h-9.979V.001h9.979zm-1.426 1.426h-7.127v7.127h7.127V1.427zM0 19.957h9.98v9.979H0v-9.979zm1.427 8.556h7.129v-7.129H1.427v7.129zm0-17.107H0v7.129h1.427v-7.129zm18.532 7.127v1.424h1.426v-1.424h-1.426zm-4.277 5.703V22.81h-1.425v1.427h-2.85v2.853h2.85v1.426h1.425v-2.853h1.427v-1.426h-1.427v-.001zM11.408 5.704h2.85V4.276h-2.85v1.428zm11.403 11.405h2.854v1.426h1.425v-4.276h-1.425v-2.853h-1.428v4.277h-4.274v1.427h1.426v1.426h1.426V17.11h-.004zm1.426 4.275H22.81v-1.427h-1.426v2.853h-4.276v1.427h2.854v2.853h1.426v1.426h1.426v-2.853h5.701v-1.426h-4.276v-2.853h-.002zm0 0h1.428v-2.851h-1.428v2.851zm-11.405 0v-1.427h1.424v-1.424h1.425v-1.426h1.427v-2.853h4.276v-2.853h-1.426v1.426h-1.426V7.125h-1.426V4.272h1.426V0h-1.426v2.852H15.68V0h-4.276v2.852h1.426V1.426h1.424v2.85h1.426v4.277h1.426v1.426H15.68v2.852h-1.426V9.979H12.83V8.554h-1.426v2.852h1.426v1.426h-1.426v4.278h1.426v-2.853h1.424v2.853H12.83v1.426h-1.426v4.274h2.85v-1.426h-1.422zm15.68 1.426v-1.426h-2.85v1.426h2.85zM27.086 2.853h-4.275v4.275h4.275V2.853zM15.682 21.384h2.854v-1.427h-1.428v-1.424h-1.427v2.851zm2.853-2.851v-1.426h-1.428v1.426h1.428zm8.551-5.702h2.853v-1.426h-2.853v1.426zm1.426 11.405h1.427V22.81h-1.427v1.426zm0-8.553h1.427v-1.426h-1.427v1.426zm-12.83-7.129h-1.425V9.98h1.425V8.554z"/>
                      </svg>
                    </div>

                    <button
                      onClick={handleClose}
                      className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ${isAr ? "font-kufi" : ""}`}
                    >
                      {t.backToBoutique}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── ERROR STEP ── */}
              {step === "error" && (
                <motion.div
                  key="error"
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-8"
                >
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-2xl text-red-500"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-2 font-sans">{t.paymentFailed}</p>
                    <h2 className={`text-3xl font-black text-[#5d4037] ${isAr ? "font-kufi" : "font-serif"}`}>{t.somethingWentWrong}</h2>
                    <p className={`text-sm font-bold text-[#5d4037]/50 mt-2 leading-relaxed max-w-xs mx-auto ${isAr ? "font-kufi" : "font-sans"}`}>
                      {paymentError}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => { setStep("details"); setPaymentError(""); }}
                      className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest bg-[#C0FF72] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all ${isAr ? "font-kufi" : ""}`}
                    >
                      {t.tryAgain}
                    </button>
                    <button
                      onClick={handleClose}
                      className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest bg-[#5d4037]/10 text-[#5d4037] hover:opacity-80 transition-opacity ${isAr ? "font-kufi" : ""}`}
                    >
                      {t.cancel}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
