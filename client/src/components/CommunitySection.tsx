import { Fingerprint, Users, Zap } from 'lucide-react';

interface FeatureItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
  text: string;
}

const FeatureItem = ({ Icon, text }: FeatureItemProps) => (
  <div className="flex items-center gap-3 text-gray-300">
    <div className="bg-violet-900/30 p-2 rounded-lg">
      <Icon className="w-5 h-5 text-violet-400" />
    </div>
    <span>{text}</span>
  </div>
);

const CommunitySection = () => {
  return (
    <section className="mb-24">
      <div className="bg-gray-800/30 rounded-2xl p-12 backdrop-blur-sm border border-gray-700">
        <div className="grid grid-cols-2 gap-16">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-block bg-violet-900/30 text-violet-400 px-4 py-2 rounded-full text-sm">
              Join Our Community
            </div>

            <h2 className="text-4xl font-bold text-white">
              Be Part of the Resolution Revolution
            </h2>

            <p className="text-gray-400 text-lg">
              Join thousands of goal-setters who are transforming their lives
              through blockchain-powered accountability. Connect, compete,
              and succeed together.
            </p>

            <div className="space-y-4 mt-8">
              <FeatureItem
                Icon={Fingerprint}
                text="Active global community"
              />
              <FeatureItem
                Icon={Users}
                text="Peer support system"
              />
              <FeatureItem
                Icon={Zap}
                text="Daily motivation boost"
              />
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-sm">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="block text-gray-300">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300">Discord Username</label>
                <input
                  type="text"
                  placeholder="Enter your Discord username"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Join Community
              </button>

              <p className="text-gray-500 text-sm text-center">
                By joining, you agree to our{' '}
                <a href="#" className="text-violet-400 hover:text-violet-300">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-violet-400 hover:text-violet-300">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;