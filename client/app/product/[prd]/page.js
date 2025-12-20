// app/product/[prd]/page.js

import ProductPageClient from "./ProductPageClient";

export async function generateMetadata({ params }) {
  const { prd } = params;

  if (!prd) {
    return {
      title: "Product Not Found – SNSF",
      description: "Sorry, this product is not available.",
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/${prd}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      title: "Product Not Found – SNSF",
      description: "Sorry, this product is not available.",
    };
  }

  const data = await res.json();
  const product = data?.product;

  if (!product) {
    return {
      title: "Product Not Found – SNSF",
      description: "Sorry, this product is not available.",
    };
  }

  const {
    name,
    images,
    description,
    brand,
    specifications,
    catName,
  } = product;

  const productDescription =
    description ||
    `Experience the perfect blend of style, durability, and functionality with ${name}.`;

  const productImage = images?.[0] || "/snsf-banner.jpg";
  const productUrl = `https://snsteelfabrication.com/product/${prd}`;

  /* ✅ BASE KEYWORDS */
  const keywords = [
    name,
    brand || "SNSF",
    catName,
    specifications?.material,

    // simple furniture
    "sofa",
    "bed",
    "chair",
    "table",
    "sofa bed",
    "steel furniture",
    "furniture near me",

    // local SEO
    "steel furniture in Odisha",
    "steel furniture in Berhampur",
    "steel furniture in Hinjilicut",
    "steel furniture in Burla",
    "steel furniture in Sambalpur",
    "steel furniture in New Burupada",
    "steel furniture in India",
  ].filter(Boolean);

  /* ✅ CATEGORY-BASED KEYWORDS */
  const category = catName?.toLowerCase() || "";

  if (category.includes("sofa")) {
    keywords.push(
      "steel sofa",
      "modern sofa",
      "sofa set",
      "living room sofa"
    );
  }

  if (category.includes("bed")) {
    keywords.push(
      "steel bed",
      "double bed",
      "single bed",
      "bed furniture"
    );
  }

  if (category.includes("chair")) {
    keywords.push(
      "steel chair",
      "dining chair",
      "office chair"
    );
  }

  if (category.includes("table")) {
    keywords.push(
      "steel table",
      "dining table",
      "study table"
    );
  }

  return {
    title: `${name} – ${brand || "SNSF"}`,
    description: productDescription,
    keywords: [...new Set(keywords)], // ✅ deduplicated

    openGraph: {
      title: `${name} – ${brand || "SNSF"}`,
      description: productDescription,
      url: productUrl,
      siteName: "SNSF",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: `${name} - ${brand}`,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: name,
      description: productDescription,
      images: [productImage],
    },
  };
}

export default async function Page({ params }) {
  const prd = params?.prd; // ❌ remove await

  // Fetch product from backend
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/${prd}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  const product = data?.product || null;

  return (
    <>
      {product && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: product.name,
                image: product.images,
                description: product.description,
                sku: product._id,
                brand: {
                  "@type": "Brand",
                  name: product.brand || "SNSF",
                },
                offers: {
                  "@type": "Offer",
                  priceCurrency: "INR",
                  price: product.price || undefined,
                  availability:
                    product.countInStock > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                  url: `https://snsteelfabrication.com/product/${prd}`,
                },
              }),
            }}
          />
      )}

      <ProductPageClient initialProduct={product} prdId={prd} />
    </>
  );
}

