import TestController from "../components/test/TestController";
import GlobalStatsDisplay from "../components/stats/GlobalStatsDisplay";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <TestController />
      
      {/* Push stats to bottom */}
      <div className="mt-auto">
        <GlobalStatsDisplay />
      </div>
    </div>
  );
}