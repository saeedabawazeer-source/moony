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
        // No tapId, probably direct navigation, just show success for UX fallback
        setPaymentStatus("success");
        return;
      }

      setOrderId(tapId.slice(-8).toUpperCase());

      try {
        const res = await fetch(`/api/verify-charge/${tapId}`);
        const data = await res.json();
        
        if (data.status === "CAPTURED" || data.status === "AUTHORIZED") {
          setPaymentStatus("success");
          clearCart(); // Only clear cart on actual success
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

  return (
    <div className="relative h-[100dvh] w-screen bg-[#e5815c] overflow-hidden selection:bg-[#6bb7b3] selection:text-white font-serif">
      {/* Global Grain Texture Overlay */}
      <div className="noise-overlay" />
      {/* Static Global Frame Border */}
      <div className="fixed-master-frame" />

      {/* Internal Scrollable Content */}
      <div className="internal-scroll-area flex flex-col">
        <section className="relative min-h-full overflow-hidden bg-[#fef8e1] flex flex-col">
          <Header />
          
          <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 lg:py-16 relative z-10 w-full max-w-2xl mx-auto pb-32">
            
            {paymentStatus === "loading" && (
              <div className="flex flex-col items-center justify-center space-y-4 my-20">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold uppercase tracking-widest text-sm font-mono">{isAr ? "جاري التحقق..." : "VERIFYING..."}</p>
              </div>
            )}

            {paymentStatus === "failed" && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 max-w-md w-full text-center mt-12 relative"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                  <i className="fas fa-times text-2xl text-red-600"></i>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-widest text-red-600 mb-2 font-mono">{isAr ? "فشلت العملية" : "PAYMENT FAILED"}</h2>
                <p className="font-bold text-gray-600 mb-6 font-mono text-sm">{errorMessage}</p>
                <Link href="/">
                  <button className="bg-black text-white px-8 py-4 w-full font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors border-2 border-black font-mono">
                    {isAr ? "حاول مرة أخرى" : "TRY AGAIN"}
                  </button>
                </Link>
              </motion.div>
            )}

            {paymentStatus === "success" && (
              <>
                {/* The PAID stamp */}
                <motion.div 
                  initial={{ scale: 3, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: -15 }}
                  transition={{ type: "spring", damping: 12, delay: 0.3 }}
                  className="absolute top-[15%] lg:top-[20%] left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                >
                  <div className="border-[4px] lg:border-[6px] border-green-600 text-green-600 rounded-sm px-8 py-2 lg:px-10 lg:py-3 text-4xl lg:text-5xl font-black tracking-[0.2em] uppercase opacity-90 shadow-sm bg-transparent backdrop-blur-none transform-gpu font-mono whitespace-nowrap">
                    PAID
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] w-full text-left mt-8 relative"
                  dir={isAr ? "rtl" : "ltr"}
                >
                  {/* Receipt Zig-Zag Top Edge (Ticket Effect) */}
                  <div className="absolute -top-2 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDUsMCAxMCwxMCAwLDEwIiBmaWxsPSIjZmZmIi8+PC9zdmc+')] bg-repeat-x"></div>
              <div className="px-6 py-6 border-b-2 border-dashed border-gray-300 bg-white flex justify-between items-center mt-2">
                 <div className="flex flex-col">
                   <div className="flex items-center gap-1.5 mb-1" dir="ltr">
                     <img src="/images/starfish-black.png" alt="Moony Logo" className="w-4 h-4 opacity-80 grayscale" />
                     <p className="text-sm font-black lowercase tracking-tighter text-black font-serif">moony</p>
                   </div>
                   <h2 className={`text-2xl font-black uppercase tracking-widest text-black font-mono`}>
                     {isAr ? "إيصال" : "RECEIPT"}
                   </h2>
                 </div>
                 <div className="text-right">
                   <p className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Copy</p>
                   <p className="font-mono text-[10px] text-gray-400 font-bold">{new Date().toLocaleDateString()}</p>
                 </div>
              </div>

              {orderMetadata && orderMetadata.items ? (
                <div className="px-6 py-6 space-y-6">
                  {orderMetadata.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-300 p-0.5">
                        <img src={item.product?.images?.[0] || "/images/starfish-coral.png"} className="w-full h-full object-cover rounded-sm" alt="" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "المنتج" : "Item"}</span>
                        </div>
                        <h3 className={`font-bold text-lg text-black leading-tight ${isAr ? "font-kufi" : "font-serif"}`}>{item.product?.name || "Item"}</h3>
                        <div className="flex justify-between flex-wrap gap-2 mt-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{isAr ? "المقاس" : "Size"}</span>
                                <h3 className="font-bold text-sm text-black">{item.size}</h3>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{isAr ? "الكمية" : "Qty"}</span>
                                <span className="font-bold text-sm text-black min-w-[1rem] text-center">{item.quantity}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{isAr ? "السعر" : "Price"}</span>
                                <h3 className="font-bold text-sm text-black font-sans">SAR {(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}</h3>
                            </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Separator */}
                  <div className="relative w-full h-8 flex items-center shrink-0 overflow-hidden sm:overflow-visible my-2">
                     <div className="absolute -left-4 sm:-left-10 w-8 h-8 bg-black/5 rounded-full" />
                     <div className="w-full border-t-2 border-dashed border-gray-200" />
                     <div className="absolute -right-4 sm:-right-10 w-8 h-8 bg-black/5 rounded-full" />
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span><span className="font-sans">SAR {orderMetadata.totalPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>{isAr ? "التوصيل" : "Delivery"}</span><span className="text-green-600 font-sans">{isAr ? "مجاناً" : "Free"}</span>
                    </div>
                    {orderMetadata.discountAmount > 0 && (
                      <div className="flex justify-between text-xs font-bold text-[#25D366] uppercase tracking-widest">
                        <span>{isAr ? "خصم (10%)" : "Discount"}</span><span className="font-sans">-SAR {orderMetadata.discountAmount?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end mt-4">
                      <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">{isAr ? "الإجمالي" : "Total Paid"}</span>
                      <span className="text-3xl font-black text-black font-sans leading-none">SAR {orderMetadata.grandTotal?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <h1 className="text-4xl lg:text-6xl font-serif font-black italic tracking-tighter leading-none text-[#000000]">
                    You're in the club.
                  </h1>
                </div>
              )}

              {/* Delivery Details Section */}
              {orderMetadata && orderMetadata.customer && (
                <div className="px-6 py-8 border-t-2 border-dashed border-gray-300 bg-white font-mono">
                  <h3 className={`font-bold text-sm text-black mb-4 uppercase tracking-widest`}>
                    {isAr ? "معلومات التوصيل" : "SHIPPING INFO"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "الاسم" : "NAME"}</span>
                      <span className="text-sm font-bold text-black">{orderMetadata.customer.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "رقم الجوال" : "PHONE"}</span>
                      <span className="text-sm font-bold text-black" dir="ltr">{orderMetadata.customer.phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "العنوان" : "ADDRESS"}</span>
                      <span className="text-sm font-bold text-black text-right max-w-[60%] leading-relaxed">{orderMetadata.customer.address}</span>
                    </div>
                    {orderId && (
                      <div className="flex justify-between pt-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "رقم الطلب" : "ORDER ID"}</span>
                        <span className="text-sm font-black text-black">{orderId}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">*** {isAr ? "شكراً لك" : "THANK YOU"} ***</p>
                    {orderId && <div className="mx-auto w-3/4 h-12 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjMwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIzMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-repeat-x opacity-20"></div>}
                  </div>
                </div>
              )}
              
                  {/* Receipt Zig-Zag Bottom Edge */}
                  <div className="absolute -bottom-2 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIDAsMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat-x"></div>
                </motion.div>
                
                <div className="pt-12 relative w-full max-w-sm">
                  <Link href={isAr ? "/ar" : "/"}>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-black text-white px-10 py-5 rounded-none font-mono font-black uppercase tracking-widest text-[11px] lg:text-[13px] border-[2px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                    >
                      {isAr ? "العودة للمتجر" : "BACK TO BOUTIQUE"}
                    </motion.button>
                  </Link>
                </div>
              </>
            )}
            
          </main>

          <Footer />
        </section>
      </div>
    </div>
  );
}
