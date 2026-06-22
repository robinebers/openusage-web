import { createOgImage } from "./og-image-content";

export const runtime = "nodejs";

export { size, contentType, alt } from "./og-image-content";

export default async function Image() {
  return createOgImage();
}
