type PolicySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PolicySection[];
};

export default function PolicyPage({
  eyebrow,
  title,
  intro,
  sections,
}: PolicyPageProps) {
  return (
    <main className="min-h-screen bg-white pt-24 text-neutral-950">
      <header className="bg-[#eee9e1]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:px-8 md:py-28 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div className="motion-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-neutral-700">
              {eyebrow}
            </p>
            <p className="mt-6 text-sm text-neutral-600">
              Last updated: 7 August 2026
            </p>
          </div>

          <div className="motion-fade-up">
            <h1 className="font-display text-6xl font-medium leading-[0.9] md:text-8xl">
              {title}
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-neutral-800 md:text-lg">
              {intro}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <div className="motion-stagger grid gap-x-16 gap-y-14 md:grid-cols-2">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className="border-t border-neutral-300 pt-6"
            >
              <div className="flex gap-5">
                <span className="pt-1 text-xs font-semibold tracking-[0.2em] text-neutral-500">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h2 className="font-display text-3xl font-semibold md:text-4xl">
                    {section.title}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-5 leading-7 text-neutral-700"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="mt-5 space-y-3 text-neutral-700">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 leading-7">
                          <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-neutral-500" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-20 border border-neutral-300 bg-neutral-50 p-6 text-sm leading-7 text-neutral-700 md:p-8">
          These policies are the current STRIP store rules and may be updated as
          the business, delivery coverage, or payment methods change. Nothing in
          them limits rights provided by applicable Moroccan law.
        </aside>
      </div>
    </main>
  );
}
