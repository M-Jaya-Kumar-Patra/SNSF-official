import HomePageClient from "@/components/HomePageClient";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchHomeJson(path, timeoutMs = 1500) {
  if (!API_URL) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function Home() {
  const [bestsellersRes, postersRes, sliderRes] = await Promise.all([
    fetchHomeJson("/api/home-sections?sectionName=bestsellers"),
    fetchHomeJson("/api/poster/getAll"),
    fetchHomeJson("/api/homeSlider/getAllSlides"),
  ]);

  const initialBestsellers = Array.isArray(bestsellersRes?.data)
    ? bestsellersRes.data
    : [];

  const initialBestsellerPoster = Array.isArray(postersRes?.data)
    ? postersRes.data[0] || null
    : null;

  const initialSlides = Array.isArray(sliderRes?.data) ? sliderRes.data : null;

  return (
    <HomePageClient
      initialBestsellers={initialBestsellers}
      initialBestsellerPoster={initialBestsellerPoster}
      initialSlides={initialSlides}
    />
  );
}
