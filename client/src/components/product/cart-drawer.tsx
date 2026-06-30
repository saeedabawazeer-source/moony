import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { useLocation } from "wouter";

const DELIVERY = 0;

export default function CartDrawer() {
  const [location] = useLocation();
  const isAr = location === "/ar";

  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, isOpen, closeCart } = useCart();
  const [step, setStep] = useState<"checkout" | "paying" | "success" | "error">("checkout");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
      setStep("checkout");
      setShowForm(false);
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
      }
    } catch {
      // Cross-origin
    }
  };

  const discountAmount = subscribeWhatsapp ? (totalPrice * 0.10) : 0;
  const grandTotal = totalPrice - discountAmount + DELIVERY;

  const isSuccess = step === "success";

  // The Receipt Content which will be shared between checkout and success
  const renderReceiptContent = () => (
    <div className="flex flex-col flex-1 min-h-0 bg-white relative w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b-2 border-dashed border-gray-200 shrink-0 sticky top-0 bg-white z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5" dir="ltr">
            <img src="/images/starfish-black.png" alt="Moony Logo" className="w-3.5 h-3.5" />
            <p className="text-sm font-black lowercase tracking-tighter text-black font-serif">moony</p>
          </div>
          <h2 className={`text-2xl font-bold ${isAr ? "font-kufi" : "font-serif"}`}>
             Receipt
          </h2>
        </div>
        {!isSuccess && (
          <button type="button" onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <i className="fas fa-times text-gray-500"></i>
          </button>
        )}
      </div>

      <div className="flex-1">
        <div className="px-6 py-6 space-y-6">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-300 p-0.5 grayscale">
                <img src={item.product.images[0]} className="w-full h-full object-cover rounded-sm" alt={item.product.name} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "المنتج" : "Item"}</span>
                    {!isSuccess && (
                      <button type="button" onClick={() => removeFromCart(item.product.id, item.size)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fas fa-times text-sm"></i></button>
                    )}
                </div>
                <h3 className={`font-bold text-lg text-black leading-tight ${isAr ? "font-kufi" : "font-serif"}`}>{item.product.name}</h3>
                <div className="flex justify-between flex-wrap gap-2 mt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.size}</span>
                        <h3 className="font-bold text-sm text-black">{item.size}</h3>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{isAr ? "الكمية" : "Qty"}</span>
                        <div className="flex items-center gap-2">
                            {!isSuccess && <button type="button" onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">−</button>}
                            <span className="font-bold text-sm text-black min-w-[1rem] text-center">{item.quantity}</span>
                            {!isSuccess && <button type="button" onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">+</button>}
                        </div>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{isAr ? "السعر" : "Price"}</span>
                        <h3 className="font-bold text-sm text-black font-sans">SAR {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</h3>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="relative w-full h-8 flex items-center shrink-0 overflow-hidden sm:overflow-visible my-2">
           <div className="absolute -left-4 sm:-left-9 w-8 h-8 bg-black/10 rounded-full" />
           <div className="w-full border-t-2 border-dashed border-gray-300" />
           <div className="absolute -right-4 sm:-right-9 w-8 h-8 bg-black/10 rounded-full" />
        </div>

        <div className="px-6 space-y-2 mt-4">
          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>{t.subtotal}</span><span className="font-sans">SAR {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>{t.delivery}</span><span className="text-green-600 font-sans">{isAr ? "مجاناً" : "Free"}</span>
          </div>
          {subscribeWhatsapp && (
            <div className="flex justify-between text-xs font-bold text-[#25D366] uppercase tracking-widest">
              <span>{t.discount}</span><span className="font-sans">-SAR {discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-end mt-4 mb-8">
            <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">{t.total}</span>
            <span className="text-3xl font-black text-black font-sans leading-none">SAR {grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Form directly on Receipt */}
        <AnimatePresence initial={false}>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50">
                 <h3 className={`font-bold text-xl text-black mb-6 ${isAr ? "font-kufi" : "font-serif"}`}>{t.deliveryDetails}</h3>
                 <div className="space-y-4">
              <div className="flex flex-col border-b border-gray-200 pb-2 bg-transparent">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.fullName}</label>
                <input
                  required
                  disabled={isSuccess}
                  value={formData.fullName}
                  onChange={e => setFormData(f => ({ ...f, fullName: e.target.value }))}
                  className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300 disabled:opacity-70 disabled:bg-transparent"
                />
              </div>

              <div className="flex flex-col border-b border-gray-200 pb-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.phone}</label>
                <input
                  required
                  disabled={isSuccess}
                  type="tel"
                  minLength={9}
                  maxLength={15}
                  value={formData.phone}
                  onChange={e => setFormData(f => ({ ...f, phone: e.target.value.replace(/[^0-9+]/g, '') }))}
                  className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300 disabled:opacity-70"
                  dir="ltr"
                  style={{ textAlign: isAr ? 'right' : 'left' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border-b border-gray-200 pb-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.city}</label>
                  <input
                    required
                    disabled={isSuccess}
                    value={formData.city}
                    onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
                    className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300 min-w-0 disabled:opacity-70"
                  />
                </div>
                <div className="flex flex-col border-b border-gray-200 pb-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.district}</label>
                  <input
                    required
                    disabled={isSuccess}
                    value={formData.district}
                    onChange={e => setFormData(f => ({ ...f, district: e.target.value }))}
                    className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300 min-w-0 disabled:opacity-70"
                  />
                </div>
              </div>

              <div className="flex flex-col border-b border-gray-200 pb-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.houseNumber}</label>
                <input
                  required
                  disabled={isSuccess}
                  value={formData.houseNumber}
                  onChange={e => setFormData(f => ({ ...f, houseNumber: e.target.value }))}
                  className="bg-transparent outline-none text-base font-bold text-black placeholder:text-gray-300 disabled:opacity-70"
                />
              </div>
           </div>

           {!isSuccess && (
             <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200 mt-6 hover:bg-gray-50 transition-colors shadow-sm">
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
           )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
      
      {!isSuccess && (
        <div className="px-6 pb-6 pt-4 shrink-0 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2 ${isAr ? "font-kufi" : ""}`}
            >
              {t.proceed}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !formData.fullName || !formData.phone || !formData.city || !formData.district || !formData.houseNumber}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isAr ? "font-kufi" : ""}`}
            >
              {isSubmitting ? t.connecting : t.payNow + grandTotal.toFixed(2)}
            </button>
          )}
        </div>
      )}

      {isSuccess && (
        <div className="px-6 pb-6 pt-4 shrink-0 bg-white border-t border-gray-100 sticky bottom-0 z-10 text-center">
           <button
             type="button"
             onClick={() => {
               handleClose();
               clearCart();
             }}
             className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-green-100 text-green-700 hover:bg-green-200 transition-all ${isAr ? "font-kufi" : ""}`}
           >
             {t.backToBoutique}
           </button>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[150]"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-[150] pointer-events-none flex items-end justify-center p-0">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={step === "success" ? { y: 0, opacity: 1, scale: 0.95 } : { y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`pointer-events-auto relative w-full max-w-[500px] mx-auto max-h-[85dvh] rounded-t-3xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex flex-col shadow-2xl bg-white ${isAr ? "font-kufi text-right" : "font-sans text-left"}`}
              dir={isAr ? "rtl" : "ltr"}
            >
              <AnimatePresence mode="wait">
                {/* ── CHECKOUT STEP ── */}
                {step === "checkout" && (
                  <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 w-full flex flex-col min-h-0 bg-transparent">
                    {items.length === 0 ? (
                      <div className="flex-1 flex flex-col w-full h-[50dvh] bg-white items-center justify-center gap-4 text-center px-8 relative">
                        <button onClick={handleClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                          <i className="fas fa-times text-gray-500"></i>
                        </button>
                        <img src="/images/starfish-coral.png" className="w-24 h-24 opacity-30" alt="" />
                        <p className={`font-black text-2xl text-gray-400 ${isAr ? "font-kufi" : "font-serif"}`}>{t.emptyCart}</p>
                        <button onClick={handleClose} className="text-sm font-black text-[#e5815c] underline">{t.continueShopping}</button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex flex-col flex-1 w-full min-h-0 bg-transparent">
                        {renderReceiptContent()}
                      </form>
                    )}
                  </motion.div>
                )}

                {/* ── PAYMENT STEP ── */}
                {step === "paying" && (
                  <motion.div key="paying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 w-full min-h-[70dvh] bg-white">
                    <div className={`px-6 py-4 flex items-center gap-2 border-b border-gray-100 ${isAr ? "flex-row-reverse" : ""}`}>
                      <button onClick={() => setStep("checkout")} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors ${isAr ? "flex-row-reverse" : ""}`}>
                        <i className={`fas ${isAr ? "fa-arrow-right" : "fa-arrow-left"}`}></i> {t.back}
                      </button>
                      <div className="flex-1" />
                      <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                        <i className="fas fa-lock text-green-600 text-xs"></i>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">{t.securePayment}</span>
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      <iframe src={paymentUrl} className="absolute inset-0 w-full h-full border-0" title="Tap Payment" allow="payment" onLoad={handleIframeLoad} />
                    </div>
                  </motion.div>
                )}

                {/* ── SUCCESS STEP ── */}
                {step === "success" && (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 w-full flex flex-col min-h-0 relative items-center">
                    {/* The PAID stamp */}
                    <motion.div 
                      initial={{ scale: 3, opacity: 0, rotate: -15 }}
                      animate={{ scale: 1, opacity: 1, rotate: -15 }}
                      transition={{ type: "spring", damping: 12, delay: 0.3 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                    >
                      <div className="border-8 border-green-500 text-green-500 rounded-xl px-8 py-4 text-5xl font-black tracking-widest uppercase opacity-80 mix-blend-multiply shadow-lg shadow-green-500/20 bg-green-50/80 backdrop-blur-sm transform-gpu">
                        PAID
                      </div>
                    </motion.div>
                    
                    {renderReceiptContent()}
                  </motion.div>
                )}

                {/* ── ERROR STEP ── */}
                {step === "error" && (
                  <motion.div key="error" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center w-full gap-6 text-center px-8 py-20 relative bg-white">
                    <button onClick={handleClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <i className="fas fa-times text-gray-500"></i>
                    </button>
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
                      <button onClick={() => { setStep("checkout"); setPaymentError(""); }} className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest bg-black text-white transition-all ${isAr ? "font-kufi" : ""}`}>
                        {t.tryAgain}
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
