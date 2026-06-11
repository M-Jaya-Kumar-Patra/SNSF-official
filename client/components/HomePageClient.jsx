"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Shopbycat from "@/components/Shopbycat";
import Bestsellers from "@/components/Bestsellers";
import Slider from "@/components/Slider";
import { fetchDataFromApi, postData } from "@/utils/api";
import { getDeviceId } from "@/utils/deviceId";
import { useScreen } from "@/app/context/ScreenWidthContext";

const PosterGrid = dynamic(() => import("@/components/PosterGrid"), {
  ssr: false,
});
const StyleYourSpaceSection = dynamic(
  () => import("@/components/StyleYourSpaceSection"),
  { ssr: false }
);
const VideoGrid = dynamic(() => import("@/components/VideoGrid"), {
  ssr: false,
});
const New = dynamic(() => import("@/components/New"), {
  ssr: false,
});
const CurratedLooks = dynamic(() => import("@/components/CurratedLook"), {
  ssr: false,
});
const Recommendations = dynamic(() => import("@/components/Recommendations"), {
  ssr: false,
});
const RecentlyViewed = dynamic(() => import("@/components/RecentlyViewed"), {
  ssr: false,
});

function useDeferredContent(isMobile) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => setReady(true), 6500);
      return () => clearTimeout(timer);
    }

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), {
        timeout: 2500,
      });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, [isMobile]);

  return ready;
}

export default function HomePageClient({
  initialBestsellers = [],
  initialBestsellerPoster = null,
  initialSlides = null,
}) {
  const { userData } = useAuth();
  const { isXs, isSm } = useScreen();
  const showDeferred = useDeferredContent(isXs || isSm);

  const [videosLength, setVideosLength] = useState(0);
  const [hasRecommendations, setHasRecommendations] = useState(true);
  const [hasRecentlyViewed, setHasRecentlyViewed] = useState(true);

  useEffect(() => {
    if (!showDeferred) return;

    const load = async () => {
      try {
        const res = await fetchDataFromApi("/api/videos/getAll", false);
        if (!res?.error) setVideosLength(res.data.length || 0);
      } catch {
        setVideosLength(0);
      }
    };
    load();
  }, [showDeferred]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem("l20dec25kjf34u85");

      if (lastVisit !== today) {
        postData(
          "/api/visit/new",
          {
            deviceId: getDeviceId(),
          },
          false
        );

        localStorage.setItem("l20dec25kjf34u85", today);
      }
    }, isXs || isSm ? 8000 : 2500);

    return () => clearTimeout(timer);
  }, [isSm, isXs]);

  return (
    <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      <h1 className="sr-only">S N Steel Fabrication</h1>
      <section className="bg-slate-100 h-[86px] hidden md:block" />

      <section className="flex justify-center max-w-[1600px] mx-auto mt-3 sm:mt-4 md:mt-6">
        <Slider initialSlides={initialSlides} />
      </section>

      <section className="flex justify-center max-w-[1600px] mx-auto md:hidden min-h-[170px] sm:min-h-[260px] mt-3 mb-4 sm:mt-4 md:mt-6 px-2 sm:px-4 md:px-6">
        <Shopbycat />
      </section>

      <section className="flex justify-center min-h-[430px] sm:min-h-[560px] lg:min-h-[620px] max-w-[1600px] mx-auto mt-2 sm:mt-4 md:mt-6 px-2 sm:px-4 md:px-6">
        <Bestsellers
          posterIndex={0}
          initialData={initialBestsellers}
          initialPoster={initialBestsellerPoster}
        />
      </section>

      <section className="w-full flex justify-center min-h-[260px] sm:min-h-[360px] lg:min-h-[320px] max-w-[1600px] mx-auto mt-2 sm:mt-4 md:mt-6 bg-white pb-2 sm:pb-6 pt-4 sm:pt-6 md:pt-8">
        {showDeferred && (
          <div className="w-full">
            <div className="flex items-center gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="h-[1px] bg-slate-300 flex-1" />
              <h2 className="section-title tracking-wide uppercase">
                Explore Aesthetics
              </h2>
              <div className="h-[1px] bg-slate-300 flex-1" />
            </div>
            <PosterGrid
              rows={`${isXs ? "3" : "1"}`}
              cols={`${isXs ? "1" : "3"}`}
              posterIndex={[1, 4]}
              aspect="5 /3"
              gap="gap-2 sm:gap-0"
              darkFade={true}
              showText={true}
              rounded="none"
            />
          </div>
        )}
      </section>

      <section className="w-full">
        <div className="max-w-[1600px] mx-auto min-h-[760px] lg:min-h-[460px] mt-2 sm:mt-4 md:mt-6">
          {showDeferred && <StyleYourSpaceSection />}
        </div>
      </section>

      {showDeferred && videosLength >= 5 && (
        <section className="w-full flex min-h-[360px] sm:min-h-[430px] max-w-[1600px] mx-auto mt-2 sm:mt-4 md:mt-6 bg-white px-4 sm:px-8 py-4 sm:py-6">
          <div className="overflow-x-auto scroll-smooth horizontal-scroll pb-2">
            <VideoGrid
              cols={5}
              videoIndex={[0, videosLength]}
              aspect="9/16"
              autoplay={false}
              rounded="xl"
            />
          </div>
        </section>
      )}

      <section className="w-full lg:hidden flex justify-center min-h-[260px] sm:min-h-[360px] max-w-[1600px] mx-auto mt-2 sm:mt-4 md:mt-6 bg-white pb-2 sm:pb-6 pt-4 sm:pt-6 md:pt-8">
        {showDeferred && (
          <div className="w-full">
            <PosterGrid
              rows={`${isXs ? "3" : "1"}`}
              cols={`${isXs ? "1" : "3"}`}
              posterIndex={[5, 8]}
              aspect="5 /3"
              gap="gap-2 sm:gap-0"
              darkFade={true}
              showText={true}
              rounded="none"
            />
          </div>
        )}
      </section>

      <section className="flex justify-center max-w-[1600px] mx-auto min-h-[360px] sm:min-h-[340px] mt-2 sm:mt-4 md:mt-6">
        {showDeferred && <New />}
      </section>

      <section className="hidden justify-center max-w-[1600px] mx-auto mt-2 sm:mt-4 md:mt-6 bg-white pb-2 sm:pb-6 pt-4 sm:pt-6 md:pt-8">
        {showDeferred && (
          <div className="w-full">
            <div className="flex items-center gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="h-[1px] bg-slate-300 flex-1" />
              <h2 className="section-title">Craftsmanship & Quality</h2>
              <div className="h-[1px] bg-slate-300 flex-1" />
            </div>
            <div className="w-full lg:w-[1/2] px-4">
              <VideoGrid
                cols={1}
                videoIndex={[0, 1]}
                aspect="16/9"
                autoplay={true}
                rounded="xl"
              />
            </div>
          </div>
        )}
      </section>

      <section className="flex justify-center max-w-[1600px] mx-auto min-h-[430px] sm:min-h-[560px] lg:min-h-[390px] mt-2 sm:mt-4 md:mt-6 px-2 sm:px-4 md:px-6">
        {showDeferred && <CurratedLooks />}
      </section>

      <section className="max-w-[1600px] mx-auto my-2 sm:my-4 md:my-6 px-2 sm:px-4 md:px-6">
        {showDeferred && (
          <div
            className={`grid gap-2 sm:gap-4 md:gap-6 items-start ${
              hasRecommendations && hasRecentlyViewed && userData
                ? "lg:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {userData && (
              <Recommendations
                limit={20}
                onEmpty={() => setHasRecommendations(false)}
              />
            )}
            <RecentlyViewed onEmpty={() => setHasRecentlyViewed(false)} />
          </div>
        )}
      </section>
    </div>
  );
}
