import { Link, useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";

export default function Success() {
  const [location] = useLocation();
  const isAr = location.startsWith("/ar");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderMetadata, setOrderMetadata] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "success" | "failed">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const { clearCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const tapId = params.get("tap_id") || params.get("charge_id") || params.get("orderId");
      
      if (!tapId) {
        setPaymentStatus("success");
        return;
      }

      setOrderId(tapId.slice(-8).toUpperCase());

      try {
        const res = await fetch(`/api/verify-charge/${tapId}`);
        const data = await res.json();
        
        if (data.status === "CAPTURED" || data.status === "AUTHORIZED") {
          setPaymentStatus("success");
          clearCart();
        } else {
          setPaymentStatus("failed");
          setErrorMessage(isAr ? "فشلت عملية الدفع أو تم إلغاؤها." : "Payment failed or was cancelled.");
        }
      } catch (err) {
        setPaymentStatus("failed");
        setErrorMessage(isAr ? "فشلت عملية الدفع. يرجى المحاولة مرة أخرى." : "Payment verification failed. Please try again.");
      }
    };

    verifyPayment();

    const savedMeta = localStorage.getItem("moony_order_metadata");
    if (savedMeta) {
      try {
        setOrderMetadata(JSON.parse(savedMeta));
      } catch (e) {}
    }
  }, [clearCart, isAr]);

  // CSS for the zig-zag perforation edges
  const zigzagTop = {
    background: `linear-gradient(135deg, #fef8e1 33.33%, transparent 33.33%) -6px 0, linear-gradient(225deg, #fef8e1 33.33%, transparent 33.33%) -6px 0`,
    backgroundSize: '12px 12px',
    backgroundRepeat: 'repeat-x',
  };
  const zigzagBottom = {
    background: `linear-gradient(315deg, #fef8e1 33.33%, transparent 33.33%) -6px 0, linear-gradient(45deg, #fef8e1 33.33%, transparent 33.33%) -6px 0`,
    backgroundSize: '12px 12px',
    backgroundRepeat: 'repeat-x',
  };

  return (
    <div className="relative h-[100dvh] w-screen bg-[#e5815c] overflow-hidden selection:bg-[#6bb7b3] selection:text-white font-serif">
      <div className="noise-overlay" />
      <div className="fixed-master-frame" />

      <div className="internal-scroll-area flex flex-col">
        <section className="relative min-h-full overflow-hidden bg-[#fef8e1] flex flex-col">
          <Header />
          
          <main className="flex-1 flex flex-col items-center justify-start px-3 py-6 lg:py-12 relative z-10 w-full max-w-lg mx-auto pb-32">
            
            {/* ── LOADING STATE ── */}
            {paymentStatus === "loading" && (
              <div className="flex flex-col items-center justify-center space-y-4 my-20">
                <div className="w-10 h-10 border-2 border-[#5d4037] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-serif italic text-[#5d4037] text-sm">{isAr ? "جاري التحقق..." : "Verifying payment..."}</p>
              </div>
            )}

            {/* ── FAILED STATE ── */}
            {paymentStatus === "failed" && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-8"
              >
                {/* Top perforation */}
                <div className="w-full h-3" style={zigzagTop} />
                
                <div className="bg-white px-6 py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400 mb-2 font-sans">{isAr ? "فشلت العملية" : "Payment Failed"}</p>
                  <h2 className="text-2xl font-serif font-black italic text-black mb-3">{isAr ? "لم يتم الدفع" : "Something went wrong."}</h2>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed">{errorMessage}</p>
                  
                  <div className="border-t border-dashed border-gray-200 pt-6">
                    <Link href="/">
                      <motion.button 
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-4 bg-[#e5815c] text-white font-sans font-bold text-sm uppercase tracking-widest rounded-full hover:bg-[#d0724f] transition-colors"
                      >
                        {isAr ? "حاول مرة أخرى" : "Try Again"}
                      </motion.button>
                    </Link>
                  </div>
                </div>
                
                {/* Bottom perforation */}
                <div className="w-full h-3" style={zigzagBottom} />
              </motion.div>
            )}

            {/* ── SUCCESS STATE ── */}
            {paymentStatus === "success" && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full mt-4 relative"
              >
                {/* Top perforation edge */}
                <div className="w-full h-3" style={zigzagTop} />
                
                {/* ── RECEIPT BODY ── */}
                <div className="bg-white relative overflow-visible">

                  {/* PAID watermark stamp */}
                  <motion.div
                    initial={{ scale: 2.5, opacity: 0, rotate: -12 }}
                    animate={{ scale: 1, opacity: 0.08, rotate: -12 }}
                    transition={{ type: "spring", damping: 14, delay: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <span className="text-[120px] lg:text-[160px] font-serif font-black italic text-green-700 select-none">PAID</span>
                  </motion.div>

                  {/* ── Header ── */}
                  <div className="px-6 pt-8 pb-5 text-center relative z-20">
                    <div className="flex items-center justify-center gap-1.5 mb-4" dir="ltr">
                      <span className="text-lg">✦</span>
                      <p className="text-lg font-black lowercase tracking-tight text-black font-serif">moony</p>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 font-sans">{isAr ? "إيصال الطلب" : "Order Confirmation"}</p>
                    {orderId && (
                      <p className="text-[10px] font-bold text-gray-400 font-sans mt-1">#{orderId} · {new Date().toLocaleDateString()}</p>
                    )}
                  </div>

                  {/* ── Ticket tear line ── */}
                  <div className="relative w-full flex items-center px-0 my-1">
                    <div className="w-4 h-8 bg-[#fef8e1] rounded-r-full shrink-0 -ml-[1px]" />
                    <div className="flex-1 border-t border-dashed border-gray-300" />
                    <div className="w-4 h-8 bg-[#fef8e1] rounded-l-full shrink-0 -mr-[1px]" />
                  </div>

                  {/* ── Items ── */}
                  {orderMetadata && orderMetadata.items ? (
                    <div className="px-6 py-5 space-y-4 relative z-20">
                      {orderMetadata.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img src={item.product?.images?.[0] || "/images/starfish-coral.png"} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-sm text-black leading-snug truncate ${isAr ? "font-kufi" : "font-serif"}`}>{item.product?.name || "Item"}</h3>
                            <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                              {isAr ? "المقاس" : "Size"}: {item.size} · {isAr ? "الكمية" : "Qty"}: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-black font-sans whitespace-nowrap shrink-0">SAR {(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-8 text-center relative z-20">
                      <h1 className="text-3xl font-serif font-black italic text-black">You're in the club.</h1>
                    </div>
                  )}

                  {/* ── Ticket tear line ── */}
                  <div className="relative w-full flex items-center px-0 my-1">
                    <div className="w-4 h-8 bg-[#fef8e1] rounded-r-full shrink-0 -ml-[1px]" />
                    <div className="flex-1 border-t border-dashed border-gray-300" />
                    <div className="w-4 h-8 bg-[#fef8e1] rounded-l-full shrink-0 -mr-[1px]" />
                  </div>

                  {/* ── Totals ── */}
                  {orderMetadata && (
                    <div className="px-6 py-5 space-y-2.5 relative z-20">
                      <div className="flex justify-between text-[11px] text-gray-400 font-sans">
                        <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                        <span>SAR {orderMetadata.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-400 font-sans">
                        <span>{isAr ? "التوصيل" : "Delivery"}</span>
                        <span className="text-green-600">{isAr ? "مجاناً" : "Free"}</span>
                      </div>
                      {orderMetadata.discountAmount > 0 && (
                        <div className="flex justify-between text-[11px] text-green-600 font-sans">
                          <span>{isAr ? "خصم (10%)" : "Discount (10%)"}</span>
                          <span>-SAR {orderMetadata.discountAmount?.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 font-sans font-bold uppercase tracking-wider">{isAr ? "الإجمالي المدفوع" : "Total Paid"}</span>
                        <span className="text-2xl font-black text-black font-sans">SAR {orderMetadata.grandTotal?.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* ── Shipping Info ── */}
                  {orderMetadata && orderMetadata.customer && (
                    <div className="px-6 py-5 border-t border-dashed border-gray-200 relative z-20">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 font-sans mb-3">{isAr ? "معلومات التوصيل" : "Shipping To"}</p>
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold text-black font-sans">{orderMetadata.customer.fullName}</p>
                        <p className="text-xs text-gray-500 font-sans" dir="ltr" style={{textAlign: isAr ? 'right' : 'left'}}>{orderMetadata.customer.phone}</p>
                        <p className="text-xs text-gray-500 font-sans">{orderMetadata.customer.city}, {orderMetadata.customer.district}, {orderMetadata.customer.houseNumber}</p>
                      </div>
                    </div>
                  )}

                  {/* ── Footer ── */}
                  <div className="px-6 py-6 text-center relative z-20">
                    <p className="text-[10px] text-gray-400 font-sans mb-1">{isAr ? "سنتواصل معك عبر واتساب لتنسيق التوصيل" : "We'll contact you via WhatsApp to coordinate delivery."}</p>
                    <p className="text-xs text-gray-400 font-sans mt-3">— ✦ —</p>
                  </div>
                </div>

                {/* Bottom perforation edge */}
                <div className="w-full h-3" style={zigzagBottom} />

                {/* Back button */}
                <div className="pt-8 w-full">
                  <Link href={isAr ? "/ar" : "/"}>
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 bg-[#e5815c] text-white font-sans font-bold text-sm uppercase tracking-widest rounded-full hover:bg-[#d0724f] transition-colors"
                    >
                      {isAr ? "العودة للمتجر" : "Back to Boutique"}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
            
          </main>

          <Footer />
        </section>
      </div>
    </div>
  );
}
