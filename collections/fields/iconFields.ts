import type { TextField } from "payload";

export const iconField = (name = "icon"): TextField => ({
  name,
  type: "text",
  admin: {
    components: {
      Field: "/components/ui/iconPicker.admin#IconPicker",
    },
  },
});
