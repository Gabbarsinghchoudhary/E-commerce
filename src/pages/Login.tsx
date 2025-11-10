import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lightbulb, Mail, Send, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendOtp(email);
      setShowOtpInput(true);
      toast.success('OTP sent to your email. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success('Login successful! Welcome back.');
      navigate(from, { replace: true });
    } catch (error: any) {
      setOtp(''); // Clear OTP input on error
      toast.error(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setShowOtpInput(false);
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Lightbulb className="h-16 w-16 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 h-16 w-16 text-cyan-400 blur-2xl opacity-50"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to illuminate your space</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 shadow-2xl">
          <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>Email</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={showOtpInput}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                  placeholder="you@example.com"
                />
                {showOtpInput && (
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            {showOtpInput && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                  <Send className="h-4 w-4 text-cyan-400" />
                  <span>Enter OTP</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 text-center text-2xl tracking-widest"
                  placeholder="_ _ _ _ _ _"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Check your email for the 6-digit OTP code
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : showOtpInput ? (
                <>
                  <span>Verify OTP</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              You'll receive a 6-digit OTP code via email
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-300"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
};
