import type { AboutPageData } from "@/lib/type/about.type";

/** Shown when the About global has no image yet. */
export const ABOUT_FALLBACK_IMAGE = {
  url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=1200&fit=crop&auto=format",
  alt: "The POC team working together",
  width: 1600,
  height: 1200,
};

/**
 * Starting copy for the About page. Used as admin default values for new
 * fields, and on the page wherever the CMS field is empty.
 */
export const ABOUT_DEFAULTS: AboutPageData = {
  hero: {
    eyebrow: "Our story",
    heading: "Building for the web since *before HTML5*.",
    description: "A London team of engineers, here to help your product grow.",
    image: null,
  },
  facts: [],
  story: {
    eyebrow: "Our story",
    chapters: [
      {
        title: "Where we come from",
        body: "We started building web applications before HTML5 became a standard. There were fewer shortcuts then, so we learned to build things properly, because there was no other way.",
      },
      {
        title: "What changed",
        body: "Today anyone can generate an app in an afternoon. That is exciting, and it means more people are bringing ideas to life. But a generated prototype is rarely where a business wants to stay. It needs to feel like yours, hold up when real customers arrive, and keep working as you grow.",
      },
      {
        title: "Why POC exists",
        body: "That is the gap we set out to close. We take the prototype you have made, in a tool such as Lovable or anywhere else, or just an idea on paper, and turn it into a real product: designed to be distinctive, built to scale and cared for after launch.",
      },
      {
        title: "How we work with you",
        body: "We become part of your team. Our engineers and designers are based in London and work in-house, with no outsourcing and no hand-offs to strangers. You talk to the people who build your product, and we back your boldest ideas. Some features take time, and we will always tell you honestly how long, but we will never tell you an idea is too bold. We pair deep experience with modern tools, so we move quickly without cutting corners.",
      },
      {
        title: "Who we help",
        body: "Founders with a first prototype, and established businesses ready for a rebuild. From a quick proof-of-concept sprint to a full platform.",
      },
    ],
  },
  values: {
    eyebrow: "Values",
    heading: "What we stand for.",
    description: "Four promises we keep on every project.",
    items: [
      {
        icon: "Target",
        title: "Your product comes first",
        tagline: "Your goals, not our convenience.",
        description:
          "Every decision starts with what your product and your customers need. We back your boldest ideas and work to turn them into live products. Some features take time, so we always tell you honestly what is involved, and we never dismiss an idea.",
      },
      {
        icon: "FingerprintPattern",
        title: "Design that thinks",
        tagline: "Beautiful, and built on purpose.",
        description:
          "We design with the reasons behind every screen in mind: who it is for, what they are trying to do and how your business works. Good design is not decoration. It is thinking you can see.",
      },
      {
        icon: "Layers",
        title: "Built to outlive the launch",
        tagline: "Code that keeps working as you grow.",
        description:
          "We write clear, tested, well-documented code and plan for growth from day one, so your product can keep changing without being rebuilt.",
      },
      {
        icon: "MessageSquareText",
        title: "Honest by default",
        tagline: "Straight answers, always.",
        description:
          "We tell you what is possible, what it costs and how long it takes, plainly and in writing. If we are not the right fit, we will tell you.",
      },
    ],
  },
  team: {
    show: false,
    eyebrow: "The team",
    heading: "The people who build your product",
    members: [],
  },
  closing: {
    heading: "Have a prototype or an idea?",
    description:
      "Book a free 30-minute call and tell us where you want to be.",
    cta: { label: "Book a free 30-minute call", url: "/contact" },
  },
};
