import { motion } from "motion/react";

const VALUES = [
  {
    name: "Creativity",
    img: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Innovation",
    img: "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Curiosity",
    img: "https://images.unsplash.com/photo-1748575232390-c5281ab02b09?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Excellence",
    img: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Integrity",
    img: "https://images.unsplash.com/photo-1764875471705-ad8aa64102a6?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function ValueCards() {
  return (
    <>
      {VALUES.map((value, i) => (
        <motion.div
          key={value.name}
          custom={i}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          whileHover={{ y: -6, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
          className={`relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg ${
            i % 2 === 1 ? "rotate-[2deg]" : "-rotate-[2deg]"
          } last:col-span-2 last:mx-auto last:w-1/2 sm:last:col-span-1 sm:last:w-full`}
        >
          <img
            src={value.img}
            alt={value.name}
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/15" />
          <span
            className={`absolute font-semibold tracking-tight text-white drop-shadow-md ${
              i % 2 === 1 ? "-rotate-2" : "rotate-2"
            } left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg`}
          >
            {value.name}
          </span>
        </motion.div>
      ))}
    </>
  );
}

function Values() {
  return (
    <section className="relative mt-16 bg-primary px-6 py-32 text-white lg:px-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
          Our Values
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          At Idea Lab, we believe that our values are what set us apart from
          other creative agencies.
        </h2>
      </div>
      <div className="mx-auto mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        <ValueCards />
      </div>
    </section>
  );
}

export { Values };
