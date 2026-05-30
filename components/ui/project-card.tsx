import { Button } from "@/components/ui/button";

function ProjectCard() {
  return (
    <>
      <article className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">Project Title</h2>
        <p className="text-sm text-muted-foreground mt-1">
          A brief description of the project goes here. It should be concise and
          informative.
        </p>
      </article>
    </>
  );
}

export { ProjectCard };
