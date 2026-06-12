export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function deslugify(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\band\b/g, "&");
}
