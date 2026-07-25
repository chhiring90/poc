import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Visions() {
  return (
    <section className="relative overflow-hidden bg-primary px-6 py-28 text-white lg:px-12">
      <div className="pointer-events-none absolute -right-28 bottom-0 h-[320px] w-[320px] opacity-30">
        {[320, 230, 140].map((size) => (
          <span
            key={size}
            className="absolute rounded-full border border-white/20"
            style={{
              width: size,
              height: size,
              left: (320 - size) / 2,
              top: (320 - size) / 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-[1] mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        {/* left: statement + supporting points */}
        <div className="order-2 text-left lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-white/75"
          >
            We're building toward a future where ambitious ideas always have a
            place to land, and where the work itself does the convincing.
          </motion.p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Built to last",
                body: "We design for the next five years, not the next sprint.",
              },
              {
                title: "Standards over trends",
                body: "We chase what works, not what's loud this quarter.",
              },
            ].map((point, i) => (
              <motion.div
                key={point.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                className="border-l-2 border-white/30 pl-4"
              >
                <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
                  {point.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {point.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
              Our Vision
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight  sm:text-5xl">
              A world where every studio treats creativity as a discipline, not
              a department and great design is the default, not the exception.
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
      </div>
    </section>
  );
}

export { Visions };
