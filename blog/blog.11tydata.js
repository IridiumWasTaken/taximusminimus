function isMarkdownPost(data) {
  const inputPath = data && data.page && data.page.inputPath;
  if (!inputPath || !inputPath.endsWith(".md")) return false;

  const normalized = inputPath.replace(/\\/g, "/");
  const fileName = normalized.split("/").pop() || "";
  return !fileName.startsWith("_");
}

function toGermanDate(value) {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(date);
}

function toIsoDate(value) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function slugToTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

module.exports = {
  eleventyComputed: {
    layout: (data) => (isMarkdownPost(data) ? data.layout || "layouts/blog-post.njk" : data.layout),

    permalink: (data) => {
      if (!isMarkdownPost(data) || data.permalink) return data.permalink;
      const slug = data && data.page && data.page.fileSlug;
      return slug ? `/blog/${slug}.html` : data.permalink;
    },

    articleHeadline: (data) => {
      if (!isMarkdownPost(data) || data.articleHeadline) return data.articleHeadline;
      return data.title || slugToTitle(data && data.page && data.page.fileSlug);
    },

    pageTitle: (data) => {
      if (!isMarkdownPost(data) || data.pageTitle) return data.pageTitle;
      const base = data.articleHeadline || data.title || slugToTitle(data && data.page && data.page.fileSlug);
      return base ? `${base} | Löwenstein Steuerberatung` : data.pageTitle;
    },

    metaDescription: (data) => {
      if (!isMarkdownPost(data) || data.metaDescription) return data.metaDescription;
      return data.description || data.excerpt || "Steuerwissen für Privatpersonen von Löwenstein Steuerberatung.";
    },

    ogTitle: (data) => (isMarkdownPost(data) ? data.ogTitle || data.pageTitle : data.ogTitle),
    ogDescription: (data) => (isMarkdownPost(data) ? data.ogDescription || data.metaDescription : data.ogDescription),
    jsonLdDescription: (data) => (isMarkdownPost(data) ? data.jsonLdDescription || data.metaDescription : data.jsonLdDescription),

    canonicalUrl: (data) => {
      if (!isMarkdownPost(data) || data.canonicalUrl) return data.canonicalUrl;
      if (typeof data.permalink !== "string" || !data.permalink.startsWith("/")) return undefined;
      return `https://www.löwenstein-steuerberatung.de${data.permalink}`;
    },

    datePublished: (data) => {
      if (!isMarkdownPost(data) || data.datePublished) return data.datePublished;
      return toIsoDate(data && data.page && data.page.date);
    },

    dateModified: (data) => (isMarkdownPost(data) ? data.dateModified || data.datePublished : data.dateModified),

    breadcrumbName: (data) => {
      if (!isMarkdownPost(data) || data.breadcrumbName) return data.breadcrumbName;
      return data.articleHeadline || slugToTitle(data && data.page && data.page.fileSlug);
    },

    articleTag: (data) => (isMarkdownPost(data) ? data.articleTag || "Steuern" : data.articleTag),

    articleDateDisplay: (data) => {
      if (!isMarkdownPost(data) || data.articleDateDisplay) return data.articleDateDisplay;
      return toGermanDate(data.datePublished);
    },

    ctaTitle: (data) =>
      isMarkdownPost(data)
        ? data.ctaTitle || "Fragen zu Ihrer steuerlichen Situation?"
        : data.ctaTitle,
    ctaText: (data) =>
      isMarkdownPost(data)
        ? data.ctaText || "Löwenstein Steuerberatung unterstützt Sie mit klaren Empfehlungen und einer verlässlichen Umsetzung."
        : data.ctaText,
    ctaLabel: (data) => (isMarkdownPost(data) ? data.ctaLabel || "Kostenfreies Erstgespräch anfragen" : data.ctaLabel),
    ctaHref: (data) => (isMarkdownPost(data) ? data.ctaHref || "../#contact" : data.ctaHref),
  },
};