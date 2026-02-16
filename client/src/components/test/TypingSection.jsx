export default function TypingSection({ children }) {
  return (
    <div className="min-h-screen bg-page flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
