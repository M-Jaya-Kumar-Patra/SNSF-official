export const getProductPath = (product) => {
  const value =
    typeof product === "string"
      ? product
      : product?.slug || product?._id || product?.id || product?.productId;

  return value ? `/product/${encodeURIComponent(value)}` : "/ProductListing";
};

export const getAbsoluteProductUrl = (product, baseUrl = "https://www.snsteelfabrication.com") => {
  const cleanBase = baseUrl.replace(/\/$/, "");
  return `${cleanBase}${getProductPath(product)}`;
};
