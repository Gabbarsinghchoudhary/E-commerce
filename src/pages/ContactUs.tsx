import { Mail, Phone, MapPin, Send, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

export const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactAPI.submitContact({
        name: formData.name,
        email: formData.email,
        subject: 'Contact Form Submission',
        message: formData.message
      });
      
      toast.success('Message sent successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-cyan-400" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                  <span>Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Your Name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                <span>Message</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Type your message here..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-400" />
              <span>123 Commerce St, NY 10001</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-cyan-400" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>support@ecommerce.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
