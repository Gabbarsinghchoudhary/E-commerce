import { ArrowLeft, Package, RefreshCw, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReturnPolicy = () => {
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
            Return and Refund Policy
          </h1>

          <div className="space-y-6 text-gray-300">
            <p>
              We understand that sometimes your expectations may differ from the received product, and at DecorMitra.shop, we want to ensure your satisfaction. Here's our straightforward and customer-centric return and refund policy:
            </p>

            <div className="grid md:grid-cols-3 gap-4 my-8">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
                <Clock className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">5-Day Return</h3>
                <p className="text-sm">Return within 5 days of delivery</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <RefreshCw className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">Full Refund</h3>
                <p className="text-sm">Get 100% money back</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <Package className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">Easy Process</h3>
                <p className="text-sm">Hassle-free returns</p>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5-Day Return Period</h2>
              <p>
                We offer a 5-day return period from the date you receive your order. If within this time frame you find that the product doesn't meet your expectations or has any defects, we are here to assist you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Hassle-Free Returns</h2>
              <p className="mb-3">To initiate a return, please follow these steps:</p>
              <ol className="list-decimal list-inside ml-4 space-y-2">
                <li>
                  <strong>Contact Us:</strong> Reach out to us via email at{' '}
                  <a href="mailto:decormitra11@gmail.com" className="text-cyan-400 hover:text-cyan-300">
                    decormitra11@gmail.com
                  </a>{' '}
                  or WhatsApp us at{' '}
                  <a href="https://wa.me/919785967653" className="text-cyan-400 hover:text-cyan-300">
                    +91 97-8596-7653
                  </a>{' '}
                  within the 5-day period, stating the reason for the return.
                </li>
                <li>
                  <strong>Return Approval:</strong> Our customer support team will guide you through the return process and provide you with a return authorization if the conditions are met.
                </li>
                <li>
                  <strong>Packaging:</strong> Ensure the product is unused, in its original packaging, and includes all accessories.
                </li>
                <li>
                  <strong>Return Shipment:</strong> Ship the product back to us using a reliable courier service.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Full Refund Guarantee</h2>
              <p>
                Once we receive and inspect the returned item and approve the return, we will initiate a full refund of the order amount. Please allow 3 business days for the refund to be processed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Common Conditions for Return and Refund Approval</h2>
              <p className="mb-3">To ensure a smooth return and refund process, please note the following conditions:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Unused Condition:</strong> The product must be unused and in its original packaging.</li>
                <li><strong>Initiate Within 5 Days:</strong> The return must be initiated within the specified 5-day period from the date of receiving the order.</li>
                <li><strong>Approval Process:</strong> Returns are subject to approval by our customer support team.</li>
                <li><strong>Product Integrity:</strong> The product must be in resalable condition with all accessories included.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Unpacking Video Recommendation</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p>
                  <strong className="text-yellow-400">Important:</strong> To expedite the return approval process, we recommend creating an unpacking video when you receive your order. This video can serve as evidence in case there are any discrepancies or defects. Please include clear footage of unboxing, showcasing the product, and highlighting any concerns.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Our Commitment to Your Satisfaction</h2>
              <p>
                Your satisfaction is our top priority at DecorMitra.shop. We are dedicated to providing a hassle-free and transparent return process because we care about your shopping experience. If you have any questions or concerns, our friendly customer support team is here to assist you.
              </p>
            </section>

            <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-center font-semibold">
                Thank you for choosing DecorMitra.shop. Happy shopping!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
