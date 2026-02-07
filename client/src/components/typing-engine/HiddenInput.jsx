import { useEffect } from "react";

export default function HiddenInput({ inputRef }) {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <input
      ref={inputRef}
      type="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      className="absolute opacity-0 pointer-events-none"
    />
  );
}
