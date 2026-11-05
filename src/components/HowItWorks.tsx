import { FiAperture, FiCalendar, FiCompass, FiSliders } from "react-icons/fi";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Explore creative spaces that match your needs.",
    icon: FiCompass,
  },
  {
    number: "02",
    title: "Compare",
    description: "Compare studio prices, amenities, and locations.",
    icon: FiSliders,
  },
  {
    number: "03",
    title: "Book",
    description: "Select your preferred date and reserve your studio.",
    icon: FiCalendar,
  },
  {
    number: "04",
    title: "Create",
    description: "Bring your creative ideas to life.",
    icon: FiAperture,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 transition-colors duration-300 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-360 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#92765b] dark:text-[#d7bba0]">Simple from start to finish</p>
          <h2 className="font-serif text-4xl font-medium tracking-[-0.045em] text-foreground sm:text-5xl">
            Make room for what&apos;s next.
          </h2>
          <p className="mt-4 text-sm leading-7 text-foreground-muted sm:text-base">
            From first idea to final take, finding your creative space is easy.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <li key={number} className="group relative overflow-hidden rounded-[1.4rem] border border-border-soft bg-surface-muted p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d7c6b1] hover:bg-surface sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-serif text-4xl tracking-[-0.06em] text-[#c2b5a5] transition-colors group-hover:text-[#92765b] dark:text-[#857565] dark:group-hover:text-[#e2c7a8]">{number}</span>
                <span className="flex size-11 items-center justify-center rounded-full bg-surface text-[#765f48] shadow-sm transition duration-300 group-hover:rotate-[-8deg] group-hover:bg-brand group-hover:text-brand-foreground dark:text-[#e2c7a8]">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
              </div>
              <h3 className="mt-8 font-serif text-2xl font-medium text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">{description}</p>
              {number !== "04" && <span aria-hidden="true" className="absolute bottom-0 right-0 h-20 w-20 translate-x-8 translate-y-8 rounded-full border border-border-soft transition-transform duration-500 group-hover:translate-x-5 group-hover:translate-y-5" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}