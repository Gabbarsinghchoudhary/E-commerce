import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Privacy = () => {
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
            Privacy Policy
          </h1>

          <div className="space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">Effective Date: November 30, 2025</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                Welcome to DecorMitra.shop ("us," "we," or "our"). This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you visit our website and use our services. By accessing or using our Service, you agree to the terms outlined in this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">2.1 Personal Information</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Name:</strong> To personalize your shopping experience.</li>
                <li><strong>Contact Information:</strong> Including email address and phone number for order communication.</li>
                <li><strong>Address:</strong> For order fulfillment.</li>
              </ul>

              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">2.2 Payment Information</h3>
              <p><strong>Payment Details:</strong> Processed securely through trusted payment gateways.</p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">2.3 Usage Information</h3>
              <p><strong>Log Data:</strong> Information collected about your visit, such as IP address, browser type, and pages visited.</p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">2.4 IP Addresses</h3>
              <p><strong>IP Address:</strong> We collect and store your IP address for security and analytical purposes. This information helps us identify and block potential security threats and analyze website traffic.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
              <p>
                We use your information for order processing, customer support, communication, and to enhance your shopping experience. We do not sell or share your information with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Cookies and Tracking Technologies</h2>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">4.1 Cookies</h3>
              <p>
                Cookies are used to enhance your shopping experience and track usage statistics. You can adjust your browser settings to refuse cookies, but this may affect certain features of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Third-Party Services</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">5.1 Payment Processors</h3>
              <p>Secure and reputable payment processors are used to facilitate purchases. Your payment information is securely transmitted and processed.</p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">5.2 Analytics</h3>
              <p>Analytics services help us analyze and improve our Service. These services may collect information about your use of the Service and may track your browsing behavior.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Advertising</h2>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">6.1 Facebook and Google Ads</h3>
              <p>
                We use Facebook and Google Ads services for advertising purposes. These services may use cookies and similar technologies to collect information from our website and other sites on the internet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. Geographic Location</h2>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">7.1 Data Storage</h3>
              <p>
                Your personal information may be processed and stored in India. By using our Service, you consent to this processing and storage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">8. Age Restrictions</h2>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">8.1 Children's Privacy</h3>
              <p>
                We do not knowingly collect personal information from individuals under the age of 18. If you are under 18, please do not submit personal information. Parents or guardians can contact us to delete information provided by a minor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">9. Security</h2>
              <p>
                We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">10. Your Rights and Choices</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Access and Correction:</strong> You have the right to access and correct inaccuracies in your personal information.</li>
                <li><strong>Deletion:</strong> You can request the deletion of your personal information.</li>
                <li><strong>IP Address:</strong> You have the right to know how your IP address is collected and used.</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at <a href="mailto:decormitra11@gmail.com" className="text-cyan-400 hover:text-cyan-300">decormitra11@gmail.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">11. Changes to this Privacy Policy</h2>
              <p>
                We reserve the right to update or change this Privacy Policy at any time. Changes are effective immediately upon posting on the Service.
              </p>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">11.1 Notification of Changes</h3>
              <p>
                We will notify users of any material changes to the privacy policy through email or a notice on the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">12. Contact Information</h2>
              <p>
                For any questions about this Privacy Policy, contact us at <a href="mailto:decormitra11@gmail.com" className="text-cyan-400 hover:text-cyan-300">decormitra11@gmail.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">13. Jurisdiction</h2>
              <p>
                This Privacy Policy is governed by and construed in accordance with the laws of India.
              </p>
            </section>

            <p className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              By using our Service, you agree to the terms of this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
