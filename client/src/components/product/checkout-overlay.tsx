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

type Step = "selection" | "details" | "success";

export default function CheckoutOverlay({ 
  isOpen, 
  onClose, 
  product, 
  size, 
  quantity,
  isArabic = false 
}: CheckoutOverlayProps) {
  const [step, setStep] = useState<Step>("selection");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = parseFloat(product.price) * quantity;
  const delivery = 55;
  const total = subtotal + delivery;

  const handleNext = () => {
    if (step === "selection") setStep("details");
  };

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
        setStep("success");
      }
    } catch (err) {
      setStep("success"); // For demo/personal concierge flow
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setStep("selection");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-[8px] lg:inset-[12px] z-[90] flex items-center justify-center p-4 lg:p-8 rounded-[1.4rem] lg:rounded-[2.4rem] overflow-hidden"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#fef8e1]" onClick={reset} />

          {/* Close Button */}
          <button 
            onClick={reset}
            className="absolute top-4 right-4 lg:top-8 lg:right-8 text-[#5d4037] hover:rotate-90 transition-transform z-[110]"
          >
            <i className="fas fa-times text-xl lg:text-2xl"></i>
          </button>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl z-[105]"
          >
             <div className="px-4 py-6 lg:p-12 flex flex-col items-center justify-center relative">
               
               {/* Progress Stars */}
               <div className="absolute top-8 left-1/2 -translate-x-1/2 flex space-x-4 space-x-reverse items-center opacity-30">
                  <i className={`fas fa-star transition-all duration-500 ${step === 'selection' || step === 'details' || step === 'success' ? 'text-[#e5815c] opacity-100 scale-125' : ''}`}></i>
                  <div className="w-8 lg:w-16 h-[2px] bg-[#5d4037]/20" />
                  <i className={`fas fa-star transition-all duration-500 ${step === 'details' || step === 'success' ? 'text-[#e5815c] opacity-100 scale-125' : ''}`}></i>
                  <div className="w-8 lg:w-16 h-[2px] bg-[#5d4037]/20" />
                  <i className={`fas fa-star transition-all duration-500 ${step === 'success' ? 'text-[#e5815c] opacity-100 scale-125' : ''}`}></i>
               </div>

               <AnimatePresence mode="wait">
                  {step === "selection" && (
                    <motion.div 
                      key="step1"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="w-full flex flex-col items-center space-y-8 lg:space-y-12"
                    >
                      <div className="text-center space-y-2">
                        <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-[#e5815c]">
                          {isArabic ? "المرحلة الأولى: تأكيد الاختيار" : "Step 01: The Curated Selection"}
                        </p>
                        <h2 className="text-4xl lg:text-7xl font-serif font-black tracking-tighter">
                          {isArabic ? "طلبك المثالي" : "Your Perfect Set"}
                        </h2>
                      </div>

                      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
                         <motion.div 
                           animate={{ y: [-5, 5, -5] }}
                           transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                           className="w-48 h-48 lg:w-64 lg:h-64 rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl border-[10px] lg:border-[10px] border-white"
                         >
                            <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                         </motion.div>
                         <div className="text-center lg:text-left space-y-4">
                            <div className="space-y-1">
                               <h3 className="text-2xl lg:text-4xl font-serif font-black">{product.name}</h3>
                               <p className="text-xs lg:text-base font-bold opacity-30 uppercase tracking-widest italic leading-none">
                                 {isArabic ? "المقاس:" : "Size:"} {size} • {isArabic ? "الكمية:" : "Qty:"} {quantity}
                               </p>
                            </div>
                            <div className="flex flex-col items-center lg:items-start">
                               <span className="text-3xl lg:text-5xl font-serif font-black text-[#e5815c]">{total} SAR</span>
                               <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">{isArabic ? "شاملاً التوصيل" : "Including Delivery"}</p>
                            </div>
                         </div>
                      </div>

                      <button 
                        onClick={handleNext}
                        className="btn-premium-gradient px-12 py-5 lg:py-6 text-sm lg:text-lg font-black uppercase tracking-widest shadow-2xl hover:scale-105"
                      >
                         {isArabic ? "تأكيد واستمرار ★" : "Confirm & Continue ★"}
                      </button>
                    </motion.div>
                  )}

                  {step === "details" && (
                    <motion.div 
                      key="step2"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="w-full max-w-xl flex flex-col items-center space-y-8 lg:space-y-12"
                    >
                      <div className="text-center space-y-2">
                        <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-[#e5815c]">
                          {isArabic ? "المرحلة الثانية: معلومات التوصيل" : "Step 02: Courier Details"}
                        </p>
                        <h2 className="text-4xl lg:text-7xl font-serif font-black tracking-tighter">
                          {isArabic ? "أين نلتقي؟" : "Where to Meet?"}
                        </h2>
                      </div>

                      <div className="w-full space-y-4 lg:space-y-6">
                         <div className="bg-white/50 p-2 rounded-full border-2 border-[#5d4037]/10 flex items-center">
                            <div className="w-10 lg:w-16 flex justify-center text-[#e5815c]">
                               <i className="fas fa-user-star text-sm lg:text-xl"></i>
                            </div>
                            <input 
                              placeholder={isArabic ? "الاسم الكامل" : "Your Full Name"}
                              value={formData.fullName}
                              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              className="flex-1 bg-transparent py-3 lg:py-5 outline-none font-serif text-lg lg:text-2xl"
                            />
                         </div>
                         <div className="bg-white/50 p-2 rounded-full border-2 border-[#5d4037]/10 flex items-center">
                            <div className="w-10 lg:w-16 flex justify-center text-[#6bb7b3]">
                               <i className="fas fa-phone-star text-sm lg:text-xl"></i>
                            </div>
                            <input 
                              type="tel"
                              placeholder={isArabic ? "الرقم للتواصل" : "Contact Phone"}
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="flex-1 bg-transparent py-3 lg:py-5 outline-none font-serif text-lg lg:text-2xl"
                            />
                         </div>
                         <div className="bg-white/50 p-2 rounded-full border-2 border-[#5d4037]/10 flex items-center">
                            <div className="w-10 lg:w-16 flex justify-center text-[#5d4037]">
                               <i className="fas fa-map-marker-alt text-sm lg:text-xl"></i>
                            </div>
                            <input 
                              placeholder={isArabic ? "المدينة / الحي" : "City / Location"}
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                              className="flex-1 bg-transparent py-3 lg:py-5 outline-none font-serif text-lg lg:text-2xl"
                            />
                         </div>
                      </div>

                      <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.fullName || !formData.phone}
                        className="btn-premium-gradient px-12 py-5 lg:py-6 text-sm lg:text-lg font-black uppercase tracking-widest shadow-2xl hover:scale-105 disabled:opacity-50"
                      >
                         {isSubmitting ? (isArabic ? 'جاري التحضير...' : 'PREPARING...') : (isArabic ? 'جاهزة للتألق ★' : 'READY TO SHINE ★')}
                      </button>
                    </motion.div>
                  )}

                  {step === "success" && (
                    <motion.div 
                      key="step3"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full flex flex-col items-center space-y-8 text-center"
                    >
                      <motion.div 
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="w-32 h-32 lg:w-48 lg:h-48"
                      >
                         <img src="/images/starfish-coral.png" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(229,129,92,0.4)]" alt="" />
                      </motion.div>
                      
                      <div className="space-y-2">
                        <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-[#6bb7b3]">
                          {isArabic ? "اكتملت المهمة" : "Journey Complete"}
                        </p>
                        <h2 className="text-4xl lg:text-7xl font-serif font-black tracking-tighter">
                          {isArabic ? "نراكم قريباً!" : "See You Soon!"}
                        </h2>
                        <p className="text-[11px] lg:text-lg font-bold opacity-40 max-w-sm mx-auto leading-relaxed">
                          {isArabic ? "لقد استلمنا طلبك ★ سنتصل بك خلال دقائق لتأكيد تفاصيل الدفع والتسجيل." : "Your selection is safe with us ★ We will contact you within minutes to finalize everything personally."}
                        </p>
                      </div>

                      <button 
                        onClick={reset}
                        className="bg-[#000000] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs lg:text-sm hover:brightness-110 shadow-xl"
                      >
                         {isArabic ? "العودة للبوتيك" : "Back to Boutique"}
                      </button>
                    </motion.div>
                  )}
               </AnimatePresence>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
