import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Product } from "@shared/schema";

interface CheckoutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  size: string;
  quantity: number;
  isArabic?: boolean;
}

export default function CheckoutOverlay({ 
  isOpen, 
  onClose, 
  product, 
  size, 
  quantity,
  isArabic = false 
}: CheckoutOverlayProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = parseFloat(product.price) * quantity;
  const delivery = 55;
  const total = subtotal + delivery;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simplified order submission
      const res = await fetch("/api/create-charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.id,
          quantity,
          customer: {
            firstName: formData.fullName,
            phone: formData.phone,
            address: formData.city,
          },
          size,
          origin: window.location.origin
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(isArabic ? "حدث خطأ في معالجة الطلب" : "There was an issue processing your order.");
      }
    } catch (err) {
      alert(isArabic ? "حدث خطأ في الاتصال" : "Connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 lg:px-0"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md" onClick={onClose} />
          
          {/* Boutique Frame Replication */}
          <div className="noise-overlay pointer-events-none" />
          <div className="fixed-master-frame pointer-events-none" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-12 right-12 lg:top-20 lg:right-20 text-[#5d4037] hover:scale-110 transition-transform z-[110]"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative w-full max-w-5xl bg-white rounded-[3rem] lg:rounded-[5rem] border-2 border-[#5d4037]/5 shadow-2xl overflow-hidden z-[105]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[75vh]">
              
              {/* Summary Side */}
              <div className="bg-[#fef8e1] p-10 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#5d4037]/5">
                <div className="space-y-6 lg:space-y-10">
                  <div className="space-y-2">
                    <p className="font-sans font-black uppercase tracking-widest text-[9px] lg:text-[11px] text-[#e5815c]">
                      {isArabic ? "اختيارك من موني" : "Your Moony Selection"}
                    </p>
                    <h2 className="text-4xl lg:text-7xl font-serif font-black tracking-tighter leading-none">
                      {isArabic ? "ملخص الطلب" : "The Summary"}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-6 space-x-reverse">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl overflow-hidden shadow-lg">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                       <h3 className="text-xl lg:text-3xl font-serif font-black">{product.name}</h3>
                       <p className="text-xs lg:text-sm font-black opacity-40 uppercase tracking-widest">
                         {isArabic ? "المقاس:" : "Size:"} {size} • {isArabic ? "الكمية:" : "Qty:"} {quantity}
                       </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 space-y-3">
                   <div className="flex justify-between text-xs lg:text-sm font-black opacity-40 uppercase tracking-widest">
                      <span>{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
                      <span>{subtotal} SAR</span>
                   </div>
                   <div className="flex justify-between text-xs lg:text-sm font-black opacity-40 uppercase tracking-widest">
                      <span>{isArabic ? "التوصيل" : "Delivery"}</span>
                      <span>{delivery} SAR</span>
                   </div>
                   <div className="pt-4 flex justify-between items-end border-t border-[#5d4037]/10">
                      <span className="text-sm lg:text-base font-black uppercase tracking-widest">{isArabic ? "الإجمالي" : "Total Amount"}</span>
                      <span className="text-2xl lg:text-5xl font-serif font-black">{total} SAR</span>
                   </div>
                </div>
              </div>

              {/* Form Side */}
              <div className="p-10 lg:p-16 flex flex-col justify-center">
                 <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-10">
                    <div className="space-y-4 lg:space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] lg:text-xs font-black uppercase tracking-widest opacity-40">
                            {isArabic ? "الاسم الكامل" : "Full Name"}
                          </label>
                          <input 
                            required
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full bg-transparent border-b-2 border-[#5d4037]/10 py-2 lg:py-4 font-serif text-xl lg:text-3xl outline-none focus:border-[#e5815c] transition-colors"
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] lg:text-xs font-black uppercase tracking-widest opacity-40">
                            {isArabic ? "رقم الجوال" : "Phone Number"}
                          </label>
                          <input 
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-transparent border-b-2 border-[#5d4037]/10 py-2 lg:py-4 font-serif text-xl lg:text-3xl outline-none focus:border-[#e5815c] transition-colors"
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] lg:text-xs font-black uppercase tracking-widest opacity-40">
                            {isArabic ? "المدينة / تفاصيل التوصيل" : "City / Delivery Location"}
                          </label>
                          <input 
                            required
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="w-full bg-transparent border-b-2 border-[#5d4037]/10 py-2 lg:py-4 font-serif text-xl lg:text-3xl outline-none focus:border-[#e5815c] transition-colors"
                          />
                       </div>
                    </div>

                    <div className="pt-4 lg:pt-8 w-full">
                       <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-premium-gradient py-6 lg:py-8 text-sm lg:text-xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                       >
                        {isSubmitting ? (isArabic ? 'جاري الطلب...' : 'Ordering...') : (isArabic ? 'إرسال الطلب الآن' : 'Send Order Now')}
                       </button>
                       <p className="text-center text-[9px] lg:text-[11px] font-bold opacity-30 mt-6 lg:mt-8 uppercase tracking-widest">
                          {isArabic ? "سنتواصل معك هاتفياً لإكمال عملية الدفع والتوصيل" : "We'll contact you instantly to finalize payment and delivery"}
                       </p>
                    </div>
                 </form>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
