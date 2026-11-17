import type { HowWeWorkPageData } from "@/lib/type/how-we-work.type";

export const HOW_WE_WORK_PATH = "/how-we-work";

/** Used when the global's SEO tab is empty. The site name is appended automatically. */
export const HOW_WE_WORK_SEO = {
  title: "How We Work: From First Call to Launch and Beyond",
  description:
    "We guide you through every step of building your website or app, from a free first call to launch and support afterwards. Book your free 30-minute call.",
};

/**
 * Starting copy for the How We Work page. Used as the admin default values and
 * as the page content until the global is saved for the first time.
 */
export const HOW_WE_WORK_DEFAULTS: HowWeWorkPageData = {
  hero: {
    eyebrow: "How we work",
    heading: "Your brand and product, built step by step, *with us beside you*.",
    description:
      "From your first idea to launch, we guide every step, so you always know what is happening and what comes next.",
    image: null,
  },
  cta: { label: "Book your free 30-minute call", url: "/contact" },
  process: {
    eyebrow: "How it works",
    heading: "Six steps from first call to launch and beyond",
    // Shown only while the process-steps collection is empty.
    steps: [
      {
        title: "A free 30-minute call",
        tagline: "Tell us where you want to be.",
        description:
          "A friendly conversation about your business and your goals. We listen first, then tell you what we would suggest and how we can help.",
      },
      {
        title: "Plan and strategy",
        tagline: "Turn the idea into a clear plan.",
        description:
          "We map what to build, in what order and by when, in plain English, so you know what to expect before we start.",
      },
      {
        title: "Design",
        tagline: "See it before it is built.",
        description:
          "We design every screen to suit your brand and your customers. You review it as we go, try a clickable preview and approve it.",
      },
      {
        title: "Build",
        tagline: "Watch it come to life.",
        description:
          "We build one feature at a time and test each one before the next. Two or three times a week you get a link to see real progress.",
      },
      {
        title: "Test and launch",
        tagline: "Go live with confidence.",
        description:
          "We check everything on a private test copy, fix what we find, then launch. We set up the live site or app for you.",
      },
      {
        title: "Support",
        tagline: "We stay with you after launch.",
        description:
          "The first month includes free support for anything that needs fixing. After that, choose ongoing care and growth if you would like it.",
      },
    ],
  },
  commitments: {
    eyebrow: "What to expect",
    heading: "No surprises on either side",
    image: null,
    items: [
      {
        icon: "Wallet",
        title: "Clear payments",
        description:
          "Payments are split into milestones agreed at the start, so you always know what to expect.",
      },
      {
        icon: "MessagesSquare",
        title: "A little from you",
        description:
          "Your text and images, and your feedback within two working days. It keeps everything on track.",
      },
    ],
  },
  sizes: {
    eyebrow: "Pick your size",
    heading: "Start as small or as big as you need",
    options: [
      { name: "Quick", description: "A landing page or small changes." },
      { name: "Standard", description: "A full website." },
      { name: "Full", description: "A web application or mobile app." },
    ],
    extrasHeading: "When you are ready for more",
    extras: [
      {
        title: "SEO and growth",
        description: "Help more of the right people find you.",
      },
      {
        title: "Care plans",
        description: "Updates and maintenance, handled for you.",
      },
    ],
  },
  tools: {
    eyebrow: "Tools we use",
    heading: "The right tools for your project",
    groups: [
      {
        label: "Sites you edit yourself or sell from",
        tools: [{ name: "Framer" }, { name: "Webflow" }, { name: "Shopify" }],
      },
      {
        label: "Custom builds",
        tools: [{ name: "React" }, { name: "Next.js" }],
      },
    ],
    note: "We choose what fits you, not what we prefer.",
  },
  closing: {
    heading: "You do not need to know anything technical.",
    description: "Bring your goal, and we will help with the rest.",
  },
};
