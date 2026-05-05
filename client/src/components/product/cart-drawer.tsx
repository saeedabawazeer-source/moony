import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { useLocation } from "wouter";

const DELIVERY = 56.25;

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

  const grandTotal = totalPrice + DELIVERY;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-[8px] lg:inset-[12px] bg-black/50 z-[90] rounded-[1.4rem] lg:rounded-[2.4rem]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className={`fixed inset-[8px] lg:inset-[12px] z-[95] bg-[#fef8e1] shadow-2xl flex flex-col rounded-[1.4rem] lg:rounded-[2.4rem] overflow-hidden ${isAr ? "font-kufi text-right" : "font-sans text-left"}`}
            dir={isAr ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#5d4037]/10 shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <img src="/images/starfish-black.png" alt="Moony Logo" className="w-3.5 h-3.5 opacity-60" />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#e5815c] font-sans">Moony</p>
                </div>
                <h2 className={`text-2xl font-black text-[#5d4037] ${isAr ? "font-kufi" : "font-serif"}`}>
                  {step === "paying" ? t.payment : step === "success" ? t.done : step === "error" ? t.oops : `${t.cartTitle} ${items.length > 0 ? `(${items.length})` : ""}`}
                </h2>
              </div>
              <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5d4037]/10 hover:bg-[#5d4037]/20 transition-colors">
                <i className="fas fa-times text-[#5d4037]"></i>
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
                      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {items.map((item) => (
                          <motion.div
                            key={`${item.product.id}-${item.size}`}
                            layout
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="flex gap-4 bg-white/60 rounded-2xl p-3 border-2 border-[#5d4037]/10"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                              <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.name} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-black text-[#5d4037] text-base leading-tight ${isAr ? "font-kufi" : "font-serif"}`}>{item.product.name}</h3>
                              <p className="text-xs font-bold text-[#5d4037]/50 mt-0.5">{t.size}: {item.size}</p>
                              <p className="text-sm font-black text-[#e5815c] mt-1 font-sans">SAR {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                  className="w-6 h-6 rounded-full bg-[#5d4037]/10 flex items-center justify-center font-black text-[#5d4037] text-sm hover:bg-[#5d4037]/20"
                                >−</button>
                                <span className="font-black text-sm text-[#5d4037] min-w-[1.2rem] text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full bg-[#5d4037]/10 flex items-center justify-center font-black text-[#5d4037] text-sm hover:bg-[#5d4037]/20"
                                >+</button>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="self-start w-7 h-7 flex items-center justify-center text-[#5d4037]/30 hover:text-red-400 transition-colors"
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Summary + CTA */}
                      <div className="px-6 pb-6 pt-3 border-t-2 border-[#5d4037]/10 space-y-2 shrink-0">
                        <div className="flex justify-between text-sm font-bold text-[#5d4037]/60">
                          <span>{t.subtotal}</span><span className="font-sans">SAR {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-[#5d4037]/60">
                          <span>{t.delivery}</span><span className="font-sans">SAR {DELIVERY.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-[#5d4037] border-t-2 border-[#5d4037]/10 pt-2 mb-2">
                          <span>{t.total}</span><span className="font-sans">SAR {grandTotal.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => setStep("details")}
                          className={`w-full py-3.5 rounded-full font-black text-sm uppercase tracking-widest bg-[#C0FF72] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-2 ${isAr ? "font-kufi" : ""}`}
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
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <button onClick={() => setStep("cart")} className={`flex items-center gap-2 text-xs font-black text-[#5d4037]/40 hover:text-[#5d4037] mb-4 transition-colors ${isAr ? "flex-row-reverse" : ""}`}>
                      <i className={`fas ${isAr ? "fa-arrow-right" : "fa-arrow-left"}`}></i> {t.backToCart}
                    </button>
                    <h3 className={`font-black text-xl text-[#5d4037] mb-4 ${isAr ? "font-kufi" : "font-serif"}`}>{t.deliveryDetails}</h3>

                    {/* Compact Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="bg-white/60 rounded-xl p-3 border-2 border-[#5d4037]/10 flex items-center gap-3">
                        <i className="fas fa-user text-[#e5815c] w-4 text-center"></i>
                        <input
                          required
                          placeholder={t.fullName}
                          value={formData.fullName}
                          onChange={e => setFormData(f => ({ ...f, fullName: e.target.value }))}
                          className="flex-1 bg-transparent outline-none text-sm font-bold text-[#5d4037] placeholder:text-[#5d4037]/30"
                        />
                      </div>

                      <div className="bg-white/60 rounded-xl p-3 border-2 border-[#5d4037]/10 flex items-center gap-3">
                        <i className="fas fa-phone text-[#6bb7b3] w-4 text-center"></i>
                        <input
                          required
                          type="tel"
                          placeholder={t.phone}
                          value={formData.phone}
                          onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                          className="flex-1 bg-transparent outline-none text-sm font-bold text-[#5d4037] placeholder:text-[#5d4037]/30"
                          dir="ltr"
                          style={{ textAlign: isAr ? 'right' : 'left' }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 rounded-xl p-3 border-2 border-[#5d4037]/10 flex items-center gap-2">
                          <i className="fas fa-city text-[#5d4037] w-4 text-center text-xs"></i>
                          <input
                            required
                            placeholder={t.city}
                            value={formData.city}
                            onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
                            className="flex-1 bg-transparent outline-none text-sm font-bold text-[#5d4037] placeholder:text-[#5d4037]/30 min-w-0"
                          />
                        </div>
                        <div className="bg-white/60 rounded-xl p-3 border-2 border-[#5d4037]/10 flex items-center gap-2">
                          <i className="fas fa-road text-[#5d4037] w-4 text-center text-xs"></i>
                          <input
                            required
                            placeholder={t.district}
                            value={formData.district}
                            onChange={e => setFormData(f => ({ ...f, district: e.target.value }))}
                            className="flex-1 bg-transparent outline-none text-sm font-bold text-[#5d4037] placeholder:text-[#5d4037]/30 min-w-0"
                          />
                        </div>
                      </div>

                      <div className="bg-white/60 rounded-xl p-3 border-2 border-[#5d4037]/10 flex items-center gap-3">
                        <i className="fas fa-home text-[#5d4037] w-4 text-center"></i>
                        <input
                          required
                          placeholder={t.houseNumber}
                          value={formData.houseNumber}
                          onChange={e => setFormData(f => ({ ...f, houseNumber: e.target.value }))}
                          className="flex-1 bg-transparent outline-none text-sm font-bold text-[#5d4037] placeholder:text-[#5d4037]/30"
                        />
                      </div>

                      {/* Compact Order summary mini */}
                      <div className="bg-[#5d4037]/5 rounded-xl p-3 space-y-1.5 mt-4">
                        {items.map(i => (
                          <div key={`${i.product.id}-${i.size}`} className="flex justify-between text-[11px] font-bold text-[#5d4037]">
                            <span className={isAr ? "font-kufi" : ""}>{i.product.name} ({i.size}) ×{i.quantity}</span>
                            <span className="font-sans">SAR {(parseFloat(i.product.price) * i.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-[11px] font-bold text-[#5d4037]/60 border-t border-[#5d4037]/10 pt-1.5">
                          <span>{t.delivery}</span><span className="font-sans">SAR {DELIVERY.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-black text-sm text-[#5d4037] pt-1">
                          <span>{t.total}</span><span className="font-sans">SAR {grandTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.fullName || !formData.phone || !formData.city || !formData.district || !formData.houseNumber}
                        className={`w-full mt-4 py-3.5 rounded-full font-black text-sm uppercase tracking-widest bg-[#C0FF72] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 ${isAr ? "font-kufi" : ""}`}
                      >
                        {isSubmitting ? t.connecting : t.payNow + grandTotal.toFixed(2)}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* ── PAYMENT IFRAME STEP ── */}
              {step === "paying" && (
                <motion.div
                  key="paying"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  <div className={`px-6 py-3 flex items-center gap-2 border-b border-[#5d4037]/5 ${isAr ? "flex-row-reverse" : ""}`}>
                    <button onClick={() => setStep("details")} className={`flex items-center gap-2 text-xs font-black text-[#5d4037]/40 hover:text-[#5d4037] transition-colors ${isAr ? "flex-row-reverse" : ""}`}>
                      <i className={`fas ${isAr ? "fa-arrow-right" : "fa-arrow-left"}`}></i> {t.back}
                    </button>
                    <div className="flex-1" />
                    <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
                      <i className="fas fa-lock text-[#6bb7b3] text-xs"></i>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#6bb7b3]">{t.securePayment}</span>
                    </div>
                  </div>
                  <div className="flex-1 relative bg-white">
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
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-8"
                >
                  <motion.img
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    src="/images/starfish-coral.png"
                    className="w-24 h-24 drop-shadow-2xl"
                    alt=""
                  />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6bb7b3] mb-2 font-sans">{t.orderReceived}</p>
                    <h2 className={`text-4xl font-black text-[#5d4037] ${isAr ? "font-kufi" : "font-serif"}`}>{t.seeYouSoon}</h2>
                    <p className={`text-sm font-bold text-[#5d4037]/50 mt-3 leading-relaxed max-w-xs mx-auto ${isAr ? "font-kufi" : "font-sans"}`}>
                      {t.orderConfirmed}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className={`px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest bg-[#5d4037] text-white hover:opacity-80 transition-opacity mt-4 ${isAr ? "font-kufi" : ""}`}
                  >
                    {t.backToBoutique}
                  </button>
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
        </>
      )}
    </AnimatePresence>
  );
}
