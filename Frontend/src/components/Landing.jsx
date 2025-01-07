import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Shield,
  Users,
  ArrowRight,
  Star,
  Banknote,
  Ticket
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const FeatureCard = ({ icon: Icon, title, description, techDetail }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative"
  >
    <Card glowing className="h-full">
      <div className="relative z-10 space-y-4">
        <Icon className="w-8 h-8 text-violet-500" />
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-400">{description}</p>
        <div className="pt-2 border-t border-gray-800">
          <p className="text-sm text-violet-400">{techDetail}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

const StatCard = ({ value, label, description }) => (
  <div className="text-center p-6">
    <h4 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text mb-2">
      {value}
    </h4>
    <p className="text-white font-medium mb-2">{label}</p>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Guaranteed Authenticity",
      description: "Non-transferable digital tickets with cryptographic proof of ownership, eliminating counterfeits and unauthorized resales.",
      techDetail: "Secure smart contract validation ensures each ticket's authenticity"
    },
    {
      icon: Star,
      title: "Community Trust Network",
      description: "Transparent reputation system built on verified attendance and reviews, creating a reliable event ecosystem.",
      techDetail: "On-chain reputation scoring for organizers and attendees"
    },
    {
      icon: Banknote,
      title: "Instant Value Transfer",
      description: "Direct financial settlement between organizers and attendees with automated escrow protection.",
      techDetail: "Smart contract-managed secure payment system"
    },
    {
      icon: Users,
      title: "Social Discovery",
      description: "Find and connect with like-minded event enthusiasts through shared experiences and interests.",
      techDetail: "Decentralized social graph of events and attendees"
    }
  ];

  const stats = [
    {
      value: "0.2 ETH",
      label: "Organizer Stake",
      description: "Required stake for hosting events"
    },
    {
      value: "100%",
      label: "Direct Settlement",
      description: "Instant organizer payments"
    },
    {
      value: "Verified",
      label: "Event Reviews",
      description: "Only from confirmed attendees"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="relative pt-32 pb-20 px-4">
        {/* Gradient Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center items-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-16 h-16 text-violet-500" />
              </motion.div>
            </div>

            <h1 className="text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
                Experience Trust
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-transparent bg-clip-text">
                in Events
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              A new era of authentic event experiences powered by verifiable digital tickets,
              community trust, and instant settlements. Connect, attend, and build your event reputation.
            </p>

            <div className="flex justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => navigate('/events')} className="group">
                  <span>Discover Events</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/create')}
                  variant="secondary"
                  className="group border border-violet-500/20 hover:border-violet-500/50"
                >
                  <span>Host Event</span>
                  <Ticket className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24 mb-32"
          >
            <Card glowing className="border border-violet-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 text-center">
                <div>
                  <p className="text-violet-400 font-medium">Verified Tickets</p>
                  <p className="text-gray-400 mt-1">Cryptographic proof of authenticity</p>
                </div>
                <div>
                  <p className="text-violet-400 font-medium">Protected Payments</p>
                  <p className="text-gray-400 mt-1">Smart contract secured transactions</p>
                </div>
                <div>
                  <p className="text-violet-400 font-medium">Community Trust</p>
                  <p className="text-gray-400 mt-1">Verified attendee reviews</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>

          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card glowing className="border border-violet-500/20">
              <h3 className="text-2xl font-bold text-center pt-8 mb-8">
                Platform Guarantees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;