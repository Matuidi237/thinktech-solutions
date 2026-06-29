import { defineMiddleware } from "astro:middleware";

const STATIC_EXTS = /\.(webp|avif|jpg|jpeg|png|gif|svg|ico|woff2|woff|ttf|js|css)$/i;

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const url = context.url.pathname;

  if (STATIC_EXTS.test(url)) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (url.startsWith("/images/")) {
    response.headers.set("Cache-Control", "public, max-age=86400");
  } else {
    response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  }

  return response;
});
