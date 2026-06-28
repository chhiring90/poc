"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion, LayoutGroup } from "motion/react";
import { ChevronDown, ChevronUp, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  label: string;
  image: string;
  body: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    id: "01",
    label: "Top Notch Quality",
    image:
      "https://images.unsplash.com/photo-1778385925386-ba74df3a8f78?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    body: (
      <>
        <strong className="text-white font-medium">High quality</strong> every
        step of the way - detailed project reviews to guarantee a great
        understanding of your project needs, handcrafted code that speaks for
        itself, direct and open communication, and use of the latest best tools
        and practices. And that’s just a part of it all.
      </>
    ),
  },
  {
    id: "02",
    label: "Reasonable Pricing",
    image:
      "https://images.unsplash.com/photo-1743385779347-1549dabf1320?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    body: (
      <>
        A simple, fair, and logical
        <strong className="text-white font-medium"> pricing model </strong> that
        just feels right when put next to the quality and turnaround time you
        get. We aim to provide the perfect balance between price and speed that
        fits best your specific needs.
      </>
    ),
  },
  {
    id: "03",
    label: "Reliability & Flexibility",
    image:
      "https://images.unsplash.com/photo-1598015132635-131afe3ba07f?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    body: (
      <>
        Your convenience - placed first. Now, you can take{" "}
        <strong className="text-white font-medium">complete control</strong>{" "}
        over your projects with the flexibility to choose the tools and
        processes that best fit your business needs. We will adapt to you, and
        not the other way around.
      </>
    ),
  },
  {
    id: "04",
    label: "Fast Turnaround",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    body: (
      <>
        We understand the importance of time in business, and that’s why we
        prioritize a
        <strong className="text-white font-medium"> fast turnaround </strong>
        without compromising on quality. Our efficient processes and skilled
        team ensure that your projects are completed promptly, helping you stay
        ahead in the competitive market.
      </>
    ),
  },
  {
    id: "05",
    label: "Post-Delivery Support",
    image:
      "https://images.unsplash.com/photo-1576500714954-8a687d0ea1ef?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    body: (
      <>
        We&apos;re committed to providing our clients with the best possible
        <strong className="text-white font-medium">
          post-delivery support
        </strong>
        . You have everything you need to keep a website running smoothly and
        efficiently, with fast and reliable assistance whenever you need it -
        even years after a project is completed.
      </>
    ),
  },
];

const VISIBLE_COUNT = 4;

const TEXT_VARIANTS = {
  initial: { blur: "4px" },
  animate: { blur: "0px" },
  exit: { blur: "4px" },
};

function FeaturePill({
  feature,
  isOpen,
  onToggle,
}: {
  feature: Feature;
  isOpen: boolean;
  onToggle: (id: string) => void;
}) {
  const handleToggle = useCallback(
    () => onToggle(feature.id),
    [feature.id, onToggle],
  );

  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <motion.div
          key="pill"
          layoutId={`feature-${feature.id}`}
          onClick={handleToggle}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ transformOrigin: "0% 0%" }}
          className="inline-flex items-center gap-2.5 pl-4 pr-8 py-3 rounded-[22px] cursor-pointer bg-white/20 border border-white/20 backdrop-blur-2xl"
        >
          <motion.span
            variants={TEXT_VARIANTS}
            transition={{ delay: 0.12, duration: 0.18 }}
            className="text-white font-medium"
          >
            {feature.id}
          </motion.span>
          <motion.h4
            variants={TEXT_VARIANTS}
            transition={{ delay: 0.16, duration: 0.18 }}
            className="text-white/90 font-semibold text-md"
          >
            {feature.label}
          </motion.h4>
        </motion.div>
      ) : (
        <motion.div
          key="card"
          layoutId={`feature-${feature.id}`}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ transformOrigin: "0% 0%" }}
          className={cn(
            "w-full rounded-[22px] bg-white/20 border border-white/20 backdrop-blur-2xl overflow-hidden",
          )}
        >
          <motion.div
            variants={TEXT_VARIANTS}
            transition={{ delay: 0.16, duration: 0.18 }}
            className="flex items-center gap-2.5 px-4 py-3 cursor-pointer"
            onClick={handleToggle}
          >
            <PlusIcon className="w-4 h-4 stroke-white" />
            <h4 className="text-white/90 font-semibold text-md">
              {feature.label}
            </h4>
          </motion.div>

          <p className="px-4 pb-4 text-white/75">{feature.body}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BackgroundCarousel({
  activeIndex,
  prevIndex,
  direction,
}: {
  activeIndex: number;
  prevIndex: number | null;
  direction: 1 | -1;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#111]" />

      {/* Outgoing image */}
      <AnimatePresence initial={false}>
        {prevIndex !== null && (
          <motion.div
            key={`prev-${prevIndex}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${FEATURES[prevIndex].image})` }}
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: direction * -80, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Incoming image */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`active-${activeIndex}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${FEATURES[activeIndex].image})` }}
          initial={{ x: direction * 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </AnimatePresence>

      {/* Scrim: left darkens for pill readability, subtle right vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.10) 100%)",
        }}
      />
    </div>
  );
}

export function Carousel() {
  const [activeId, setActiveId] = useState<string | null>(FEATURES[0].id);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [visibleStart, setVisibleStart] = useState(0);

  const activeIndex = FEATURES.findIndex((f) => f.id === activeId) ?? 0;

  const toggle = useCallback((id: string) => {
    setActiveId((prev) => {
      const nextIndex = FEATURES.findIndex((f) => f.id === id);
      const currentIndex = FEATURES.findIndex((f) => f.id === prev);

      if (prev === id) {
        // closing — go back to first
        setPrevIndex(currentIndex);
        setDirection(-1);
        return FEATURES[0].id;
      }

      setDirection(nextIndex > currentIndex ? 1 : -1);
      setPrevIndex(currentIndex >= 0 ? currentIndex : null);
      return id;
    });
  }, []);

  const scroll = useCallback((dir: number) => {
    setActiveId(null);
    setPrevIndex(null);
    setVisibleStart((prev) =>
      Math.max(0, Math.min(prev + dir, FEATURES.length - VISIBLE_COUNT)),
    );
  }, []);

  const canScrollUp = visibleStart > 0;
  const canScrollDown = visibleStart + VISIBLE_COUNT < FEATURES.length;
  const visibleFeatures = FEATURES.slice(
    visibleStart,
    visibleStart + VISIBLE_COUNT,
  );

  return (
    <div className="relative w-full overflow-hidden rounded-2xl select-none min-h-[800px]">
      <BackgroundCarousel
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
        prevIndex={prevIndex}
        direction={direction}
      />

      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-2 z-20">
        <motion.button
          onClick={() => scroll(-1)}
          disabled={!canScrollUp}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs bg-white/15 backdrop-blur-xl border border-white/20 disabled:opacity-30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll up"
        >
          <ChevronUp className="w-3 h-3" />
        </motion.button>
        <motion.button
          onClick={() => scroll(1)}
          disabled={!canScrollDown}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs bg-white/15 backdrop-blur-xl border border-white/20 disabled:opacity-30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-3 h-3" />
        </motion.button>
      </div>

      <div className="absolute top-0 left-0 bottom-0 w-[600px] flex flex-col justify-center gap-2 px-14 py-7 z-10 overflow-y-hidden">
        <LayoutGroup>
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleFeatures.map((f) => (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <FeaturePill
                  feature={f}
                  isOpen={activeId === f.id}
                  onToggle={toggle}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}
