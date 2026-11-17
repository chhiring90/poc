import type { Metadata } from "next";
import { buildGlobalPageMetadata } from "@/lib/seo/global-page-metadata";
import { findGlobalCached } from "@/lib/cms/cache";
import { Footer } from "@/components/layouts/home";
import { ContactExperience } from "@/components/layouts/contact/contact-experience";
import { getContactPageData } from "@/lib/helper/get-contact-page-data.helper";

export function generateMetadata(): Promise<Metadata> {
  return buildGlobalPageMetadata({
    global: "contactPage",
    path: "/contact",
    titleFields: ["heading"],
    descriptionFields: ["description"],
    fallbackTitle: "Contact us",
  });
}

export default async function Contact() {
  const contactPage = await findGlobalCached("contactPage", 1);
  const content = getContactPageData(contactPage);

  return (
    <>
      <ContactExperience content={content} />
      <Footer />
    </>
  );
}
