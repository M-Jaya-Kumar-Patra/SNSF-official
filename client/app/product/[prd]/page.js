// app/product/[prd]/page.js

import ProductPageClient from './ProductPageClient';

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.prdId}`, {
    cache: "no-store",
  });

  const data = await res.json();
  const product = data?.product;

  const productName = product?.name || "Product";
  const productImage = product?.images?.[0] || "/snsf-banner.jpg";
  const productDescription = "Check out this amazing product!";
  const productUrl = `https://snsteelfabrication.com/product/${params.prdId}`;

  return {
    title: productName,
    description: productDescription,
    openGraph: {
      title: productName,
      description: productDescription,
      images: [
        {
          url: productImage,
          width: 800,
          height: 600,
          alt: productName,
        },
      ],
      url: productUrl,
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description: productDescription,
      images: [productImage],
    },
  };
}

export default function Page({ params }) {
  return <ProductPageClient prdId={params.prdId} />;
}
