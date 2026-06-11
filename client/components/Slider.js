"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const AUTOPLAY_DELAY = 5000;

const SliderSkeleton = () => (
  <section className="w-full px-3 sm:px-4 md:px-6">
    <div className="relative mx-auto min-h-[360px] max-w-[1600px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm sm:grid sm:min-h-[460px] sm:items-center sm:gap-6 sm:rounded-xl sm:bg-white sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
      <div className="absolute inset-x-0 bottom-0 z-10 space-y-3 p-4 sm:static sm:space-y-4 sm:p-0">
        <div className="h-3 w-24 animate-pulse rounded bg-white/30 sm:h-4 sm:w-28 sm:bg-slate-200" />
        <div className="h-9 w-4/5 animate-pulse rounded bg-white/30 sm:h-12 sm:bg-slate-200" />
        <div className="h-8 w-3/5 animate-pulse rounded bg-white/30 sm:h-12 sm:bg-slate-200" />
        <div className="h-3 w-full max-w-md animate-pulse rounded bg-white/30 sm:h-4 sm:bg-slate-200" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-white/30 sm:h-11 sm:w-36 sm:bg-slate-200" />
      </div>
      <div className="absolute inset-0 bg-slate-800 sm:static sm:h-[340px] sm:w-full sm:animate-pulse sm:rounded-xl sm:bg-slate-200" />
    </div>
  </section>
);

const normalizeSlides = (items = []) =>
  items
    .filter((slide) => slide && slide.status !== false)
    .map((slide) => ({
      ...slide,
      image: slide?.images?.[0] || slide?.image?.[0] || slide?.image || null,
    }))
    .filter((slide) => slide.image);

export default function Slider({ initialSlides = null }) {
  const router = useRouter();
  const [slides, setSlides] = useState(() =>
    Array.isArray(initialSlides) ? normalizeSlides(initialSlides) : [],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!Array.isArray(initialSlides));
  const [isTabActive, setIsTabActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const currentSlide = slides[currentIndex];

  useEffect(() => {
    if (Array.isArray(initialSlides)) {
      setSlides(normalizeSlides(initialSlides));
      setCurrentIndex(0);
      setLoading(false);
      return;
    }

    const getSlides = async () => {
      try {
        setLoading(true);
        const response = await fetchDataFromApi(
          "/api/homeSlider/getAllSlides",
          false,
        );
        setSlides(normalizeSlides(response?.data || []));
      } catch {
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    getSlides();
  }, [initialSlides]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || !isTabActive || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, [isPaused, isTabActive, slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex((index + slides.length) % slides.length);
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const previousSlide = () => goToSlide(currentIndex - 1);

  const imageUrl = useMemo(() => {
    if (!currentSlide?.image) return "/images/placeholder.jpg";
    return getCloudinaryImageUrl(currentSlide.image, {
      width: 1100,
      height: 720,
      crop: "limit",
    });
  }, [currentSlide?.image]);

  if (loading) return <SliderSkeleton />;
  if (!currentSlide) return null;

  return (
    <section
      className="w-full px-3 sm:px-4 md:px-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative mx-auto min-h-[360px] max-w-[1600px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm sm:grid sm:min-h-[460px] sm:rounded-xl sm:bg-white lg:grid-cols-[0.95fr_1.05fr]">
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end px-4 pb-5 pt-16 sm:static sm:justify-center sm:px-8 sm:py-6 lg:px-10">
          {currentSlide?.tagline && (
            <p className="mb-2 hidden text-xs font-semibold uppercase tracking-[0.14em] text-white/75 sm:block sm:text-sm sm:tracking-wide sm:text-slate-500 md:text-base">
              {currentSlide.tagline}
            </p>
          )}

          <h2 className="line-clamp-2 max-w-[290px] text-[23px] font-semibold leading-tight text-white drop-shadow-sm sm:max-w-xl sm:text-[44px] sm:text-slate-900 sm:drop-shadow-none lg:text-[52px]">
            {currentSlide?.title || "S N Steel Fabrication"}
          </h2>

          {currentSlide?.description && (
            <p className="mt-3 hidden max-w-[310px] text-sm leading-6 text-white/80 sm:mt-4 sm:block sm:max-w-lg sm:text-base sm:text-slate-600">
              {currentSlide.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            {currentSlide?.url && (
              <button
                type="button"
                onClick={() => router.push(currentSlide.url)}
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100 sm:min-h-11 sm:rounded-lg sm:bg-slate-900 sm:px-6 sm:text-white sm:hover:bg-slate-800"
              >
                View Details
              </button>
            )}

            {slides.length > 1 && (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  aria-label="Previous hero slide"
                  onClick={previousSlide}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next hero slide"
                  onClick={nextSlide}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {slides.length > 1 && (
            <div className="mt-5 flex items-center gap-2 sm:mt-7">
              {slides.map((slide, index) => (
                <button
                  key={slide?._id || index}
                  type="button"
                  aria-label={`Go to hero slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-white sm:bg-slate-900"
                      : "w-2.5 bg-white/45 hover:bg-white/70 sm:bg-slate-300 sm:hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label={`Open ${currentSlide?.title || "hero slide"}`}
          onClick={() => currentSlide?.url && router.push(currentSlide.url)}
          disabled={!currentSlide?.url}
          className="group relative block min-h-[360px] w-full overflow-hidden bg-slate-100 sm:min-h-[340px] lg:min-h-full"
        >
          <Image
            key={currentSlide?._id || currentIndex}
            src={imageUrl}
            alt={currentSlide?.title || "S N Steel Fabrication"}
            fill
            priority={currentIndex === 0}
            fetchPriority={currentIndex === 0 ? "high" : "auto"}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent sm:bg-gradient-to-r sm:from-white/10 sm:via-transparent sm:to-slate-950/10" />
        </button>
      </div>
    </section>
  );
}
