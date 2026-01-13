
interface JourneyStepProps {
  number: number;
  title: string;
  description: string;
  items: string[];
}

const JourneyStep = ({ number, title, description, items }: JourneyStepProps) => (
  <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm relative">
    <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-gray-400 flex items-center gap-2">
          <span className="w-1 h-1 bg-violet-500 rounded-full"></span>
          {item}
        </li>
      ))}
    </ul>
    <div
      className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-16 h-16 
                 bg-violet-500 rounded-full flex items-center justify-center
                 text-white text-xl font-bold z-10"
    >
      {number}
    </div>
  </div>
);

const JourneySection = () => {
  const journeySteps = [
    {
      number: 1,
      title: "Create Your Challenge",
      description: "Set up your resolution challenge by:",
      items: [
        "Defining your goal clearly",
        "Setting the challenge duration",
        "Specifying the stake amount in ETH",
        "Establishing verification rules"
      ]
    },
    {
      number: 2,
      title: "Daily Verification",
      description: "Stay accountable through:",
      items: [
        "Daily photo/video proof uploads",
        "Community verification system",
        "Progress tracking dashboard",
        "Real-time notifications"
      ]
    },
    {
      number: 3,
      title: "Complete & Earn",
      description: "Reap the rewards:",
      items: [
        "Claim your staked amount back",
        "Earn bonus rewards from dropouts",
        "Build your achievement NFT collection",
        "Join the winners' community"
      ]
    }
  ];

  return (
    <section className="mb-24">
      <div className="text-center mb-16">
        <h2 className="text-violet-500 text-4xl font-bold mb-4">
          The Journey to Achievement
        </h2>
        <p className="text-gray-400 text-xl max-w-3xl mx-auto">
          Follow these simple steps to start your accountability-driven journey
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-violet-500/30"></div>

        <div className="space-y-24">
          {journeySteps.map((step, index) => (
            <div key={index} className={`grid grid-cols-2 gap-16 ${index % 2 === 0 ? 'pr-24' : 'pl-24'
              }`}>
              {index % 2 === 0 ? (
                <>
                  <JourneyStep {...step} />
                  <div></div>
                </>
              ) : (
                <>
                  <div></div>
                  <JourneyStep {...step} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-16">
        <button className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
          Start Your Challenge Now
        </button>
      </div>
    </section>
  );
};

export default JourneySection;