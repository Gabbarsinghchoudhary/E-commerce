import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Trash2, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';

export const ManageAdmins = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { adminEmails, addAdmin, removeAdmin, loading } = useAdmin();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    navigate('/');
    return null;
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addAdmin(newAdminEmail);
      setNewAdminEmail('');
      toast.success('Admin added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (window.confirm(`Are you sure you want to remove ${email} as admin?`)) {
      try {
        await removeAdmin(email);
        toast.success('Admin removed successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to remove admin. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Manage Admins</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="h-5 w-5 text-cyan-400 mr-2" />
              Current Admins
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {adminEmails.map((admin) => (
                  <div
                    key={admin.email}
                    className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4"
                  >
                    <div>
                      <div className="text-white font-medium">{admin.email}</div>
                      {admin.addedBy && (
                        <div className="text-sm text-gray-400">
                          Added by: {admin.addedBy}
                        </div>
                      )}
                      <div className="text-sm text-gray-400">
                        Added on: {admin.dateAdded}
                      </div>
                    </div>
                    {admin.email.toLowerCase() !== 'jatinnikumbh7@gmail.com' && (
                      <button
                        onClick={() => handleRemoveAdmin(admin.email)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                {adminEmails.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No admins found</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <UserPlus className="h-5 w-5 text-cyan-400 mr-2" />
              Add New Admin
            </h2>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Add Admin</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};