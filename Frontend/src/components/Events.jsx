import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import {useNavigate} from 'react-router-dom';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Coins,
  Ticket,
  Loader2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  X,
  Send
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StarRating } from './ui/StarRating';
import { useContract } from '../hooks/useContract';

const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
};

// Reviews Modal Component
const ReviewsModal = ({ isOpen, onClose, event, contract, address, signer }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  // const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!contract || !event) return;
      try {
        const [reviewData, avgRating] = await contract.getAllReview(event.id);
        if (reviewData && reviewData.length > 0) {
          setReviews(reviewData);
          setAverageRating(Number(avgRating || 0));
        } else {
          setReviews([]);
          setAverageRating(0);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
        setAverageRating(0);
      } finally {
        setLoading(false);
      }
    };
  
    if (isOpen) {
      fetchReviews();
      setComment('');
      setRating(0);
    }
  }, [isOpen, event, contract]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-gray-900 rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{event?.Name}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
              <StarRating rating={averageRating || 0} size="large" />
              <span className="text-gray-400">
                {reviews.length > 0 
                  ? `${averageRating.toFixed(1)} / 5 (${reviews.length} reviews)`
                  : 'No reviews yet'
                }
              </span>
            </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[40vh]">
              {loading ? (
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <StarRating rating={Number(review.stars)} />
                          <p className="text-sm text-gray-400 mt-1">
                            By: {review.reviewer.slice(0, 6)}...{review.reviewer.slice(-4)}
                          </p>
                        </div>
                        <span className="text-xs text-violet-400">
                          {formatTimeAgo(review.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-200 mt-2">{review.comment}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-800">
              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const EventCard = ({ event, onBuyTickets, contract, signer, address }) => {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  // const { contract } = useContract();

  // Calculate prices for display and transaction
  const totalPrice = parseFloat(ethers.formatEther(event.Price)) * quantity;
  const totalPriceWei = event.Price * BigInt(quantity);

  const categoryColors = {
    Concert: 'bg-pink-500/20 text-pink-500',
    Sports: 'bg-green-500/20 text-green-500',
    Music: 'bg-blue-500/20 text-blue-500',
    Drama: 'bg-purple-500/20 text-purple-500',
    Others: 'bg-gray-500/20 text-gray-400'
  };

  const fetchReviews = async () => {
    if (!contract) return;
    
    setLoadingReviews(true);
    try {
      const reviewsData = await contract.getAllReview(event.id);
      console.log(reviewsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card glowing className="h-full flex flex-col">
        {/* Event Image */}
        <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
          <img
            src={event.IPFS_Logo}
            alt={event.Name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`${categoryColors[event.Category]} px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm`}>
              {event.Category}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Event Details */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-2">{event.Name}</h3>
          
          <div className="space-y-2 text-gray-400 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{event.Date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{event.Time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.Venue}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{Number(event.Capacity)} seats available</span>
            </div>
            <div className="flex items-center">
              <Coins className="w-4 h-4 mr-2" />
              <span>{ethers.formatEther(event.Price)} ETH per ticket</span>
            </div>
          </div>

          {/* Description and Reviews */}
          <div className="mb-4">
            <p className={`text-gray-400 ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {event.Description}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {event.Description.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-violet-500 hover:text-violet-400 text-sm"
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
              <button
                onClick={() => {
                  setShowReviews(true);
                  fetchReviews();
                }}
                className="text-violet-500 hover:text-violet-400 text-sm flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                View Reviews
              </button>
            </div>
          </div>

          {/* Ticket Purchase Section */}
          <div className="mt-auto">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="number"
                min="1"
                max={Number(event.Capacity)}
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(newQuantity, Number(event.Capacity), 4));
                }}
                className="w-20 px-3 py-2 bg-gray-900 rounded-lg border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
              <span className="text-gray-400">
                Total: {totalPrice.toFixed(4)} ETH
              </span>
            </div>
            
            <Button
              onClick={() => onBuyTickets(event.id, quantity, totalPriceWei)}
              className="w-full group"
              disabled={event.Capacity === 0}
            >
              <Ticket className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              {event.Capacity === 0 ? 'Sold Out' : 'Buy Tickets'}
            </Button>
          </div>
        </div>
      </Card>

      <ReviewsModal
          isOpen={showReviews}
          onClose={() => setShowReviews(false)}
          event={event}
          contract={contract}
          signer={signer}
          address={address}
        />
    </motion.div>
  );
};

export const Events = () => {
  const { contract, address, signer } = useContract();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [status, setStatus] = useState({
    txHash: null,
    error: null,
    successMessage: null
  });

  const navigate = useNavigate();

  const fetchEvents = async () => {
    if (!contract) return;
    
    try {
      const allEvents = await contract.getAllEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [contract]);

  const handleBuyTickets = async (eventId, quantity, totalPriceWei) => {
    if (!contract || !signer) return;
    setPurchasing(true);
    setStatus({
      txHash: null,
      error: null,
      successMessage: null
    });

    try {
      const connectedContract = contract.connect(signer);
      const tx = await connectedContract.buyTickets(
        eventId,
        address,
        quantity,
        {
          value: totalPriceWei
        }
      );

      setStatus({
        txHash: tx.hash,
        successMessage: `Successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''}!`
      });

      await tx.wait();
      
      // Refresh events to get updated capacity
      await fetchEvents();
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      setStatus({
        error: 'Failed to purchase tickets. Please try again.'
      });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-500 mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
              Upcoming Events
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Discover and book amazing events happening near you
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
        {events.length === 0 ? (
          <Card glowing className="text-center p-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4">No Events Found</h3>
              <p className="text-gray-400 mb-8">
                Be the first to create an amazing event for the community!
              </p>
              <Button onClick={() => navigate('/create')} className="group">
                Create Event
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
              key={event.id}
              event={event}
              onBuyTickets={handleBuyTickets}
              contract={contract}
              signer={signer}
              address={address}
            />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;