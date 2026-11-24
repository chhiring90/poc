/**
 * The six service packages and an idempotent seeder (matched by slug).
 * Text in [square brackets] is a value still to confirm; the site marks it.
 */
import type { Payload } from "payload";

type Seed = {
  slug: string;
  order: number;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  included?: string;
  notIncluded?: string;
  priceDependsOn: string;
  timing?: string;
  requires?: string;
  features: string[];
  options?: { heading: string; items: { name: string; detail?: string }[] }[];
  terms?: { label: string; value: string }[];
  deliverableGroups: { heading?: string; intro?: string; items: string[] }[];
};

const packages: Seed[] = [
  {
    slug: "strategy-and-plan",
    order: 1,
    icon: "Compass",
    name: "Strategy and Plan",
    tagline: "Know exactly where you are going, before you build.",
    description: "Anyone with an idea, a rough brief or a growing list of features.",
    included:
      'The Clarity Sprint, a plan for the first live version, a feature list split into "first launch" and "later", a simple roadmap, and a written quote for the build.',
    notIncluded: "Design or build work.",
    priceDependsOn: "How many products, users and features need planning.",
    timing: "[confirm]",
    features: [
      "Clarity Sprint workshop",
      "Plan for the first live version",
      "Ranked feature list and roadmap",
      "Fixed written quote for the build",
    ],
    terms: [
      {
        label: "Fee credited",
        value:
          "Yes. If you go ahead with us, the fee is credited against the project.",
      },
      {
        label: "Required for",
        value:
          "Mobile Apps and Web Applications. New ideas that come in during the build go into the next phase, so the first launch stays on time.",
      },
      { label: "Recommended for", value: "Large websites and shops." },
    ],
    deliverableGroups: [
      {
        items: [
          "Discovery workshop to understand your goals, customers and business",
          "Clear goals and ways to measure success",
          "Simple customer profiles and the journeys they take",
          "Review of competitors and similar products",
          'Feature list ranked into "first launch" and "later"',
          "Recommendation on platform and technology, with reasons in plain words",
          "Risk list: what could slow or break the project, and how we handle it",
          "Roadmap in phases, with a clear first live version",
          "Written plan document you can keep",
          "Fixed written quote for the build",
        ],
      },
    ],
  },
  {
    slug: "ux-ui-design",
    order: 2,
    icon: "PenTool",
    name: "UX/UI Design",
    tagline: "So easy to use, your customers never have to think.",
    description:
      "Teams who need designed screens for a website, a mobile app or a web app, with or without our build.",
    included:
      "User flows, wireframes, designed screens for phone and large screens, clickable prototype, testing with real people, accessibility checks, and files ready for build.",
    notIncluded: "Development, and text or images (you supply these).",
    priceDependsOn:
      "Number of screens, number of user types, and how complex the flows are.",
    timing: "[confirm]",
    features: [
      "User flows and wireframes",
      "Designed screens for every size",
      "Clickable prototype",
      "Testing with real people",
    ],
    options: [
      {
        heading: "Sizes (by screens)",
        items: [
          { name: "Quick", detail: "[up to 5 screens] for a landing page or a small flow." },
          { name: "Standard", detail: "[up to 15 screens] for a business website or a focused app." },
          { name: "Full", detail: "[up to 30 screens] for a full app or platform. More than that is quoted." },
        ],
      },
    ],
    terms: [
      {
        label: "Works two ways",
        value: "Bought alone, or added to any build package as one module.",
      },
    ],
    deliverableGroups: [
      {
        items: [
          "Review of your goals, users and what they need to do",
          "Sitemap or app map, and user flows for each key task",
          "Wireframes (simple layouts) to agree structure before styling",
          "Visual style and a small design system: colours, type, buttons, forms and reusable parts",
          "Designed screens for phone, tablet and large screens (iPhone and iPad layouts for apps, including side-by-side and rotated screens)",
          "Light and dark versions [optional extra]",
          "Clickable prototype you can try before anything is built",
          "Testing with real people, and a short report of what we found and changed",
          "Accessibility review of colours, text size, touch targets and screen readers",
          "Design files organised and ready for developers, with notes",
          "Design support during the build, to make sure it looks as designed",
        ],
      },
    ],
  },
  {
    slug: "website",
    order: 3,
    icon: "Globe",
    name: "Website",
    tagline: "A website you are proud to send people to.",
    description: "Businesses that want to be found, trusted and chosen online.",
    included:
      "Design for phone and large screens, build on the right platform (Framer, Webflow, Shopify or custom), basic search setup, privacy and cookie wording, testing, launch and hand-over. Included in every size.",
    notIncluded:
      "Your text and images, online shops and bookings (quoted separately), and ongoing SEO (see Add-ons). Online shops, booking engines and member areas are quoted separately.",
    priceDependsOn:
      "Number of pages, editing needs (CMS), platform, and extras such as forms, bookings and languages.",
    timing: "[confirm]",
    features: [
      "Designed for phone and large screens",
      "Easy editing dashboard (CMS)",
      "Basic search set-up and analytics",
      "Launch and hand-over",
    ],
    options: [
      {
        heading: "Sizes",
        items: [
          {
            name: "Landing Page",
            detail:
              "One page, quick and easy. Includes a privacy policy pop-up or link, a contact form and basic search setup.",
          },
          {
            name: "Business Website",
            detail:
              "[up to 10 pages], such as Home, About, Services, Contact, Privacy and Terms, with simple editing for text and images.",
          },
          {
            name: "Large Website",
            detail:
              "[11 to 20 pages], with a blog or news section, a bigger structure and more editing options. Beyond 20 pages is quoted.",
          },
        ],
      },
    ],
    terms: [
      {
        label: "Counting rules",
        value:
          "Blog posts do not count as pages. The editing area (CMS) is not a page, but a large CMS setup is a feature and can move the site up a size. Online shops are quoted separately by number of products and features.",
      },
      {
        label: "Free care",
        value: "First [3 months] of Care included. See Add-ons and Care.",
      },
    ],
    deliverableGroups: [
      {
        heading: "Landing Page",
        items: [
          "One page designed to turn visitors into enquiries",
          "Responsive layout for phone, tablet and large screens",
          "Contact form with spam protection and email alerts",
          "Easy editing of text and images through a simple dashboard (CMS)",
          "Visitor analytics: how many people visit, where they come from, and who clicks or enquires",
          "Cookie banner and privacy policy as a pop-up or link",
          "Basic search set-up: page title, description, social sharing image, speed",
          "Domain connection, secure connection (HTTPS) and hosting set-up",
          "Clean, well-structured code",
          "Launch and a short walkthrough",
        ],
      },
      {
        heading: "Business Website",
        intro: "Everything in Landing Page, plus",
        items: [
          "[Up to 10 pages], such as Home, About, Services, Contact, Privacy and Terms",
          "Menu and navigation planned around how your customers look for things",
          "Editing dashboard (CMS) for pages, plus a blog or news section",
          "Forms for enquiries, bookings or newsletter sign-up",
          "Links to your social profiles, maps and booking or chat tools",
          'Search set-up on every page, a sitemap, Google Search Console and a custom "page not found" page',
          "Analytics dashboard with goals set up",
          "Team training session",
        ],
      },
      {
        heading: "Large Website",
        intro: "Everything in Business Website, plus",
        items: [
          "[11 to 20 pages], and a bigger structure with sections and categories",
          "Larger CMS: blog categories, team, case studies, resources and other repeating content, with user roles",
          "Advanced forms and connections to your CRM or email tool",
          "Moving your old site: redirects, so you keep your search ranking",
          "A private test version (staging) to check changes before they go live",
          "Extra languages [optional]",
          "Performance targets agreed and checked",
          "Structured search data for better listings",
          "Analytics reports tied to your business goals",
        ],
      },
    ],
  },
  {
    slug: "web-and-mobile-apps",
    order: 4,
    icon: "Smartphone",
    name: "Web and Mobile Apps",
    tagline: "Turn your idea into software people love to use.",
    description:
      "Founders and businesses building an app, or replacing spreadsheets and workarounds with real software.",
    requires: "strategy-and-plan",
    included:
      "The plan from Strategy and Plan, UX/UI Design, build, testing on real devices, store submission for mobile, hosting set-up, launch and hand-over.",
    notIncluded:
      "Hosting and store fees, and new features added during the build (these go into the next phase).",
    priceDependsOn:
      "Number of features and screens, platforms chosen, user roles, and connections to other systems.",
    timing: "[confirm]",
    features: [
      "iPhone, Android and web apps",
      "Design, build and real-device testing",
      "App store submission",
      "Hosting, launch and hand-over",
    ],
    options: [
      {
        heading: "Mobile App options",
        items: [
          {
            name: "One app for iPhone and Android",
            detail:
              "Built once with React Native or Flutter. Usually quicker and lower cost, and the right choice for most apps.",
          },
          { name: "Native iPhone app", detail: "Built only for iOS." },
          { name: "Native Android app", detail: "Built only for Android." },
          {
            name: "Native for both",
            detail:
              "Two separate apps, for the best speed and the deepest use of phone features. We help you decide on the free call.",
          },
        ],
      },
      {
        heading: "Web Application options",
        items: [
          { name: "Focused", detail: "[One main purpose, a few features, one or two user types]." },
          { name: "Standard", detail: "[Several features, user roles, dashboards, simple connections to other tools]." },
          { name: "Full platform", detail: "[Many screens, complex business rules, reports, payments and connections]." },
        ],
      },
    ],
    terms: [
      {
        label: "Free care",
        value: "First [3 months] of Care included. See Add-ons and Care.",
      },
    ],
    deliverableGroups: [
      {
        heading: "Mobile App",
        items: [
          "One app for iPhone and Android (React Native or Flutter), or native iOS and Android apps, as agreed",
          "iPhone and iPad layouts, with support for large screens, rotation and split or dual-screen use where the platform allows",
          "Sign-up and login, with profiles and settings",
          "Push notifications",
          "Handling of weak or no internet connection [where needed]",
          "A back end: database and secure connection (API) for your app's data",
          "Admin dashboard to manage users and content",
          "Analytics and crash reporting, so we see how it is used and where it fails",
          "Beta testing through TestFlight (iPhone) and internal testing (Android)",
          "Testing on real phones and tablets",
          "Help setting up your Apple Developer and Google Play accounts",
          "App store listing: name, description, screenshots, icon and privacy details",
          "Submission to the App Store and Google Play, and handling of the review feedback",
          "Source code and hand-over guide",
        ],
      },
      {
        heading: "Web Application",
        items: [
          "Secure login, user roles and permissions",
          "Dashboards, tables, search, filters and reports for your business data",
          "Business logic: the rules, calculations and workflows your business runs on",
          "Database design built to grow",
          "Admin area to manage users, content and settings",
          "Connections to other tools (payments, email, accounting, CRM) [as scoped]",
          "Email and in-app notifications",
          "Activity log: who did what, and when",
          "Layouts built for large screens, laptops and phones",
          "Automated tests, plus testing and live (production) environments kept separate",
          "Hosting set-up on DigitalOcean or Cloudflare, with backups and monitoring",
          "Analytics and error tracking",
          "Source code, technical notes and hand-over guide",
        ],
      },
    ],
  },
  {
    slug: "add-ons-and-care",
    order: 5,
    icon: "ShieldCheck",
    name: "Add-ons and Care",
    tagline: "Be found. Stay safe. Keep improving.",
    description: "Anyone with a live website or app.",
    priceDependsOn:
      "Size of the site or app, and how much work and reporting you want.",
    features: [
      "Monitoring with a weekly report",
      "Minor fixes and content changes",
      "SEO and growth, one-off or monthly",
      "Extras when you need them",
    ],
    options: [
      {
        heading: "Care plan",
        items: [
          {
            name: "Free first [3 months]",
            detail:
              "With a website or app build. Covers minor bug fixes, text replacement, image replacement, and monitoring of your site or app, with a weekly report. If anything goes wrong with the server, you get a clear report. Hosting and server costs are not included.",
          },
          { name: "Essential", detail: "Keeps the same cover after the free period." },
          { name: "Plus", detail: "Adds [more edit time, faster response and a monthly review]." },
        ],
      },
      {
        heading: "SEO and Growth",
        items: [
          {
            name: "One-off setup",
            detail: "Search basics, page titles and descriptions, speed, structure and tracking.",
          },
          {
            name: "Monthly",
            detail:
              "Content planning, fixes, reporting, and visibility in AI answers as well as search.",
          },
        ],
      },
      {
        heading: "Extras",
        items: [
          { name: "Extra pages or screens" },
          { name: "Writing help" },
          { name: "Accessibility check" },
          { name: "Training for your team" },
          { name: "Analytics set-up" },
          { name: "Light and dark themes" },
          { name: "Extra languages" },
        ],
      },
    ],
    terms: [
      {
        label: "Limits",
        value: "[A fair number of small changes each month, to confirm].",
      },
    ],
    deliverableGroups: [
      {
        heading: "Care",
        items: [
          "Monitoring of your site or app, with a weekly report",
          "Report if anything goes wrong with the server",
          "Minor bug fixes",
          "Text and image replacement",
          "Security and software updates",
          "Backups, and secure connection (SSL) renewals",
          "Plus adds: more edit time, faster response, monthly review and performance check [to confirm]",
          "Hosting and server costs are not included",
        ],
      },
      {
        heading: "SEO and Growth",
        items: [
          "Search health check of your site",
          "Keyword and topic research",
          "Page titles, descriptions and headings improved",
          "Technical fixes: speed, mobile, structure and sitemap",
          "Structured data for better listings",
          "Content plan and, as an extra, writing help",
          "Visibility in AI answers as well as search",
          "Google Search Console and analytics set-up",
          "Monthly report in plain words, with next steps",
        ],
      },
    ],
  },
  {
    slug: "prototype-to-product",
    order: 6,
    icon: "Rocket",
    name: "Prototype to Product",
    tagline: "Built it with AI? We make it ready for real customers.",
    description:
      "Teams with an app made in Lovable, Replit or a similar tool that is stuck, risky or hard to scale.",
    notIncluded:
      "New features. Once the app is stable, these move into Web and Mobile Apps.",
    priceDependsOn: "The size of your app and the number of fixes found.",
    timing: "[confirm]",
    features: [
      "Plain-language health check",
      "Ranked fix list",
      "Fixes, proper hosting and testing",
      "Launch with code you own",
    ],
    options: [
      {
        heading: "Two steps",
        items: [
          {
            name: "Review (Health Check)",
            detail:
              "A plain-language report on code, security, speed and usability, with a ranked fix list.",
          },
          {
            name: "Fix and Launch",
            detail:
              "The fixes from the review, proper hosting, testing and launch. Needs a Review first.",
          },
        ],
      },
    ],
    terms: [
      {
        label: "Fee credited",
        value: "[Confirm whether the Review fee is credited when you go ahead].",
      },
    ],
    deliverableGroups: [
      {
        heading: "Review",
        items: [
          "Review of how the app is built and whether it can grow",
          "Security check, including logins, permissions and how customer data is stored",
          "Data protection check [UK GDPR basics]",
          "Speed and reliability check, and a look at what happens with more users",
          "Check of database, hosting and the tools the app depends on",
          "Usability check: can a new person find their way?",
          "Plain-language report: what is solid, what is risky",
          "Ranked fix list: do now, do soon, can wait",
          "Walkthrough call to go through the report",
        ],
      },
      {
        heading: "Fix and Launch",
        items: [
          'The "do now" fixes from the Review',
          "Code tidied and organised, so it is easier to build on",
          "Login, permissions and data protection made safe",
          "Proper database and back end where needed",
          "Separate test and live environments",
          "Move to proper hosting, with backups and monitoring",
          "Automated checks on each change, and testing before launch",
          "Check that it copes with more users",
          "App store submission if it is a mobile app",
          "Source code you own and a hand-over guide",
        ],
      },
    ],
  },
];

export async function seedPackages(payload: Payload): Promise<number> {
  const ids = new Map<string, number | string>();

  // Two passes: create/update every package, then link prerequisites.
  for (const pkg of packages) {
    const { features, deliverableGroups, options, ...rest } = pkg;
    delete rest.requires;
    const data = {
      ...rest,
      features: features.map((feature) => ({ feature })),
      options: options ?? [],
      deliverableGroups: deliverableGroups.map(({ items, ...group }) => ({
        ...group,
        items: items.map((text) => ({ text })),
      })),
    };
    const { docs } = await payload.find({
      collection: "packages",
      where: { slug: { equals: rest.slug } },
      limit: 1,
      depth: 0,
    });
    const doc = docs[0]
      ? await payload.update({ collection: "packages", id: docs[0].id, data })
      : await payload.create({ collection: "packages", data });
    ids.set(rest.slug, doc.id);
    payload.logger.info(`${docs[0] ? "Updated" : "Created"} package: ${rest.name}`);
  }

  for (const { slug, requires } of packages) {
    const id = ids.get(slug);
    if (!id) continue;
    await payload.update({
      collection: "packages",
      id,
      data: { requires: requires ? ids.get(requires) ?? null : null },
    });
  }

  payload.logger.info(`Seeded ${packages.length} packages.`);
  return packages.length;
}

