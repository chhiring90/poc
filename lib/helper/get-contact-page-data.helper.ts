import { isRecord } from "@/lib/helper/is-record.helper";

export type ContactOption = {
  label: string;
  value: string;
};

export type ContactQuestionStep = {
  key: string;
  label: string;
  question: string;
  description: string;
  selectionMode: "single" | "multiple";
  required: boolean;
  options: ContactOption[];
};

export type ContactPageData = {
  eyebrow: string;
  heading: string;
  description: string;
  contactDetails: {
    icon: string;
    title: string;
    description: string;
    href: string;
  }[];
  steps: ContactQuestionStep[];
  form: {
    stepLabel: string;
    question: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
  };
  navigation: {
    nextLabel: string;
    backLabel: string;
    skipLabel: string;
  };
  success: {
    eyebrow: string;
    title: string;
    description: string;
    signature: string;
  };
};

const defaultContactPage: ContactPageData = {
  eyebrow: "Start a project",
  heading: "Let's build something *worth proving*.",
  description:
    "Tell us a little about your project. We'll come back with a scoped proposal within one business day. No sales calls until you're ready.",
  contactDetails: [
    {
      icon: "Mail",
      title: "hello@poc.dev",
      description: "Email us directly",
      href: "mailto:hello@poc.dev",
    },
    {
      icon: "Phone",
      title: "+44 20 1234 5678",
      description: "Mon–Fri, 9am–6pm GMT",
      href: "tel:+442012345678",
    },
    {
      icon: "MapPin",
      title: "London, United Kingdom",
      description: "Remote-first, global clients",
      href: "",
    },
  ],
  steps: [
    {
      key: "project-type",
      label: "Project type",
      question: "What do you need built?",
      description: "Choose all the services that fit your project.",
      selectionMode: "multiple",
      required: true,
      options: [
        { label: "Web application", value: "web-application" },
        { label: "Mobile app", value: "mobile-app" },
        { label: "MVP / POC sprint", value: "mvp-poc" },
        { label: "UI/UX design", value: "ui-ux-design" },
        { label: "AI integration", value: "ai-integration" },
        { label: "Cloud / DevOps", value: "cloud-devops" },
        { label: "Not sure yet", value: "not-sure" },
      ],
    },
    {
      key: "budget",
      label: "Budget",
      question: "What's the rough budget?",
      description: "A ballpark helps us recommend the right approach.",
      selectionMode: "single",
      required: true,
      options: [
        { label: "Under £15k", value: "under-15k" },
        { label: "£15k–£50k", value: "15k-50k" },
        { label: "£50k–£150k", value: "50k-150k" },
        { label: "£150k–£500k", value: "150k-500k" },
        { label: "£500k+", value: "over-500k" },
        { label: "Let's discuss", value: "discuss" },
      ],
    },
    {
      key: "timeline",
      label: "Timeline",
      question: "When would you like to get started?",
      description: "Choose the timing that works best for you.",
      selectionMode: "single",
      required: true,
      options: [
        { label: "ASAP (under 1 month)", value: "asap" },
        { label: "1–3 months", value: "1-3-months" },
        { label: "3–6 months", value: "3-6-months" },
        { label: "6–12 months", value: "6-12-months" },
        { label: "Flexible", value: "flexible" },
      ],
    },
    {
      key: "technology",
      label: "Tech needs",
      question: "Any technology preferences?",
      description: "Choose all that apply, or skip if you are not sure.",
      selectionMode: "multiple",
      required: false,
      options: [
        { label: "React / Next.js", value: "react-nextjs" },
        { label: "React Native", value: "react-native" },
        { label: "Flutter", value: "flutter" },
        { label: "Node.js", value: "nodejs" },
        { label: "Python", value: "python" },
        { label: "AWS / GCP", value: "aws-gcp" },
        { label: "AI / LLM", value: "ai-llm" },
        { label: "PostgreSQL", value: "postgresql" },
        { label: "Docker / Kubernetes", value: "docker-kubernetes" },
      ],
    },
  ],
  form: {
    stepLabel: "Your details",
    question: "Almost there. Who are we building for?",
    description: "Share your details and we will be in touch shortly.",
    nameLabel: "Your name",
    namePlaceholder: "Jane Smith",
    companyLabel: "Company",
    companyPlaceholder: "Company name",
    emailLabel: "Email address",
    emailPlaceholder: "jane@company.com",
    messageLabel: "Anything else we should know?",
    messagePlaceholder: "Tell us a little more about your project...",
    submitLabel: "Send project brief",
  },
  navigation: {
    nextLabel: "Continue",
    backLabel: "Back",
    skipLabel: "Skip for now",
  },
  success: {
    eyebrow: "Project brief received",
    title: "You're in the queue.",
    description:
      "We'll be in touch within one business day to book a discovery call. Check your inbox (and spam, just in case).",
    signature: "— The POC team",
  },
};

function getString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function getContactPageData(value: unknown): ContactPageData {
  if (!isRecord(value)) return defaultContactPage;

  const contactDetails = Array.isArray(value.contactDetails)
    ? value.contactDetails
        .filter(
          (item): item is Record<string, unknown> =>
            isRecord(item) && typeof item.title === "string",
        )
        .map((item, index) => ({
          icon: getString(item.icon, ""),
          title: getString(item.title, ""),
          description: getString(
            item.description,
            defaultContactPage.contactDetails[index]?.description ?? "",
          ),
          href: getString(item.href, ""),
        }))
    : defaultContactPage.contactDetails;

  const steps = Array.isArray(value.steps)
    ? value.steps
        .filter(
          (step): step is Record<string, unknown> =>
            isRecord(step) &&
            typeof step.key === "string" &&
            typeof step.label === "string" &&
            typeof step.question === "string",
        )
        .map((step) => ({
          key: step.key as string,
          label: step.label as string,
          question: step.question as string,
          description: getString(step.description, ""),
          selectionMode: (
            step.selectionMode === "multiple" ? "multiple" : "single"
          ) as ContactQuestionStep["selectionMode"],
          required: step.required !== false,
          options: Array.isArray(step.options)
            ? step.options
                .filter(
                  (option): option is Record<string, unknown> =>
                    isRecord(option) &&
                    typeof option.label === "string" &&
                    typeof option.value === "string",
                )
                .map((option) => ({
                  label: option.label as string,
                  value: option.value as string,
                }))
            : [],
        }))
    : defaultContactPage.steps;

  const form = isRecord(value.form) ? value.form : {};
  const navigation = isRecord(value.navigation) ? value.navigation : {};
  const success = isRecord(value.success) ? value.success : {};

  return {
    eyebrow: getString(value.eyebrow, defaultContactPage.eyebrow),
    heading: getString(value.heading, defaultContactPage.heading),
    description: getString(value.description, defaultContactPage.description),
    contactDetails,
    steps,
    form: {
      stepLabel: getString(
        form.stepLabel,
        defaultContactPage.form.stepLabel,
      ),
      question: getString(form.question, defaultContactPage.form.question),
      description: getString(
        form.description,
        defaultContactPage.form.description,
      ),
      nameLabel: getString(form.nameLabel, defaultContactPage.form.nameLabel),
      namePlaceholder: getString(
        form.namePlaceholder,
        defaultContactPage.form.namePlaceholder,
      ),
      companyLabel: getString(
        form.companyLabel,
        defaultContactPage.form.companyLabel,
      ),
      companyPlaceholder: getString(
        form.companyPlaceholder,
        defaultContactPage.form.companyPlaceholder,
      ),
      emailLabel: getString(form.emailLabel, defaultContactPage.form.emailLabel),
      emailPlaceholder: getString(
        form.emailPlaceholder,
        defaultContactPage.form.emailPlaceholder,
      ),
      messageLabel: getString(
        form.messageLabel,
        defaultContactPage.form.messageLabel,
      ),
      messagePlaceholder: getString(
        form.messagePlaceholder,
        defaultContactPage.form.messagePlaceholder,
      ),
      submitLabel: getString(
        form.submitLabel,
        defaultContactPage.form.submitLabel,
      ),
    },
    navigation: {
      nextLabel: getString(
        navigation.nextLabel,
        defaultContactPage.navigation.nextLabel,
      ),
      backLabel: getString(
        navigation.backLabel,
        defaultContactPage.navigation.backLabel,
      ),
      skipLabel: getString(
        navigation.skipLabel,
        defaultContactPage.navigation.skipLabel,
      ),
    },
    success: {
      eyebrow: getString(success.eyebrow, defaultContactPage.success.eyebrow),
      title: getString(success.title, defaultContactPage.success.title),
      description: getString(
        success.description,
        defaultContactPage.success.description,
      ),
      signature: getString(
        success.signature,
        defaultContactPage.success.signature,
      ),
    },
  };
}
