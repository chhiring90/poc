"use client";

import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import ProjectPlanner from "./project-planner";

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <ProjectPlanner
          onSubmit={async (data) => {
            console.log("Submitted planner data:", data);
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
