import { ArrowLeft, HelpCircle, Mail, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FAQs = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What products do you sell on DecorMitra.shop?",
      answer: "We offer a diverse range of products spanning categories such as lighting, home decor, and decorative items. Explore our website to discover our extensive collection."
    },
    {
      question: "How can I place an order?",
      answer: "Placing an order is simple! Navigate our website, select your desired products, and proceed through the checkout process. No account creation is required."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods, including credit/debit cards, net banking, and Cash on Delivery (COD) for your convenience. Rest assured, our payment processes are secure and reliable."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive a tracking number via email. Track your order using this number on our 'Track Your Order' page. For further assistance, reach out to our support team."
    },
    {
      question: "How long will it take to receive a tracking number?",
      answer: "We have a next day dispatch policy, so all orders are allocated the tracking numbers within 24 hours. You will receive the tracking number on your email address. You can also contact us to get the tracking information."
    },
    {
      question: "Will I receive a confirmation number when I place my order?",
      answer: "Yes, all customers will receive confirmation after placing their orders on their emails instantly. (NOTE: Please contact us if you don't receive one within 12 hours)"
    },
    {
      question: "What is Your Return and Refund Policy?",
      answer: "We offer a hassle-free 5-day return window. If you're unsatisfied with your purchase, you can request a return, and upon approval, receive a full refund. Detailed information is available in our Return and Refund Policy."
    },
    {
      question: "How do I cancel my order?",
      answer: "Orders can be cancelled within 24 hours of placement. Contact our customer support team or email decormitra11@gmail.com. Once an order is shipped, it cannot be cancelled."
    },
    {
      question: "Who can I contact if I have a problem with my order?",
      answer: "All inquiries can be forwarded to decormitra11@gmail.com and you can also WhatsApp us at +91 97-8596-7653"
    },
    {
      question: "Can I change my shipping address after placing an order?",
      answer: "We're sorry, but once an order is confirmed, we cannot change the shipping address. Please double-check your address during checkout."
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer: "Yes, we do! You can choose Cash on Delivery as a payment method during checkout. Enjoy the convenience of paying for your order upon delivery."
    },
    {
      question: "Is shipping free?",
      answer: "Yes, we offer free shipping on all orders delivered within India."
    },
    {
      question: "Why should I create an account on DecorMitra.shop?",
      answer: "No account creation is necessary. We provide a seamless shopping experience without the need for accounts. Your order updates, including tracking numbers, will be sent to your email."
    },
    {
      question: "Do you have a physical store where I can make purchases?",
      answer: "We operate exclusively online. All purchases can be made through our website for a convenient and efficient shopping experience."
    }
  ];

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
            <HelpCircle className="h-12 w-12 text-cyan-400 mr-4" />
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
          </div>

          <p className="text-gray-300 text-center mb-8">
            Here are a few of the frequently asked questions. To provide you with the best customer experience, your feedback is greatly encouraged. If you have any questions please send us an email at{' '}
            <a href="mailto:decormitra11@gmail.com" className="text-cyan-400 hover:text-cyan-300">
              decormitra11@gmail.com
            </a>
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2 flex items-start">
                  <span className="text-cyan-400 mr-2">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-gray-300 ml-6">
                  <span className="text-green-400 mr-2">A:</span>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Still Have Questions?</h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="mailto:decormitra11@gmail.com"
                className="flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>Email Us</span>
              </a>
              <a
                href="https://wa.me/919785967653"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
