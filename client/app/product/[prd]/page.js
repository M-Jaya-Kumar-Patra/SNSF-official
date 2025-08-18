// app/product/[prd]/page.js

import ProductPageClient from './ProductPageClient';

export async function generateMetadata({ params }) {
  const prd = params?.prd;

  if (!prd) {
    return {
      title: "Product Not Found – SNSF",
      description: "Sorry, this product is not available.",
    };
  }

  // Decide whether it's an ID (MongoDB) or slug
  const fetchUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/product/${prd}`;

  const res = await fetch(fetchUrl, { cache: "no-store" });
  const data = await res.json();
  const product = data?.product;

  if (!product) {
    return {
      title: "Product Not Found – SNSF",
      description: "Sorry, this product is not available.",
    };
  }

  const { name, images, description, brand, specifications, catName } = product;
  const productImage = images?.[0] || "/snsf-banner.jpg";
  const productDescription =
    description ||
    `Experience the perfect blend of style, durability, and functionality with ${name}.`;

  const productUrl = `https://snsteelfabrication.com/product/${prd}`;

  return {
    title: `${name} – ${brand || "SNSF"} | Buy Steel Furniture Online`,
    description: productDescription,
    keywords: [
      name,
      brand,
      catName,
      specifications?.material,
      "SNSF",
      "steel furniture",
    ],
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
  const prd = params?.prd;
  return <ProductPageClient prdId={prd} />;
}
