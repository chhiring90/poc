import { connection } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import { Footer } from "@/components/layouts/home";
import { ContactExperience } from "@/components/layouts/contact/contact-experience";
import { getContactPageData } from "@/lib/helper/get-contact-page-data.helper";

export default async function Contact() {
  await connection();
  const payload = await getPayload({ config });
  const contactPage = await payload.findGlobal({
    slug: "contactPage",
    depth: 1,
  });
  const content = getContactPageData(contactPage);

  return (
    <>
      <ContactExperience content={content} />
      <Footer />
    </>
  );
}
