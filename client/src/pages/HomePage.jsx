import TestController from "../components/test/TestController";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center min-h-[calc(100vh-80px)] w-full overflow-x-hidden">
      <TestController />
    </main>
  );
}
