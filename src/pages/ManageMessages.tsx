import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, X, Calendar, User, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { contactAPI } from '../services/api';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

export const ManageMessages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAllMessages();
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Contact Messages</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <X className="h-5 w-5" />
            <span>Close</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-12 text-center">
            <Mail className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No messages yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((message) => (
              <div
                key={message._id}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <User className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {message.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {message.status === 'new' ? (
                      <span className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        <Clock className="h-4 w-4" />
                        <span>New</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Read</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(message.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
