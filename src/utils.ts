import path from "node:path";

export const view = (template: string) =>
  path.join(import.meta.dirname, "..", "views", `${template}.pug`);
