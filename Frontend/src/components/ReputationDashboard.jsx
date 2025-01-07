import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  Award, Users, TrendingUp, Medal, Crown, Star,
  Loader2, Search, Filter, SlidersHorizontal,
  ChevronUp, ChevronDown, Clock, Activity,
  Sparkles, ArrowRight, BarChart3, PieChart as PieChartIcon,
  ShieldCheck, Trophy, Target
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useContract } from '../hooks/useContract';

// Custom Chart Tooltip
const CustomTooltip = ({ active, payload, label, detailed = false }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-violet-500/20 rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-violet-400" />
          <p className="text-violet-400 font-medium">
            {`${payload[0].payload.address.slice(0, 6)}...${payload[0].payload.address.slice(-4)}`}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-white font-bold">Score: {payload[0].value}</p>
          {detailed && (
            <>
              <p className="text-gray-400 text-sm">Rank: #{payload[0].payload.rank}</p>
              <p className="text-gray-400 text-sm">
                Percentile: {payload[0].payload.percentile}%
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Interactive Metric Card with Sparkline
const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend = [], 
  percentage, 
  onClick,
  selected = false,
  glowing = false 
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    whileTap={{ y: 0 }}
    onClick={onClick}
    className="cursor-pointer"
  >
    <Card 
      glowing={glowing} 
      className={`relative overflow-hidden group transition-all duration-300 ${
        selected ? 'border-violet-500/50 shadow-lg shadow-violet-500/20' : ''
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-500/10 rounded-lg">
              <Icon className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 text-transparent bg-clip-text">
                  {value}
                </p>
                {percentage && (
                  <span className={`text-sm ${
                    percentage > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {percentage > 0 ? '↑' : '↓'} {Math.abs(percentage)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {trend.length > 0 && (
          <div className="h-10 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="trendColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#trendColor)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {subtitle && (
          <p className="text-sm text-gray-400 mt-2">{subtitle}</p>
        )}
      </div>
    </Card>
  </motion.div>
);

// User Spotlight Card
const UserSpotlight = ({ user, rank }) => {
  const rankColors = {
    1: 'from-yellow-500 to-amber-600',
    2: 'from-gray-300 to-gray-400',
    3: 'from-amber-700 to-amber-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card glowing className="h-full relative overflow-hidden group">
        {/* Rank Badge */}
        <div className="absolute top-4 right-4">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            bg-gradient-to-br ${rankColors[rank] || 'from-violet-500 to-pink-500'}
          `}>
            <span className="text-white font-bold text-lg">#{rank}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-violet-500/10 rounded-full">
              {rank === 1 && <Crown className="w-8 h-8 text-yellow-500" />}
              {rank === 2 && <Medal className="w-8 h-8 text-gray-300" />}
              {rank === 3 && <Trophy className="w-8 h-8 text-amber-700" />}
              {rank > 3 && <Target className="w-8 h-8 text-violet-400" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {`${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
              </h3>
              <p className="text-gray-400">Community Member</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-400">Reputation Score</p>
              <p className="text-2xl font-bold text-white">{user.score}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-400">Percentile</p>
              <p className="text-2xl font-bold text-white">{user.percentile}%</p>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex gap-2">
            {user.score > 100 && (
              <div className="p-2 bg-violet-500/10 rounded-full" title="Power User">
                <Star className="w-4 h-4 text-violet-400" />
              </div>
            )}
            {user.score > 200 && (
              <div className="p-2 bg-violet-500/10 rounded-full" title="Elite Member">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
              </div>
            )}
            {rank <= 3 && (
              <div className="p-2 bg-violet-500/10 rounded-full" title="Top Contributor">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Filter Panel Component
const FilterPanel = ({ 
  sortOption, 
  onSortChange,
  filterOption,
  onFilterChange,
  searchTerm,
  onSearchChange,
  isOpen
}) => (
  <motion.div
    initial={false}
    animate={{ height: isOpen ? 'auto' : 0 }}
    transition={{ duration: 0.3 }}
    className="overflow-hidden"
  >
    <Card className="p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Search Address</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by address..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Sort By</label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="score">Score (High to Low)</option>
            <option value="scoreAsc">Score (Low to High)</option>
            <option value="percentile">Percentile</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>

        {/* Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Filter By</label>
          <select
            value={filterOption}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="all">All Users</option>
            <option value="top">Top 10%</option>
            <option value="active">Active Users</option>
            <option value="new">New Users</option>
          </select>
        </div>
      </div>
    </Card>
  </motion.div>
);

export const ReputationDashboard = () => {
  const { contract } = useContract();
  const [users, setUsers] = useState([]);
  const [reputationData, setReputationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('bar');
  const [sortOption, setSortOption] = useState('score');
  const [filterOption, setFilterOption] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [trendData, setTrendData] = useState([]);

  const COLORS = ['#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F59E0B'];

  // Generate mock trend data
  useEffect(() => {
    const generateTrendData = () => {
      const data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          value: Math.floor(Math.random() * 50) + 50
        });
      }
      setTrendData(data);
    };
    generateTrendData();
  }, []);

  // Fetch reputation data
  useEffect(() => {
    const fetchReputationData = async () => {
      if (!contract) return;

      try {
        // Fetch all users
        const userAddresses = await contract.getAllUsers();
        setUsers(userAddresses);

        // Fetch reputation scores
        const reputationScores = await Promise.all(
          userAddresses.map(async (address) => {
            const score = await contract.getReputationScore(address);
            return {
              address,
              score: Number(score)
            };
          })
        );

        // Calculate percentiles and ranks
        const sortedData = reputationScores
          .sort((a, b) => b.score - a.score)
          .map((user, index) => ({
            ...user,
            rank: index + 1,
            percentile: Math.round(((reputationScores.length - index) / reputationScores.length) * 100)
          }));

        setReputationData(sortedData);
      } catch (error) {
        console.error('Error fetching reputation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReputationData();
  }, [contract]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...reputationData];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterOption) {
      case 'top':
        filtered = filtered.filter(user => user.percentile >= 90);
        break;
      case 'active':
        filtered = filtered.filter(user => user.score > 50);
        break;
      case 'new':
        filtered = filtered.slice(-10);
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortOption) {
      case 'score':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'scoreAsc':
        filtered.sort((a, b) => a.score - b.score);
        break;
      case 'percentile':
        filtered.sort((a, b) => b.percentile - a.percentile);
        break;
      case 'recent':
        filtered.reverse();
        break;
      default:
        break;
    }

    return filtered;
  }, [reputationData, searchTerm, filterOption, sortOption]);

  // Calculate metrics
  const totalUsers = users.length;
  const totalReputation = reputationData.reduce((sum, user) => sum + user.score, 0);
  const averageReputation = totalUsers > 0 ? Math.round(totalReputation / totalUsers) : 0;
  const topScore = reputationData.length > 0 ? reputationData[0].score : 0;

  // Time-based metrics (mock data for demonstration)
  const weeklyGrowth = 12.5;
  const monthlyGrowth = 28.7;

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-500 mb-4" />
          <p className="text-gray-400">Loading reputation data...</p>
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
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
              Community Reputation
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Track and compare user engagement and contributions
          </p>

          {/* Filter Toggle Button */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            className="group border border-violet-500/20 hover:border-violet-500/50"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </motion.div>

        {/* Filter Panel */}
        <FilterPanel
          sortOption={sortOption}
          onSortChange={setSortOption}
          filterOption={filterOption}
          onFilterChange={setFilterOption}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isOpen={showFilters}
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Users}
            title="Total Users"
            value={totalUsers}
            subtitle="Active participants"
            trend={trendData}
            percentage={weeklyGrowth}
            glowing
          />
          <MetricCard
            icon={Star}
            title="Total Reputation"
            value={totalReputation}
            subtitle="Combined score"
            trend={trendData}
            percentage={monthlyGrowth}
            glowing
          />
          <MetricCard
            icon={TrendingUp}
            title="Average Score"
            value={averageReputation}
            subtitle="Per user"
            trend={trendData}
            glowing
          />
          <MetricCard
            icon={Crown}
            title="Top Score"
            value={topScore}
            subtitle="Highest achievement"
            trend={trendData}
            glowing
          />
        </div>

        {/* Chart Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setSelectedMetric('bar')}
            variant={selectedMetric === 'bar' ? 'primary' : 'secondary'}
            className={`group ${
              selectedMetric === 'bar' 
                ? 'border-violet-500/50' 
                : 'border border-violet-500/20 hover:border-violet-500/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Distribution
          </Button>
          <Button
            onClick={() => setSelectedMetric('pie')}
            variant={selectedMetric === 'pie' ? 'primary' : 'secondary'}
            className={`group ${
              selectedMetric === 'pie'
                ? 'border-violet-500/50'
                : 'border border-violet-500/20 hover:border-violet-500/50'
            }`}
          >
            <PieChartIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Breakdown
          </Button>
        </div>

        {/* Charts */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMetric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card glowing className="p-6">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedMetric === 'bar' ? (
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="address"
                        tick={{ fill: '#9CA3AF' }}
                        tickFormatter={(value) => `${value.slice(0, 4)}...${value.slice(-4)}`}
                      />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip content={<CustomTooltip detailed />} />
                      <Bar 
                        dataKey="score" 
                        fill="#8B5CF6"
                        radius={[4, 4, 0, 0]}
                      >
                        {filteredData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={filteredData}
                        dataKey="score"
                        nameKey="address"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ address }) => `${address.slice(0, 4)}...${address.slice(-4)}`}
                      >
                        {filteredData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip detailed />} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Top Contributors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
              Top Contributors
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.slice(0, 3).map((user, index) => (
              <UserSpotlight
                key={user.address}
                user={user}
                rank={index + 1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};