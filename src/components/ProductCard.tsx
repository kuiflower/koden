import Link from "next/link";
import { formatPrice, productCover } from "@/lib/format";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale, Product } from "@/lib/types";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const cover = productCover(product);
  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className="group border border-line bg-panel transition hover:border-copper"
    >
      <div className="aspect-[4/3] bg-paper">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-brand text-steel/35">
            {product.brand || "KODEN"}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs tracking-wide text-steel">{product.brand}</p>
        <h3 className="mt-1 text-lg font-semibold group-hover:text-copper-deep">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-steel">{product.summary}</p>
        <p className="mt-3 text-sm font-medium">
          {product.showPrice
            ? formatPrice(product.price, product.currency, locale)
            : dict.product.priceHidden}
        </p>
      </div>
    </Link>
  );
}
