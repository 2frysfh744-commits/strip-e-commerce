"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type"
>;

export default function PasswordInput({
  className = "",
  disabled,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const actionLabel = isVisible ? "Hide password" : "Show password";

  return (
    <div className="relative">
      <input
        {...props}
        type={isVisible ? "text" : "password"}
        disabled={disabled}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        disabled={disabled}
        aria-label={actionLabel}
        aria-pressed={isVisible}
        title={actionLabel}
        onClick={() => setIsVisible((visible) => !visible)}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-neutral-500 transition hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isVisible ? (
          <EyeOff aria-hidden="true" size={18} strokeWidth={1.7} />
        ) : (
          <Eye aria-hidden="true" size={18} strokeWidth={1.7} />
        )}
      </button>
    </div>
  );
}
