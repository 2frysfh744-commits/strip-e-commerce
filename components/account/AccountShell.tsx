import type { ReactNode } from "react";

type AccountShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AccountShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: AccountShellProps) {
  return (
    <main className="min-h-screen bg-[#f2efe9] px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
      <div className="motion-fade-up mx-auto grid w-full max-w-5xl overflow-hidden border border-neutral-300 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative flex min-h-72 flex-col justify-between overflow-hidden bg-neutral-950 p-8 text-white md:p-12 lg:min-h-[650px]">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full border border-white/10" />

          <p className="relative text-xs uppercase tracking-[0.34em] text-white/60">
            {eyebrow}
          </p>

          <div className="relative">
            <p className="font-display text-6xl font-semibold tracking-[0.24em] md:text-7xl">
              STRIP
            </p>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Save your details, follow every order, and return to your wardrobe
              whenever you like.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center p-7 sm:p-10 md:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Customer account
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-neutral-950 md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-neutral-600">
            {intro}
          </p>

          <div className="mt-9">{children}</div>

          {footer ? (
            <div className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
              {footer}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
