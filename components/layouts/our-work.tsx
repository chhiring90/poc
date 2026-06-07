import { Carousel } from "@/components/ui/carousel";

const OUR_WORK_DATA = [
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

function OurWork() {
  return (
    <section className="py-16 grid gap-10 px-4 text-left">
      <Carousel />
    </section>
  );
}

function OurWorkCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <article className="rounded-lg min-h-[400px] border bg-card p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </article>
    </>
  );
}

export { OurWork };
