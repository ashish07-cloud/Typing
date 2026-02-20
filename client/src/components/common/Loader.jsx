import { memo } from "react";


const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="flex items-center space-x-2">
        {/* We use [var(--main-color)] to ensure it changes with your theme hook */}
        <div 
          className="w-2.5 h-2.5 rounded-full animate-bounce [animation-delay:-0.3s]"
          style={{ backgroundColor: 'var(--main-color)' }}
        ></div>
        <div 
          className="w-2.5 h-2.5 rounded-full animate-bounce [animation-delay:-0.15s]"
          style={{ backgroundColor: 'var(--main-color)', opacity: 0.6 }}
        ></div>
        <div 
          className="w-2.5 h-2.5 rounded-full animate-bounce"
          style={{ backgroundColor: 'var(--main-color)', opacity: 0.3 }}
        ></div>
      </div>
      
      <span 
        className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] animate-pulse"
        style={{ color: 'var(--sub-color)' }}
      >
        Fetching Data
      </span>
      
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

export default memo(Loader);