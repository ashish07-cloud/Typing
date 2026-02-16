import { memo, useCallback } from "react";

const HiddenInput = memo(
  ({ inputRef, onChar, onBackspace, disabled = false }) => {

    const handleInput = useCallback(
      (e) => {
        if (disabled) return;

        const value = e.target.value;

        // Detect backspace (mobile case where value becomes empty)
        if (value.length === 0) {
          onBackspace?.();
          return;
        }

        // Grab last typed character
        const char = value[value.length - 1];

        onChar?.(char);

        // Clear textarea so next keystroke triggers again
        e.target.value = "";
      },
      [onChar, onBackspace, disabled]
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (disabled) return;

        if (e.key === "Backspace") {
          e.preventDefault();
          onBackspace?.();
        }
      },
      [onBackspace, disabled]
    );

    return (
      <textarea
        ref={inputRef}
        rows={1}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        inputMode="text"
        disabled={disabled}
        className="
          absolute
          inset-0
          w-full
          h-full
          opacity-0
          resize-none
          z-50
        "
        style={{
          fontSize: "16px", // Prevent iOS zoom
          caretColor: "transparent",
        }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      />
    );
  }
);

export default HiddenInput;
