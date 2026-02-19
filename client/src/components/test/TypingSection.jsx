export default function TypingSection({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}