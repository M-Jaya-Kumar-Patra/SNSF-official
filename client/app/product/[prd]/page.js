// app/product/[prd]/page.js

import ProductPageClient from './ProductPageClient';

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.prd}`, {
    cache: "no-store",
  });

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
    price,
    rating,
    ratingCount,
    specifications,
    catName,
  } = product;

  const productImage = images?.[0] || "/snsf-banner.jpg";
  const productDescription = description || `Buy ${name} at SNSF. Durable steel furniture with features like ${specifications.material || 'top-grade materials'}, ${specifications.fabric || 'premium fabrics'}.`;
  const productUrl = `https://snsteelfabrication.com/product/${params.prd}`;

  return {
    title: `${name} – ${brand || "SNSF"} | Buy Steel Furniture Online`,
    description: productDescription,
    keywords: [
      name,
      brand,
      catName,
      specifications.material,
      "SNSF",
      "steel furniture",
      "qww65er4",
      "76tyty66",
      "999845ufhy",
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
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: productDescription,
      images: [productImage],
    },
  };
}


export default function Page({ params }) {
  return <ProductPageClient prdId={params.prd} />;
}
