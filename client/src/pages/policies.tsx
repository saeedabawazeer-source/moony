import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Policies() {
  return (
    <div className="relative h-[100dvh] w-screen bg-[#e5815c] overflow-hidden">
      <div className="fixed inset-0 z-[100] pointer-events-none border-[12px] lg:border-[20px] border-[#e5815c] rounded-[1.8rem] lg:rounded-[2.8rem]" style={{ boxShadow: 'inset 0 0 0 3px #000000' }} />
      <div className="fixed inset-[8px] lg:inset-[12px] overflow-y-auto z-0 scroll-smooth rounded-[1.4rem] lg:rounded-[2.4rem] overflow-hidden bg-[#fef8e1]" style={{ scrollbarWidth: 'none' }}>
        
        <Header />

        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
          
          {/* Page Title */}
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e5815c] mb-2">Moony Boutique</p>
            <h1 className="text-4xl lg:text-5xl font-serif font-black text-[#5d4037] tracking-tight">Store Policies</h1>
          </div>

          {/* ── REFUND & EXCHANGE ── */}
          <section className="mb-16" id="refund">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#6bb7b3]/20 flex items-center justify-center">
                <i className="fas fa-exchange-alt text-[#6bb7b3]"></i>
              </div>
              <h2 className="text-2xl font-serif font-black text-[#5d4037]">Refund & Exchange Policy</h2>
            </div>
            <div className="space-y-4 text-[#5d4037]/70 font-sans text-sm leading-relaxed">
              <p>We want you to love your Moony pieces. If for any reason you are not completely satisfied, we are here to help.</p>
              
              <h3 className="font-black text-[#5d4037] text-base pt-2">Returns</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Items may be returned within <strong>7 days</strong> of delivery.</li>
                <li>Items must be <strong>unworn, unwashed, and in original packaging</strong> with all tags attached.</li>
                <li>For hygiene reasons, swimwear that has been worn or washed <strong>cannot be returned</strong>.</li>
                <li>To initiate a return, please contact us via WhatsApp or Instagram <strong>@moonyswimwear</strong>.</li>
              </ul>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Exchanges</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>We offer size exchanges within <strong>7 days</strong> of delivery, subject to stock availability.</li>
                <li>Replacement shipping fees are on us for your first exchange.</li>
              </ul>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Refunds</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Once we receive and inspect the returned item, a refund will be processed to your original payment method within <strong>5–10 business days</strong>.</li>
                <li>Shipping fees are non-refundable.</li>
              </ul>
            </div>
          </section>

          {/* ── TERMS OF SERVICE ── */}
          <section className="mb-16" id="terms">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#e5815c]/20 flex items-center justify-center">
                <i className="fas fa-file-contract text-[#e5815c]"></i>
              </div>
              <h2 className="text-2xl font-serif font-black text-[#5d4037]">Terms of Service</h2>
            </div>
            <div className="space-y-4 text-[#5d4037]/70 font-sans text-sm leading-relaxed">
              <p>By placing an order on moonyswimwear.com (or any linked domain), you agree to the following terms:</p>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Orders & Payments</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>All prices are listed in <strong>Saudi Riyals (SAR)</strong> and include VAT where applicable.</li>
                <li>Payment is processed securely through <strong>Tap Payments</strong>. We accept Visa, Mastercard, mada, and Apple Pay.</li>
                <li>Once an order is placed and payment is confirmed, you will receive a confirmation via Telegram/WhatsApp.</li>
              </ul>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Shipping & Delivery</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>We currently deliver within <strong>Saudi Arabia</strong>.</li>
                <li>Orders are typically dispatched within <strong>1–3 business days</strong>.</li>
                <li>Estimated delivery time is <strong>3–7 business days</strong> depending on your location.</li>
                <li>A flat delivery fee of <strong>SAR 56.25</strong> applies to all orders.</li>
              </ul>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Product Descriptions</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>We make every effort to display product colors accurately, but slight variations may occur due to screen settings.</li>
                <li>Product images may show styling accessories that are not included with the purchase.</li>
              </ul>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Limitation of Liability</h3>
              <p>Moony Boutique shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>
            </div>
          </section>

          {/* ── PRIVACY POLICY ── */}
          <section className="mb-16" id="privacy">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#5d4037]/10 flex items-center justify-center">
                <i className="fas fa-shield-alt text-[#5d4037]"></i>
              </div>
              <h2 className="text-2xl font-serif font-black text-[#5d4037]">Privacy Policy</h2>
            </div>
            <div className="space-y-4 text-[#5d4037]/70 font-sans text-sm leading-relaxed">
              <p>Your privacy is important to us. This policy explains how Moony Boutique collects, uses, and protects your personal information.</p>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Information We Collect</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Personal details:</strong> Name, phone number, and delivery address when you place an order.</li>
                <li><strong>Payment information:</strong> Processed securely by Tap Payments. We do <strong>not</strong> store your card details.</li>
                <li><strong>Usage data:</strong> Basic analytics to improve your shopping experience.</li>
              </ul>

              <h3 className="font-black text-[#5d4037] text-base pt-2">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>To process and deliver your orders.</li>
                <li>To communicate order updates and shipping status.</li>
                <li>To improve our website and product offerings.</li>
              </ul>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Data Sharing</h3>
              <p>We do <strong>not</strong> sell or rent your personal information. Data is only shared with:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Tap Payments:</strong> For secure payment processing.</li>
                <li><strong>Shipping partners:</strong> To deliver your order.</li>
              </ul>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Data Security</h3>
              <p>We use industry-standard security measures to protect your information, including SSL encryption and secure payment gateways.</p>

              <h3 className="font-black text-[#5d4037] text-base pt-2">Contact</h3>
              <p>For any privacy-related questions, please reach out to us via Instagram or WhatsApp <strong>@moonyswimwear</strong>.</p>
            </div>
          </section>

          {/* Last updated */}
          <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#5d4037]/30 pt-8 border-t border-[#5d4037]/10">
            Last updated: May 2026
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
