"use client";

import type { ListItemData, SectionData, SiteMeta, ThemeConfig } from "@/lib/site-config";

interface ProductsBlockProps {
  data: SectionData;
  theme: Partial<ThemeConfig>;
  meta: SiteMeta;
}

export default function ProductsBlock({ data, theme, meta }: ProductsBlockProps) {
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const primary = theme.primaryColor || "#F97316";

  // "Commander" → WhatsApp avec le nom du produit, sinon appel direct
  const orderHref = (product: ListItemData): string => {
    if (!meta.phone) return "#";
    const clean = meta.phone.replace(/\s+/g, "");
    if (meta.phoneType === "whatsapp") {
      const message = encodeURIComponent(
        `Bonjour, je souhaite commander : ${product.title || "un produit"}`
      );
      return `https://wa.me/${clean}?text=${message}`;
    }
    return `tel:${clean}`;
  };

  return (
    <section className="py-16 px-4" style={{ backgroundColor: theme.globalBgColor || "#f9fafb" }}>
      <div className="max-w-6xl mx-auto">
        {data.title && (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: theme.featureTitleColor || "#111827" }}
          >
            {data.title}
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="h-48 w-full overflow-hidden" style={{ backgroundColor: `${primary}15` }}>
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title || "Produit"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🛍️</div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                {item.price && (
                  <p className="text-lg font-bold mb-1" style={{ color: primary }}>
                    {item.price}
                  </p>
                )}
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-2 flex-1">{item.description}</p>
                )}
                <a
                  href={orderHref(item)}
                  target={meta.phoneType === "whatsapp" ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-4 rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primary }}
                >
                  <span>🛒</span>
                  <span>Commander</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}