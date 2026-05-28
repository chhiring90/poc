"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Nav } from "@/components/layouts/nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const shellVariants = {
  default: {
    maxWidth: "100%",
    boxShadow: "none",
    backdropFilter: "blur(0px)",
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderColor: "rgba(255, 255, 255, 0)",
  },
  scrolled: {
    maxWidth: "64rem",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
    backdropFilter: "blur(16px)",
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    borderColor: "rgba(148, 163, 184, 0.18)",
  },
};

function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? "down" : "up";
    const hasPassedThreshold = latest > 200;

    setIsScrolled(latest > 12);
    setIsVisible(
      hasPassedThreshold ? direction === "up" || latest <= 240 : true,
    );

    lastScrollY.current = latest;
  });

  return (
    <motion.header
      animate={{ y: isVisible ? 0 : -110, opacity: isVisible ? 1 : 0 }}
      transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-6 pt-8"
    >
      <motion.div
        initial="default"
        animate={isScrolled ? "scrolled" : "default"}
        variants={shellVariants}
        transition={{
          type: "tween",
          duration: 0.18,
          ease: "easeOut",
        }}
        className="mx-auto flex w-full items-center justify-between gap-4 border bg-transparent px-4 py-3 rounded-4xl"
      >
        <h5 className="text-lg font-semibold tracking-tight">POC Tech.</h5>
        <div className="flex items-center gap-3">
          <Nav className="hidden md:flex" />
          <ThemeToggle />
        </div>
      </motion.div>
    </motion.header>
  );
}

export { Header };
