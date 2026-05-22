export function getLinkedInActivityId(href: string): string | null {
  const match = href.match(/activity:(\d+)/);
  return match ? match[1] : null;
}

export function getLinkedInEmbedUrl(href: string): string | null {
  const id = getLinkedInActivityId(href);
  if (!id) return null;
  return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${id}`;
}

export function isLinkedInImagesGallery(href: string): boolean {
  return href.includes("recent-activity/images");
}
