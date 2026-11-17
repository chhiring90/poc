import type { Metadata } from "next";
import { Footer } from "@/components/layouts/home";
import {
  HowWeWorkClosing,
  HowWeWorkCommitments,
  HowWeWorkHero,
  HowWeWorkImageBand,
  // Turned off for now; see the commented-out sections below.
  // HowWeWorkSizes,
  HowWeWorkSteps,
  // HowWeWorkTools,
} from "@/components/layouts/how-we-work/how-we-work-sections";
import { findGlobalCached } from "@/lib/cms/cache";
import {
  HOW_WE_WORK_PATH,
  HOW_WE_WORK_SEO,
} from "@/lib/const/how-we-work.const";
import { getHowWeWorkPageData } from "@/lib/helper/get-how-we-work-page-data.helper";
import { getProcessSteps } from "@/lib/helper/get-process-steps.helper";
import { buildGlobalPageMetadata } from "@/lib/seo/global-page-metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildGlobalPageMetadata({
    global: "howWeWorkPage",
    path: HOW_WE_WORK_PATH,
    imageField: "hero.image",
    fallbackTitle: HOW_WE_WORK_SEO.title,
    fallbackDescription: HOW_WE_WORK_SEO.description,
  });
}

export default async function HowWeWork() {
  const [page, steps] = await Promise.all([
    findGlobalCached("howWeWorkPage", 1),
    getProcessSteps(),
  ]);
  const data = getHowWeWorkPageData(page, steps);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HowWeWorkHero
        hero={data.hero}
        cta={data.cta}
        process={data.process}
        closing={data.closing}
      />
      <HowWeWorkImageBand image={data.hero.image} />
      <HowWeWorkSteps process={data.process} />
      <HowWeWorkCommitments commitments={data.commitments} />
      {/* Off until packages are decided. The global is fetched at depth 1,
          so each size's recommended package is already populated. */}
      {/* <HowWeWorkSizes sizes={data.sizes} /> */}
      {/* Off until the tech stack is decided. */}
      {/* <HowWeWorkTools tools={data.tools} /> */}
      <HowWeWorkClosing closing={data.closing} cta={data.cta} />
      <Footer />
    </div>
  );
}
