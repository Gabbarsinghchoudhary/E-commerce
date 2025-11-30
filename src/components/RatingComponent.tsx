import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { ratingAPI, Rating as RatingType, handleAPIError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface RatingComponentProps {
  productId: string;
}

export const RatingComponent: React.FC<RatingComponentProps> = ({ productId }) => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RatingType[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReview, setUserReview] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
    if (user) {
      fetchUserRating();
    }
  }, [productId, user]);

  const fetchRatings = async () => {
    try {
      const data = await ratingAPI.getProductRatings(productId);
      setRatings(data.ratings);
      setAverageRating(data.averageRating);
      setTotalRatings(data.totalRatings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRating = async () => {
    try {
      const data = await ratingAPI.getUserRating(productId);
      if (data.rating) {
        setUserRating(data.rating.rating);
        setUserReview(data.rating.review || '');
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  const handleSubmitRating = async () => {
    if (!user) {
      toast.error('Please login to submit a rating');
      return;
    }

    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await ratingAPI.submitRating({
        productId,
        rating: userRating,
        review: userReview.trim() || undefined,
      });
      toast.success('Rating submitted successfully!');
      fetchRatings();
      fetchUserRating();
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setUserRating(star)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-all duration-200`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= (interactive ? (hoverRating || userRating) : rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Display */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Customer Ratings</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {averageRating.toFixed(1)}
          </div>
          <div>
            {renderStars(averageRating)}
            <p className="text-gray-400 text-sm mt-1">{totalRatings} ratings</p>
          </div>
        </div>
      </div>

      {/* Submit Rating (only for logged-in users) */}
      {user && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {userRating > 0 ? 'Update Your Rating' : 'Rate This Product'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
              {renderStars(userRating, true)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Share your experience with this product..."
              />
              <p className="text-xs text-gray-400 mt-1">{userReview.length}/500 characters</p>
            </div>
            <button
              onClick={handleSubmitRating}
              disabled={isSubmitting || userRating === 0}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : userRating > 0 ? 'Update Rating' : 'Submit Rating'}
            </button>
          </div>
        </div>
      )}

      {/* Ratings List */}
      {ratings.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Customer Reviews</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ratings.map((rating) => (
              <div key={rating._id} className="border-b border-slate-700 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-semibold">{rating.user.name}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {renderStars(rating.rating)}
                </div>
                {rating.review && <p className="text-gray-300 text-sm">{rating.review}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
