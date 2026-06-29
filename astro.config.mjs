import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://thinktech-solutions.com",
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [sitemap()],
  image: {
    service: { entrypoint: "astro/assets/services/sharp" }
  },
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: {
      prefixDefaultLocale: true
    }
  }
});
