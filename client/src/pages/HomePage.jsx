import TestController from "../components/test/TestController";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] w-full overflow-x-hidden">
      <TestController />
    </main>
  );
}
