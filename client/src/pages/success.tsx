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

  const { clearCart } = useCart();

  useEffect(() => {
    // Extract Tap charge ID or generic order ID from URL if present
    const params = new URLSearchParams(window.location.search);
    const tapId = params.get("tap_id") || params.get("charge_id") || params.get("orderId");
    if (tapId) {
      // Shorten the long Tap charge ID (e.g. chg_TS02... -> last 8 chars)
      setOrderId(tapId.slice(-8).toUpperCase());
    }
    
    // Try to get metadata from localStorage
    const savedMeta = localStorage.getItem("moony_order_metadata");
    if (savedMeta) {
      try {
        setOrderMetadata(JSON.parse(savedMeta));
      } catch (e) {}
    }

    // Clear the cart securely since they completed checkout
    clearCart();
  }, [clearCart]);

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
            
            {/* The PAID stamp */}
            <motion.div 
              initial={{ scale: 3, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: -15 }}
              transition={{ type: "spring", damping: 12, delay: 0.3 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
              <div className="border-[8px] border-green-600 text-green-600 rounded-3xl px-12 py-4 text-4xl lg:text-6xl font-black tracking-[0.2em] uppercase opacity-95 shadow-[0_0_50px_rgba(34,197,94,0.3)] bg-green-50/90 backdrop-blur-md transform-gpu font-sans whitespace-nowrap">
                PAID
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full text-left overflow-hidden mt-8"
              dir={isAr ? "rtl" : "ltr"}
            >
              <div className="px-6 py-6 border-b-2 border-dashed border-gray-200 bg-gray-50 flex justify-between items-center">
                 <div className="flex items-center gap-2" dir="ltr">
                   <img src="/images/starfish-black.png" alt="Moony Logo" className="w-4 h-4 opacity-50" />
                   <p className="text-sm font-black lowercase tracking-tighter text-gray-500 font-serif">moony</p>
                 </div>
                 <h2 className={`text-xl font-bold text-black ${isAr ? "font-kufi" : "font-serif"}`}>
                   {isAr ? "إيصال الطلب" : "Receipt"}
                 </h2>
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
                <div className="px-6 py-6 border-t-2 border-dashed border-gray-200 bg-gray-50">
                  <h3 className={`font-bold text-xl text-black mb-4 ${isAr ? "font-kufi" : "font-serif"}`}>
                    {isAr ? "تفاصيل التوصيل" : "Delivery Details"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "الاسم" : "Name"}</span>
                      <span className="text-sm font-bold text-black">{orderMetadata.customer.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "رقم الجوال" : "Phone"}</span>
                      <span className="text-sm font-bold text-black" dir="ltr">{orderMetadata.customer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "العنوان" : "Address"}</span>
                      <span className="text-sm font-bold text-black text-right max-w-[60%]">{orderMetadata.customer.address}</span>
                    </div>
                    {orderId && (
                      <div className="flex justify-between border-t border-gray-200 mt-4 pt-4">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? "رقم الطلب" : "Order Number"}</span>
                        <span className="text-sm font-bold text-black font-mono">{orderId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
            
            <div className="pt-8 relative w-full max-w-sm">
              <Link href={isAr ? "/ar" : "/"}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[#C0FF72] text-[#000000] px-10 py-5 rounded-full font-sans font-black uppercase tracking-widest text-[11px] lg:text-[13px] border-[2px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  {isAr ? "العودة للمتجر" : "Back to Boutique"}
                </motion.button>
              </Link>
            </div>
            
          </main>

          <Footer />
        </section>
      </div>
    </div>
  );
}
