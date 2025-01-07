export const Card = ({ children, glowing = false }) => (
    <div className={`
      bg-gray-900 rounded-xl p-6 
      ${glowing ? 'animate-glow border border-violet-500/20' : 'border border-gray-800'}
      transition-all duration-300 hover:border-violet-500/50
    `}>
      {children}
    </div>
  );
  