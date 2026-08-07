"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: string;
  pendingLabel: string;
};

export default function SubmitButton({
  children,
  pendingLabel,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-neutral-950 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
