import { ArrowLeft, Heart, Users, Award, Target, Shield, Truck, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AboutUs = () => {
  const navigate = useNavigate();

  const founders = [
    { 
      name: 'Nahar Singh', 
      role: 'Founder & CEO', 
      position: 'Chief Executive Officer',
      linkedin: '#'
    },
    { 
      name: 'Gabbar Singh', 
      role: 'Co-Founder & CMO', 
      position: 'Chief Marketing Officer',
      linkedin: 'https://www.linkedin.com/in/gabbar-singh-244746216'
    },
    { 
      name: 'Kamal Singh', 
      role: 'Co-Founder & COO', 
      position: 'Chief Operations Officer',
      linkedin: '#'
    },
    { 
      name: 'Jatin Yadav', 
      role: 'Co-Founder & CTO', 
      position: 'Chief Technology Officer',
      linkedin: 'https://www.linkedin.com/in/jatin-yadav-43b8a1252'
    },
  ];

  const features = [
    { icon: Shield, title: 'Quality Products', description: 'Handpicked selection meeting our high standards' },
    { icon: Truck, title: 'Free Shipping', description: 'Free delivery across India' },
    { icon: Award, title: '100% Buyer Protection', description: 'Hassle-free returns and refunds' },
    { icon: Target, title: 'Tracking Available', description: 'Track all your orders in real-time' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 text-center">
            <div className="flex justify-center mb-6">
              <Heart className="h-16 w-16 text-cyan-400 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              About DecorMitra
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your Ultimate Shopping Destination for Quality Home Décor and Lighting Solutions
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-cyan-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              At DecorMitra.shop, our focus is to make you feel special. We're on a mission to create on-trend, high-quality products accessible to absolutely everyone. Our goal is to make your online shopping experience straightforward, enjoyable, and 100% risk-free.
            </p>
          </div>

          {/* About Us Content */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Who We Are</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                DecorMitra is an all-around lifestyle and home improvement brand specializing in premium lighting solutions and home décor. We offer products of a wide variety from decorative lights to ambient lighting solutions. All the products are hand-picked by our team of experts and quality tested.
              </p>
              <p>
                We believe in quality over quantity. Every product on our platform meets our high standards and is sourced from trusted suppliers. Our commitment to transparent and fair pricing means no hidden fees – just great value for your money.
              </p>
              <p>
                To make your customer experience 100% risk-free at DecorMitra, we offer Cash on Delivery on all orders and free shipping pan India. With our hassle-free 5-day return policy and full refund guarantee, your satisfaction is always our top priority.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 text-center hover:border-cyan-500/40 transition-all duration-300"
              >
                <feature.icon className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Why Choose DecorMitra?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">✅ Diverse Selection</h3>
                <p>Explore a wide range of lighting and home décor products. We cater to your diverse tastes and preferences.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">✅ Customer-Centric Approach</h3>
                <p>We're here for you. Our customer support team is ready to assist, ensuring a smooth shopping experience.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">✅ Secure Payment Options</h3>
                <p>Multiple secure payment methods including Cash on Delivery for your convenience.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">✅ Real-Time Tracking</h3>
                <p>Track your order from our warehouse to your doorstep with tracking numbers for all orders.</p>
              </div>
            </div>
          </div>

          {/* Meet the Team */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-cyan-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Meet the Team</h2>
            </div>
            <p className="text-gray-300 text-lg mb-8">
              Behind DecorMitra is a dedicated team working to make your shopping experience exceptional. We're not just a faceless platform – we're real people committed to serving you better.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {founders.map((founder, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6 text-center hover:border-cyan-500/40 transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {founder.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{founder.name}</h3>
                  <p className="text-cyan-400 text-sm font-medium mb-1">{founder.role}</p>
                  <p className="text-gray-400 text-xs mb-3">{founder.position}</p>
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-300"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Section */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Our Vision</h2>
            <p className="text-gray-300 text-lg text-center leading-relaxed max-w-3xl mx-auto">
              A dream of delivering not just products, but smiles, convenience, and a touch of magic to people's lives. We are committed to deliver products that make your life easier, save time and human effort, are easy on the pocket, and most importantly bring a smile to your face. This has helped us stand as a leader in our industry.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-300 text-lg mb-6">
              Have questions, suggestions, or just want to say hello? Reach out to us anytime. Your feedback means a lot to us.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="mailto:decormitra11@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Email: decormitra11@gmail.com
              </a>
              <a
                href="https://wa.me/919785967653"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                WhatsApp: +91 97-8596-7653
              </a>
            </div>
          </div>

          {/* Thank You Section */}
          <div className="text-center py-8">
            <p className="text-2xl font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
              Thank you for choosing DecorMitra.shop as your shopping destination!
            </p>
            <p className="text-xl text-gray-300 mt-4">
              Let's make every day a little more exciting and every purchase a memorable experience.
            </p>
            <p className="text-3xl font-bold text-white mt-6">Happy Shopping! 🎉</p>
            <p className="text-cyan-400 mt-2">Team DecorMitra</p>
          </div>
        </div>
      </div>
    </div>
  );
};
