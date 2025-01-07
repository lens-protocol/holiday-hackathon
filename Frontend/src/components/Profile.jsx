import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { 
  Calendar, Clock, MapPin, Users, Ticket, MessageCircle,
  X, Send, Loader2, Star, ExternalLink, CheckCircle,
  AlertCircle, Plus, DollarSign, Sparkles, QrCode
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useContract } from '../hooks/useContract'

// StarRating Component
const StarRating = ({ rating, onRatingChange, size = 'default', readonly = false }) => {
  const [hover, setHover] = useState(null);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`
            ${size === 'large' ? 'w-6 h-6' : 'w-4 h-4'}
            ${(hover || rating) >= star ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}
            ${!readonly && 'cursor-pointer transition-colors'}
          `}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(null)}
        />
      ))}
    </div>
  );
};

// Review Stats Component
const ReviewStats = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((acc, review) => acc + Number(review.stars), 0) / totalReviews 
    : 0;

  return (
    <div className="flex justify-between items-center mb-6 px-2">
      <div className="flex items-center gap-4">
        <StarRating rating={averageRating} readonly size="large" />
        <span className="text-lg font-medium text-white">
          {averageRating.toFixed(1)}
        </span>
      </div>
      <div className="text-sm text-gray-400">
        {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
      </div>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => (
  <Card className="p-4 border border-gray-800 hover:border-violet-500/30 transition-all duration-200">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <StarRating rating={Number(review.stars)} readonly />
        <p className="text-sm text-gray-400">
          By: {review.reviewer.slice(0, 6)}...{review.reviewer.slice(-4)}
        </p>
      </div>
      <p className="text-xs text-violet-400">
        {new Date(review.timestamp).toLocaleDateString()}
      </p>
    </div>
    <p className="text-gray-200 break-words">{review.comment}</p>
  </Card>
);

// Review Modal Component
const ReviewModal = ({ isOpen, onClose, reviews, event, onSubmitReview }) => {
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim() || rating === 0) return;
    
    setSubmitting(true);
    try {
      const timestamp = new Date().toISOString();
      await onSubmitReview(event.id, newReview, timestamp, rating);
      setNewReview('');
      setRating(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{event.Name}</h3>
                  <p className="text-sm text-gray-400 mt-1">Event Reviews</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ReviewStats reviews={reviews} />
            </div>

            <div className="p-6 max-h-[40vh] overflow-y-auto space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                reviews.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-400">Your Rating</label>
                  <StarRating rating={rating} onRatingChange={setRating} size="large" />
                </div>
                
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full h-24 bg-gray-800 rounded-lg p-3 text-white placeholder-gray-400 border border-gray-700 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 resize-none"
                  required
                />
                
                <Button 
                  type="submit" 
                  disabled={submitting || !newReview.trim() || rating === 0}
                  className="w-full group"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      Submit Review
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Ticket Card Component
const TicketCard = ({ event, onReviewClick, qrCode }) => {
  const [showQR, setShowQR] = useState(false);
  const ticketsBought = Number(event.TicketsBought);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card glowing className="overflow-hidden">
        <div 
          className="relative w-full h-48 cursor-pointer"
          onMouseEnter={() => setShowQR(true)}
          onMouseLeave={() => setShowQR(false)}
        >
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={false}
            animate={{ opacity: showQR ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={event.IPFS_Logo}
              alt={event.Name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: showQR ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-40 h-40 bg-white p-2 rounded-lg shadow-lg">
              <img
                src={qrCode}
                alt="QR Code"
                className="w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <QrCode className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </motion.div>

          <div className="absolute top-4 right-4 bg-violet-500/20 backdrop-blur-sm rounded-full px-3 py-1 z-10">
            <span className="text-sm font-medium text-white">
              {ticketsBought} {ticketsBought === 1 ? 'Ticket' : 'Tickets'}
            </span>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {event.Name}
          </h3>
          
          <div className="space-y-2 text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-violet-400" />
              <span>{event.Date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-violet-400" />
              <span>{event.Time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-violet-400" />
              <span className="line-clamp-1">{event.Venue}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-violet-400" />
              <span>Total: {Number(event.TotalPrice) / (10 ** 18)} ETH</span>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              onClick={() => onReviewClick(event)}
              variant="secondary"
              className="w-full group border border-violet-500/20 hover:border-violet-500/50"
            >
              <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              View & Add Reviews
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Main Profile Component
export const Profile = () => {
  const { contract, address, signer } = useContract();
  const [boughtEvents, setBoughtEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [qrcodes, setQRCodes] = useState([]);
  const [status, setStatus] = useState({
    txHash: null,
    error: null,
    successMessage: null
  });

  const navigate = useNavigate();

  // Fetch bought events
  useEffect(() => {
    const fetchBoughtEvents = async () => {
      if (!contract || !address) return;

      try {
        const events = await contract.getAllBoughtEvents(address);
        setBoughtEvents(events);
        
        // Generate QR codes for all events
        const codes = await Promise.all(events.map(async (event) => {
          const eventData = {
            id: Number(event.id),
            name: event.Name,
            date: event.Date,
            time: event.Time,
            venue: event.Venue,
            totalPrice: Number(event.TotalPrice)
          };
          return await QRCode.toDataURL(JSON.stringify(eventData));
        }));
        
        setQRCodes(codes);
      } catch (error) {
        console.error('Error fetching events:', error);
        setStatus({ error: 'Failed to load events. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    fetchBoughtEvents();
  }, [contract, address]);

  // Handle review modal opening
  const handleReviewClick = async (event) => {
    setSelectedEvent(event);
    try {
      const [eventReviews] = await contract.getAllReview(event.id);
      setReviews(Array.isArray(eventReviews) ? eventReviews : []);
      setShowReviewModal(true);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setShowReviewModal(true);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (eventId, comment, timestamp, stars) => {
    if (!contract || !signer) return;

    setStatus({
      txHash: null,
      error: null,
      successMessage: null
    });

    try {
      const connectedContract = contract.connect(signer);
      const tx = await connectedContract.giveReview(eventId, address, comment, timestamp, stars);

      setStatus({
        txHash: tx.hash,
        successMessage: 'Review submitted successfully!'
      });

      await tx.wait();

      // Refresh reviews
      const [updatedReviews] = await contract.getAllReview(eventId);
      setReviews(Array.isArray(updatedReviews) ? updatedReviews : []);
    } catch (error) {
      console.error('Error submitting review:', error);
      setStatus({
        error: 'Failed to submit review. Please try again.'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-500 mb-4" />
          <p className="text-gray-400">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-12 h-12 text-violet-500" />
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
              Your Events
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            View your tickets and share your experiences
          </p>
        </motion.div>

        {/* Status Messages */}
        {(status.txHash || status.error || status.successMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card glowing className="border border-violet-500/20">
              <div className="p-4">
                {status.txHash && (
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <a
                      href={`https://block-explorer.testnet.lens.dev/tx/${status.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-500 hover:text-violet-400"
                    >
                      View transaction
                    </a>
                  </div>
                )}
                
                {status.successMessage && (
                  <div className="flex items-center text-sm text-green-500">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {status.successMessage}
                  </div>
                )}

                {status.error && (
                  <div className="flex items-center text-sm text-red-500">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {status.error}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Events Grid */}
        {boughtEvents.length === 0 ? (
          <Card glowing className="text-center p-12">
            <div className="max-w-md mx-auto">
              <Ticket className="w-16 h-16 mx-auto mb-6 text-violet-500 opacity-50" />
              <h3 className="text-2xl font-bold mb-4">No Events Found</h3>
              <p className="text-gray-400 mb-8">
                Looks like you haven't purchased any tickets yet. Start exploring amazing events!
              </p>
              <Button 
                onClick={() => navigate('/events')} 
                className="group"
              >
                <Plus className="w-4 h-4 mr-2" />
                Browse Events
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boughtEvents.map((event, index) => (
              <TicketCard
                key={index}
                event={event}
                qrCode={qrcodes[index]}
                onReviewClick={handleReviewClick}
              />
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedEvent && (
          <ReviewModal
            isOpen={showReviewModal}
            onClose={() => {
              setShowReviewModal(false);
              // Clear status when closing modal
              setStatus({
                txHash: null,
                error: null,
                successMessage: null
              });
            }}
            reviews={reviews}
            event={selectedEvent}
            onSubmitReview={handleSubmitReview}
          />
        )}
      </div>
    </div>
  );
}