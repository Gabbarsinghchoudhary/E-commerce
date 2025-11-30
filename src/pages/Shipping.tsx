import { ArrowLeft, Truck, Zap, MapPin, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Shipping = () => {
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
            Shipping Policy
          </h1>

          <div className="space-y-6 text-gray-300">
            <div className="grid md:grid-cols-4 gap-4 my-8">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
                <MapPin className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">All India</h3>
                <p className="text-sm">Shipping Everywhere</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <Package className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">Free Shipping</h3>
                <p className="text-sm">On All Orders</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                <Zap className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">24 Hours</h3>
                <p className="text-sm">Next Day Dispatch</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <Truck className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">3-5 Days</h3>
                <p className="text-sm">Fast Delivery</p>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Shipping All Across India</h2>
              <p>
                At DecorMitra.shop, we're committed to delivering your favorite products to every corner of India. We offer free shipping on all orders, ensuring that you enjoy a seamless shopping experience without any additional costs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Next Day Dispatch</h2>
              <p>
                We take pride in our prompt service. Your order is our priority, and we aim to dispatch it within 24 hours of receiving your order confirmation. This quick turnaround ensures that you get your hands on your desired items as soon as possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Trusted Courier Partners</h2>
              <p>
                To guarantee a reliable and secure delivery, we have partnered with some of India's most trusted courier companies. Your package is in safe hands, and we ensure that it reaches you in pristine condition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Fast Shipping Times</h2>
              <p>
                We understand the anticipation that comes with online shopping. That's why we've optimized our shipping process to provide you with fast shipping times of 3 to 5 days. Your order will be on its way to you shortly after you place it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Track Your Order</h2>
              <p>
                Stay informed about the status of your shipment with our easy-to-use tracking system. Once your order is dispatched, you'll receive a tracking number via email. Alternatively, use your order ID on our 'Track Your Order' page to monitor your package's journey right from our store to your doorstep.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Order Cancellation</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="mb-3">
                  We understand that plans can change. If you need to cancel your order, please do so promptly. To cancel, email us at{' '}
                  <a href="mailto:decormitra11@gmail.com" className="text-cyan-400 hover:text-cyan-300">
                    decormitra11@gmail.com
                  </a>{' '}
                  or WhatsApp us at{' '}
                  <a href="https://wa.me/919785967653" className="text-cyan-400 hover:text-cyan-300">
                    +91 97-8596-7653
                  </a>{' '}
                  within 24 hours of placing your order.
                </p>
                <p className="font-semibold text-red-400">
                  ⚠️ Unfortunately, orders cannot be cancelled once they are shipped.
                </p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p>
                Your satisfaction is our priority, and our shipping policy is crafted to ensure a smooth and transparent experience for you. If you have any questions or need further assistance, feel free to reach out to our dedicated customer support team.
              </p>
              <p className="text-center font-semibold mt-4">Happy shopping!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
