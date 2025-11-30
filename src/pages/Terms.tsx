import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8">
          <h1 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <div className="space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">Effective Date: November 30, 2025</p>

            <p>
              Welcome to DecorMitra.shop ("us", "we", or "our"). Please read these Terms of Service ("Terms") carefully before using our website (the "Service"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. Use of the Service</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">2.1 Eligibility</h3>
              <p>
                You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you are at least 18 years old.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">2.2 User Account</h3>
              <p>
                To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">2.3 Prohibited Activities</h3>
              <p>You may not access or use the Service for any purpose other than that for which we make the Service available. Prohibited activities include, but are not limited to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Violating any laws or regulations.</li>
                <li>Engaging in any fraudulent or misleading activities.</li>
                <li>Interfering with or disrupting the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. Products and Pricing</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">3.1 Product Descriptions</h3>
              <p>
                We make every effort to ensure that product descriptions are accurate. However, we do not warrant that product descriptions are error-free.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">3.2 Pricing</h3>
              <p>
                Prices for products are subject to change without notice. We reserve the right to modify or discontinue the Service without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Payment and Security</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">4.1 Payment Methods</h3>
              <p>
                All payments are processed securely. We accept payment through secure payment gateways and Cash on Delivery (COD). By providing payment information, you represent and warrant that you have the legal right to use any payment method(s) utilized.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">4.2 Billing Information</h3>
              <p>
                You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Shipping and Delivery</h2>
              <p>
                For information on shipping and delivery, please refer to our Shipping Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Returns and Refunds</h2>
              <p>
                For information on returns and refunds, please refer to our Return and Refund Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. Privacy Policy</h2>
              <p>
                Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy for information on how we collect, use, and share your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">8. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of DecorMitra.shop and its licensors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">9. Termination</h2>
              <p>
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">10. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">11. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">12. Contact Information</h2>
              <p>
                For any questions about these Terms, please contact us at <a href="mailto:decormitra11@gmail.com" className="text-cyan-400 hover:text-cyan-300">decormitra11@gmail.com</a>.
              </p>
            </section>

            <p className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              By accessing or using the Service, you agree to these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
