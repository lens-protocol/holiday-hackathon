import { DollarSign, Briefcase, FileText } from 'lucide-react';

interface TokenMetricCardProps {
  value: string;
  label: string;
}

interface TokenomicsCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
}

const TokenMetricCard = ({ value, label }: TokenMetricCardProps) => (
  <div className="bg-gray-800/50 rounded-lg p-4">
    <h4 className="text-violet-500 text-2xl font-bold mb-1">{value}</h4>
    <p className="text-gray-400 text-sm">{label}</p>
  </div>
);

const TokenomicsCard = ({ icon: Icon, title, description, metric, metricLabel }: TokenomicsCardProps) => (
  <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
    <div className="bg-violet-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-violet-400" />
    </div>
    <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 mb-4">{description}</p>
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{metricLabel}</span>
      <span className="text-violet-500 font-semibold">{metric}</span>
    </div>
  </div>
);

const TokenomicsSection = () => {
  return (
    <section className="mb-24">
      <div className="text-center mb-16">
        <h2 className="text-violet-500 text-4xl font-bold mb-4">Tokenomics & Rewards</h2>
        <p className="text-gray-400 text-xl max-w-3xl mx-auto">
          Understanding the economic model behind our challenge-based ecosystem
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-16">
        <TokenomicsCard 
          icon={DollarSign}
          title="Staking Pool"
          description="80% of staked amount goes to the challenge pool"
          metricLabel="Success Rate"
          metric="98%"
        />
        <TokenomicsCard 
          icon={Briefcase}
          title="Community Treasury"
          description="15% allocated for community initiatives"
          metricLabel="Growth Rate"
          metric="+45%"
        />
        <TokenomicsCard 
          icon={FileText}
          title="Protocol Fees"
          description="5% for platform maintenance & development"
          metricLabel="Sustainability"
          metric="100%"
        />
      </div>

      <div className="bg-gray-800/30 rounded-lg p-8 backdrop-blur-sm border border-gray-700">
        <h3 className="text-white text-2xl font-semibold mb-6">Token Distribution Metrics</h3>
        <div className="grid grid-cols-4 gap-4">
          <TokenMetricCard value="$2.5M+" label="Total Value Locked" />
          <TokenMetricCard value="50K+" label="Active Challenges" />
          <TokenMetricCard value="98%" label="Success Rate" />
          <TokenMetricCard value="25K+" label="Community Members" />
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;