export const Button = ({ children, onClick, variant = 'primary', disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        variant === 'primary' 
          ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-violet-500/50'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );