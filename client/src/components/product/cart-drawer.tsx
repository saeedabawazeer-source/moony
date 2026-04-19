import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const DELIVERY = 56.25;

export default function CartDrawer() {
  const [formData, setFormData] = useState({ 
    fullName: "", 
    phone: "", 
    city: "", 
    district: "", 
    houseNumber: "" 
  });

  const handleClose = () => {
    closeCart();
    setTimeout(() => {
      setStep("cart");
      setFormData({ fullName: "", phone: "", city: "", district: "", houseNumber: "" });
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fullAddress = `${formData.city}, ${formData.district}, House/Apt: ${formData.houseNumber}`;
    try {
      // Create a combined charge for all cart items
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
        // Open Tap payment in a popup window — user stays on Moony page!
        const popup = window.open(
          data.url,
          "tap_payment",
          "width=520,height=680,left=200,top=100,resizable=yes,scrollbars=yes"
        );
        // Poll for closure
        const timer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(timer);
            setStep("success");
            clearCart();
          }
        }, 800);
      } else {
        setStep("success");
        clearCart();
      }
    } catch {
      setStep("success");
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const grandTotal = totalPrice + DELIVERY;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[90] bg-[#fef8e1] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#5d4037]/10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e5815c]">Your Boutique</p>
                <h2 className="text-2xl font-serif font-black text-[#5d4037]">Cart {items.length > 0 && `(${items.length})`}</h2>
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
                  initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
                      <img src="/images/starfish-coral.png" className="w-24 h-24 opacity-30" alt="" />
                      <p className="font-serif font-black text-2xl text-[#5d4037]/40">Your cart is empty</p>
                      <button onClick={handleClose} className="text-sm font-black text-[#e5815c] underline">Continue Shopping</button>
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
                              <h3 className="font-serif font-black text-[#5d4037] text-base leading-tight">{item.product.name}</h3>
                              <p className="text-xs font-bold text-[#5d4037]/50 mt-0.5">Size: {item.size}</p>
                              <p className="text-sm font-black text-[#e5815c] mt-1">SAR {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                              {/* Quantity controls */}
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
                      <div className="px-6 pb-6 pt-4 border-t-2 border-[#5d4037]/10 space-y-3">
                        <div className="flex justify-between text-sm font-bold text-[#5d4037]/60">
                          <span>Subtotal</span><span>SAR {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-[#5d4037]/60">
                          <span>Delivery</span><span>SAR {DELIVERY.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-[#5d4037] border-t-2 border-[#5d4037]/10 pt-3">
                          <span>Total</span><span>SAR {grandTotal.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => setStep("details")}
                          className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest bg-[#C0FF72] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
                        >
                          Proceed to Checkout →
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
                  initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <button onClick={() => setStep("cart")} className="flex items-center gap-2 text-xs font-black text-[#5d4037]/40 hover:text-[#5d4037] mb-6 transition-colors">
                      <i className="fas fa-arrow-left"></i> Back to Cart
                    </button>
                    <h3 className="font-serif font-black text-2xl text-[#5d4037] mb-6">Delivery Details</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Full Name */}
                      <div className="bg-white/60 rounded-2xl p-4 border-2 border-[#5d4037]/10 flex items-center gap-3">
                        <i className="fas fa-user text-[#e5815c]"></i>
                        <input
                          required
                          placeholder="Your Full Name"
                          value={formData.fullName}
                          onChange={e => setFormData(f => ({ ...f, fullName: e.target.value }))}
                          className="flex-1 bg-transparent outline-none font-serif text-lg text-[#5d4037] placeholder:text-[#5d4037]/30"
                        />
                      </div>

                      {/* Phone */}
                      <div className="bg-white/60 rounded-2xl p-4 border-2 border-[#5d4037]/10 flex items-center gap-3">
                        <i className="fas fa-phone text-[#6bb7b3]"></i>
                        <input
                          required
                          type="tel"
                          placeholder="Phone Number (05xxxxxxxx)"
                          value={formData.phone}
                          onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                          className="flex-1 bg-transparent outline-none font-serif text-lg text-[#5d4037] placeholder:text-[#5d4037]/30"
                        />
                      </div>

                      {/* City */}
                      <div className="bg-white/60 rounded-2xl p-4 border-2 border-[#5d4037]/10 flex items-center gap-3">
                        <i className="fas fa-city text-[#5d4037]"></i>
                        <input
                          required
                          placeholder="City (e.g. Jeddah)"
                          value={formData.city}
                          onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
                          className="flex-1 bg-transparent outline-none font-serif text-lg text-[#5d4037] placeholder:text-[#5d4037]/30"
                        />
                      </div>

                      {/* District / Street */}
                      <div className="bg-white/60 rounded-2xl p-4 border-2 border-[#5d4037]/10 flex items-center gap-3">
                        <i className="fas fa-road text-[#5d4037]"></i>
                        <input
                          required
                          placeholder="District / Street Name"
                          value={formData.district}
                          onChange={e => setFormData(f => ({ ...f, district: e.target.value }))}
                          className="flex-1 bg-transparent outline-none font-serif text-lg text-[#5d4037] placeholder:text-[#5d4037]/30"
                        />
                      </div>

                      {/* House / Apt Number */}
                      <div className="bg-white/60 rounded-2xl p-4 border-2 border-[#5d4037]/10 flex items-center gap-3">
                        <i className="fas fa-home text-[#5d4037]"></i>
                        <input
                          required
                          placeholder="House / Apartment Number"
                          value={formData.houseNumber}
                          onChange={e => setFormData(f => ({ ...f, houseNumber: e.target.value }))}
                          className="flex-1 bg-transparent outline-none font-serif text-lg text-[#5d4037] placeholder:text-[#5d4037]/30"
                        />
                      </div>

                      {/* Order summary mini */}
                      <div className="bg-[#5d4037]/5 rounded-2xl p-4 space-y-2">
                        {items.map(i => (
                          <div key={`${i.product.id}-${i.size}`} className="flex justify-between text-xs font-bold text-[#5d4037]">
                            <span>{i.product.name} ({i.size}) ×{i.quantity}</span>
                            <span>SAR {(parseFloat(i.product.price) * i.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-xs font-bold text-[#5d4037]/50 border-t border-[#5d4037]/10 pt-2">
                          <span>Delivery</span><span>SAR {DELIVERY.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-black text-[#5d4037]">
                          <span>Total</span><span>SAR {grandTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.fullName || !formData.phone || !formData.address}
                        className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest bg-[#C0FF72] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
                      >
                        {isSubmitting ? "Opening Payment..." : "Pay Now — SAR " + grandTotal.toFixed(2) + " →"}
                      </button>
                    </form>
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
                    className="w-28 h-28 drop-shadow-2xl"
                    alt=""
                  />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6bb7b3] mb-2">Order Received</p>
                    <h2 className="text-4xl font-serif font-black text-[#5d4037]">See You Soon!</h2>
                    <p className="text-sm font-bold text-[#5d4037]/50 mt-3 leading-relaxed max-w-xs mx-auto">
                      Your order is confirmed. We'll be in touch shortly to finalize delivery.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest bg-[#5d4037] text-white hover:opacity-80 transition-opacity"
                  >
                    Back to Boutique
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
