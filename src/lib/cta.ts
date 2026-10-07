export type CtaType = "anchor" | "whatsapp" | "mailto" | "tel" | "url";

export function getCtaType(link?: string): CtaType {
  if (!link || link === "#") return "anchor";
  if (link.startsWith("https://wa.me")) return "whatsapp";
  if (link.startsWith("mailto:")) return "mailto";
  if (link.startsWith("tel:")) return "tel";
  return "url";
}

export function buildCtaLink(type: CtaType, rawValue?: string): string {
  switch (type) {
    case "whatsapp":
      return `https://wa.me/${rawValue || "33"}?text=Bonjour`;
    case "mailto":
      return `mailto:${rawValue || "contact@email.com"}`;
    case "tel":
      return `tel:${rawValue || "+33"}`;
    case "url":
      return rawValue || "https://";
    default:
      return "#";
  }
}

export function getCtaValue(link: string): string {
  const type = getCtaType(link);
  if (type === "tel") return link.replace("tel:", "");
  if (type === "mailto") return link.replace("mailto:", "");
  if (type === "whatsapp") return link.replace("https://wa.me/", "").split("?")[0];
  return link;
}

// Anciennement dupliqué dans DynamicRenderer — désormais partagé
export function getContactLink(phone?: string, type?: string): string {
  if (!phone) return "#";
  const clean = phone.replace(/\s+/g, "");
  if (type === "whatsapp") {
    const message = encodeURIComponent("Bonjour, je suis intéressé par vos services.");
    return `https://wa.me/${clean}?text=${message}`;
  }
  return `tel:${clean}`;
}