const CLOUDINARY_HOST = "res.cloudinary.com";
const TRANSFORM_PART = /^(a|ar|b|bo|c|co|dpr|e|f|fl|g|h|l|o|q|r|t|u|w|x|y|z)_/;

function stripExistingTransformations(path) {
  const parts = path.split("/");
  const firstPart = parts[0] || "";

  if (
    firstPart &&
    !firstPart.startsWith("v") &&
    firstPart.split(",").some((part) => TRANSFORM_PART.test(part))
  ) {
    return parts.slice(1).join("/");
  }

  return path;
}

export function getCloudinaryImageUrl(url, options = {}) {
  if (
    !url ||
    typeof url !== "string" ||
    !url.includes(CLOUDINARY_HOST) ||
    !url.includes("/upload/")
  ) {
    return url;
  }

  const {
    width,
    height,
    crop = width || height ? "fill" : undefined,
    gravity,
    quality = "auto",
    format = "auto",
  } = options;

  const transforms = [
    format && `f_${format}`,
    quality && `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
    gravity && `g_${gravity}`,
  ].filter(Boolean);

  const [prefix, imagePath] = url.split("/upload/");
  const cleanImagePath = stripExistingTransformations(imagePath);

  return `${prefix}/upload/${transforms.join(",")}/${cleanImagePath}`;
}
