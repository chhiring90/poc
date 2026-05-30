import { ProjectCard } from "@/components/ui/project-card";

const PROJECT_DATA = [
  {
    title: "Project One",
    description:
      "A brief description of Project One. It highlights the main features and technologies used.",
  },
  {
    title: "Project Two",
    description:
      "A brief description of Project Two. It highlights the main features and technologies used.",
  },
  {
    title: "Project Three",
    description:
      "A brief description of Project Three. It highlights the main features and technologies used.",
  },
  {
    title: "Project Four",
    description:
      "A brief description of Project Four. It highlights the main features and technologies used.",
  },
];

function Project() {
  return (
    <section className="py-16 grid gap-10 lg:grid-cols-2">
      <div className="space-y-6 text-left">
        {PROJECT_DATA.map((_, i) => (
          <ProjectCard key={i} />
        ))}
      </div>
    </section>
  );
}

export { Project };
