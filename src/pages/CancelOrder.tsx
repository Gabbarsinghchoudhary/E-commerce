import { ArrowLeft, XCircle, MessageCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CancelOrder = () => {
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
          <div className="flex items-center justify-center mb-6">
            <XCircle className="h-12 w-12 text-red-400 mr-4" />
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Cancel Order
            </h1>
          </div>

          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              To Cancel your order, please follow the following steps:
            </p>

            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Cancellation Steps</h2>
              <ol className="list-decimal list-inside space-y-4 ml-4">
                <li className="text-lg">
                  <strong className="text-cyan-400">WhatsApp Us</strong> on{' '}
                  <a
                    href="https://wa.me/919785967653"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 font-semibold"
                  >
                    +91 97-8596-7653
                  </a>
                </li>
                <li className="text-lg">
                  Please mention your <strong className="text-cyan-400">Order ID</strong> with the <strong className="text-cyan-400">product name</strong>.
                </li>
                <li className="text-lg">
                  Type in <strong className="text-cyan-400">"Cancel Order"</strong> with your <strong className="text-cyan-400">full name</strong> and <strong className="text-cyan-400">city name</strong>.
                </li>
                <li className="text-lg">
                  The system will pick up the details and automatically cancel your order.
                </li>
              </ol>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">Important Notes</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      You can only cancel an order <strong>within 24 hours</strong> of placing it.
                    </li>
                    <li>
                      We <strong>cannot cancel an order</strong> once it has been dispatched.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-2">Warning</h3>
                  <p>
                    A customer will be <strong>permanently banned</strong> from the website, if he/she places an order on Cash on Delivery and later rejects it when it arrives.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Example Message Format</h3>
              <div className="bg-slate-800 border border-gray-700 rounded-lg p-4 font-mono text-sm">
                <p className="text-green-400">Cancel Order</p>
                <p className="text-gray-300 mt-2">Order ID: #ORD-123456</p>
                <p className="text-gray-300">Product: Premium LED Light</p>
                <p className="text-gray-300">Name: Nahar Singh</p>
                <p className="text-gray-300">City: Alwar</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <a
                href="https://wa.me/919785967653"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
                <span>WhatsApp Us to Cancel</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
