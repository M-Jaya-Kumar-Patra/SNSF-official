"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Loading from "@/components/Loading";
import Slider from "@/components/Slider";
import Shopbycat from "@/components/Shopbycat";
import Bestsellers from "@/components/Bestsellers";
import New from "@/components/New";
import { Toaster } from "react-hot-toast";
import { fetchDataFromApi, postData } from "@/utils/api";
import RecentlyViewed from "@/components/RecentlyViewed";
import Recommendations from "@/components/Recommendations";
import { getDeviceId } from "@/utils/deviceId";
import Trending from "@/components/Trending";
import ShopByRoom from "@/components/ShopByRoom";
import HotDeal from "@/components/HotDeal";
import PosterGrid from "@/components/PosterGrid";
import CurratedLooks from "@/components/CurratedLook";
import StyleYourSpaceSection from "@/components/StyleYourSpaceSection";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import SmPoster from "@/components/SmPoster";
import VideoSlider from "@/components/VideoSlider";
import VideoGrid from "@/components/VideoGrid";

import { useScreen } from "./context/ScreenWidthContext";

import { Josefin_Sans } from "next/font/google";
import GoogleOneTap from "@/components/GoogleOneTap";
const joSan = Josefin_Sans({ subsets: ["latin"] });

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function Home() {
  const { isCheckingToken, userData } = useAuth();

  const { isXs, isSm, isMd, isLg, isXl, isXl1440, is2Xl, isGELg } = useScreen();

  const [isScrolled, setIsScrolled] = useState(false);

  const [videosLength, setVideosLength] = useState(0);
  const [hasRecommendations, setHasRecommendations] = useState(true);
  const [hasRecentlyViewed, setHasRecentlyViewed] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchDataFromApi("/api/videos/getAll", false);
        if (!res?.error) setVideosLength(res.data.length || []);
      } catch (e) {
        console.error("Video fetch error", e);
      }
    };
    load();
  }, []);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("l20dec25kjf34u85");

    if (lastVisit !== today) {
      const deviceId = getDeviceId();

      postData(
        "/api/visit/new",
        {
          deviceId,
        },
        false
      );

      localStorage.setItem("l20dec25kjf34u85", today);
    }
  }, []);

  // if (isCheckingToken) return <Loading />;



  return (
    <div
      className="bg-gradient-to-br 
from-slate-100 via-slate-50 to-slate-100 "
    >


      {isCheckingToken && (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading />
      </div>
    )}
      {/* <Toaster position="top-right" /> */}
 {!isCheckingToken && (
      <>
            <section
        className={` bg-slate-100 h-[86px] hidden md:block transition-opacity duration-500 ${
          isScrolled ? "opacity-0" : "opacity-100"
        }`}
      />

      <section className="flex justify-center ">
        <Slider />
      </section>

      {!userData && !isCheckingToken && <GoogleOneTap />}

      <section
        className="flex  justify-center max-w-[1600px] max-auto lg:hidden mt-3  mb-4 sm:mt-4 md:mt-6  
      px-2 sm:px-4 md:px-6 "
      >
        <Shopbycat />
      </section>

      <section
        className="flex justify-center 
      max-w-[1600px] 
      mx-auto 
      mt-2 sm:mt-4 md:mt-6  
      px-2 sm:px-4 md:px-6
      
      "
      >
        <Bestsellers posterIndex={0} />
      </section>

      <section
        className="w- flex justify-center 
      max-w-[1600px] 
      mx-auto 
      mt-2 sm:mt-4 md:mt-6   bg-white  pb-2  sm:pb-6 pt-4 sm:pt-6 md:pt-8
      "
      >
        <div className="w-full">
          <div className="flex items-center gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="h-[1px] bg-slate-300 flex-1 "></div>
            <h2 className={`section-title tracking-wide uppercase`}>
              Explore Aesthetics
            </h2>
            <div className="h-[1px] bg-slate-300 flex-1"></div>
          </div>
          {/* Single poster */}
          <PosterGrid
            rows={`${isXs ? "3" : "1"}`}
            cols={`${isXs ? "1" : "3"}`}
            posterIndex={[1, 4]}
            aspect={"5 /3"}
            gap={"gap-2 sm:gap-0"}
            darkFade={true}
            showText={true}
            rounded={"none"}
          />
        </div>
      </section>

      <section className="w-full">
        <div className="max-w-[1600px] mx-auto  mt-2 sm:mt-4 md:mt-6 ">
          <StyleYourSpaceSection />
        </div>
      </section>

      {videosLength >= 5 && (
        <section
          className="w-full flex
      max-w-[1600px] 
      mx-auto 
      mt-2 sm:mt-4 md:mt-6   bg-white px-4 sm:px-8 py-4 sm:py-6
      "
        >
          {/* SCROLL CONTAINER */}
          <div
            className="
          overflow-x-auto
          scroll-smooth
          horizontal-scroll
          pb-2
        "
          >
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

      <section
        className="w-full lg:hidden flex justify-center 
      max-w-[1600px] 
      mx-auto 
      mt-2 sm:mt-4 md:mt-6   bg-white  pb-2  sm:pb-6 pt-4 sm:pt-6 md:pt-8
      "
      >
        <div className="w-full">
          {/* Single poster */}
          <PosterGrid
            rows={`${isXs ? "3" : "1"}`}
            cols={`${isXs ? "1" : "3"}`}
            posterIndex={[5, 8]}
            aspect={"5 /3"}
            gap={"gap-2 sm:gap-0"}
            darkFade={true}
            showText={true}
            rounded={"none"}
          />
        </div>
      </section>

      <section className="flex justify-center max-w-[1600px] mx-auto mt-2 sm:mt-4 md:mt-6  ">
        <New />
      </section>

      <section
        className="hidden  justify-center 
      max-w-[1600px] 
      mx-auto 
      mt-2 sm:mt-4 md:mt-6   bg-white  pb-2  sm:pb-6 pt-4 sm:pt-6 md:pt-8
      "
      >
        <div className="w-full ">
          <div className="flex items-center gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="h-[1px] bg-slate-300 flex-1"></div>

            <h2 className="section-title">Craftsmanship & Quality</h2>
            <div className="h-[1px] bg-slate-300 flex-1"></div>
          </div>
          {/* Single poster */}
          <div className="w-full  lg:w-[1/2] px-4 ">
            <VideoGrid
              cols={1} // 4 columns for "Shorts" look
              videoIndex={[0, 1]} // Next 4 videos
              aspect="16/9" // Vertical Phone Ratio
              autoplay={true} // Auto-play muted to grab attention
              rounded="xl"
            />
          </div>
        </div>
      </section>

      <section
        className="flex justify-center max-w-[1600px] mx-auto 
      mt-2 sm:mt-4 md:mt-6  
      px-2 sm:px-4 md:px-6"
      >
        <CurratedLooks />
      </section>

      <section
        className="
    max-w-[1600px]
    mx-auto
    my-2 sm:my-4 md:my-6
    px-2 sm:px-4 md:px-6
  "
      >
        <div
          className={`
    grid
    gap-2 sm:gap-4 md:gap-6
    items-start
    ${
      hasRecommendations && hasRecentlyViewed && userData
        ? "lg:grid-cols-2"
        : "grid-cols-1"
    }
  `}
        >
          {userData && (
            <Recommendations
              limit={20}
              onEmpty={() => setHasRecommendations(false)}
            />
          )}

          <RecentlyViewed onEmpty={() => setHasRecentlyViewed(false)} />
        </div>
      </section>
      </>
    )}
    </div>
  );
}
