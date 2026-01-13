// import { CreateChallenge } from './components/CreateChallenge';
import TokenomicsSection from '../../components/TokenomicsSection';
import { Plus, Users, DollarSign } from 'lucide-react';
import JourneySection from '../../components/JourneySection';
import CommunitySection from '../../components/CommunitySection';

interface ChallengeCardProps {
  title: string;
  days: number;
  ethStaked: string;
}

interface StatsCardProps {
  value: string;
  label: string;
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const ChallengeCard = ({ title, days, ethStaked }: ChallengeCardProps) => (
  <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
    <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 mb-2">{days} Days</p>
    <p className="text-violet-400">{ethStaked} ETH Staked</p>
  </div>
);

const StatsCard = ({ value, label }: StatsCardProps) => (
  <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm text-center">
    <h3 className="text-violet-500 text-4xl font-bold mb-2">{value}</h3>
    <p className="text-gray-400">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="bg-gray-800/30 rounded-lg p-8 backdrop-blur-sm border border-gray-700">
    <div className="bg-violet-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-violet-400" />
    </div>
    <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Landing = () => {
  const challenges = [
    { title: 'Gym Challenge', days: 30, ethStaked: '0.1' },
    { title: 'Reading Goal', days: 60, ethStaked: '0.05' },
    { title: 'Meditation', days: 90, ethStaked: '0.15' },
    { title: 'No Sugar', days: 45, ethStaked: '0.08' }
  ];

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black">
      

      {/* <Navbar /> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Turn Your<br />
            <span className="text-violet-500">Resolutions</span><br />
            Into Reality
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mb-8">
            Join challenge-based communities, stake crypto, and hold yourself
            accountable. Because sometimes, a little skin in the game is all you need.
          </p>
          <div className="flex gap-4">
            <button className="border border-violet-500 text-violet-500 hover:bg-violet-500/10 px-8 py-3 rounded-full">
              Powered by Lens Protocol
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-24">
          {challenges.map((challenge, index) => (
            <ChallengeCard key={index} {...challenge} />
          ))}
        </div>

        <section className="mb-24 text-center">
          <h2 className="text-violet-500 text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 text-xl mb-16 max-w-3xl mx-auto">
            Join the revolution of accountability-driven goal achievement through our
            unique blockchain-powered platform
          </p>

          <div className="grid grid-cols-3 gap-8 mb-24">
            <FeatureCard
              icon={Plus}
              title="Create Challenge"
              description="Set your goals, stake your crypto, and create a challenge that others can join. Define the rules and duration."
            />
            <FeatureCard
              icon={Users}
              title="Join & Verify"
              description="Join existing challenges, stake your crypto, and verify other participants' progress through daily photo uploads."
            />
            <FeatureCard
              icon={DollarSign}
              title="Win Rewards"
              description="Complete your goals, stay accountable, and earn rewards from the staked crypto pool."
            />
          </div>

          <div className="grid grid-cols-4 gap-6">
            <StatsCard value="98%" label="Completion Rate" />
            <StatsCard value="10K+" label="Active Users" />
            <StatsCard value="500ETH" label="Total Staked" />
            <StatsCard value="1000+" label="Challenges Created" />
          </div>
        </section>
        <JourneySection />
        <TokenomicsSection />
        <CommunitySection />
      </main>
    </div>
  );
};

export default Landing;
