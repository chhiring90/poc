import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Missions() {
  return (
    <section className="relative overflow-hidden px-6 py-28 lg:px-12">
      <div className="relative z-[1] mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="flex flex-col items-start">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/70">
              Our Mission
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight  sm:text-5xl">
              To help brands turn bold ideas into work that moves people pairing
              sharp strategy with craft that never cuts corners.
            </h2>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 h-px w-24 origin-left bg-[#1C1B19]/20"
          />
        </div>

        {/* right: statement + supporting points */}
        <div className="text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-snug text-[#1C1B19]"
          ></motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-[#1C1B19]/65"
          >
            We exist to make our clients' boldest ideas real, repeatable, and
            worth talking about every brief, every time.
          </motion.p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Strategy first",
                body: "Every project starts with the why, not the deliverable.",
              },
              {
                title: "Craft, not shortcuts",
                body: "We sweat the details our clients never see.",
              },
            ].map((point, i) => (
              <motion.div
                key={point.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                className="border-l-2 border-[#3E5C82]/30 pl-4"
              >
                <h4 className="text-sm font-semibold uppercase tracking-wide text-[#1C1B19]">
                  {point.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#1C1B19]/60">
                  {point.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { Missions };
