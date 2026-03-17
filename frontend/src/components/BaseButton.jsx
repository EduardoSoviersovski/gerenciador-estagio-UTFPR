export const BaseButton = ({ 
  text, 
  onClick, 
  colorClass = "bg-blue-600", 
  fullWidth = false,
  size = "md" 
}) => {
  
  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-4 px-6 text-base",
    lg: "py-8 px-10 text-xl", 
  };

  return (
    <button 
      onClick={onClick}
      className={`
        ${colorClass} 
        ${fullWidth ? 'w-full' : 'flex-1'} 
        ${sizeClasses[size]} 
        text-white font-bold rounded-lg transition-all active:scale-95 shadow-md
        hover:brightness-110
      `}
    >
      {text}
    </button>
  );
};