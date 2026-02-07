import TestDisplay from "../typing-engine/TestDisplay";

export default function TypingSection({
  text,
  typed,
  cursor,
  timeLeft,
  isTestFinished,
}) {
  return (
    <TestDisplay
      text={text}
      typed={typed}
      cursor={cursor}
      timeLeft={timeLeft}
      isTimeUp={isTestFinished}
    />
  );
}
