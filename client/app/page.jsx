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



import { Josefin_Sans } from "next/font/google";
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
  const { isCheckingToken } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);

  const res = fetchDataFromApi("/api/get");

  console.log("fffffffffffffffffffffffffffffffffffff", res);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("last-snsf-visit-date");

    if (lastVisit !== today) {
      const deviceId = getDeviceId();

      postData(
        "/api/visit/new",
        {
          deviceId,
        },
        false
      );

      localStorage.setItem("last-snsf-visit-date", today);
    }
  }, []);

  if (isCheckingToken) return <Loading />;

  return (
    <div className="bg-slate-100 ">
      <Toaster position="top-right" />

      <section
        className={` bg-slate-100 h-[96px] hidden md:block transition-opacity duration-500 ${
          isScrolled ? "opacity-0" : "opacity-100"
        }`}
      />

      <section className="flex justify-center">
        <Slider />
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
      mt-2 sm:mt-4 md:mt-6   bg-white py-6 pt-8
      "
      >
<div  className="w-full">
  
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-slate-300 flex-1 "></div>
          <h2 className={`${joSan.className} text-2xl md:text-3xl font-bold text-slate-800 tracking-wide uppercase`}>
            Explore Aesthetics
          </h2>
          <div className="h-[1px] bg-slate-300 flex-1"></div>
        </div>
        {/* Single poster */}
        <PosterGrid
          rows={1}
          cols={3}
          posterIndex={[1, 4]}
          aspect={"5 /3"}
          gap={"gap-2 sm:gap-0"}
          darkFade={true}
          showText={true}
          rounded={"none"}
        />
</div>
      </section>

      <section
        className="flex justify-center 
      max-w-[1600px] 
      mx-auto 
      mt-2 sm:mt-4 md:mt-6 
      
      "
      >
        <StyleYourSpaceSection />
      </section>



<section
        className="w- flex justify-center 
      max-w-[1600px] 
      mx-auto 
      mt-2 sm:mt-4 md:mt-6   bg-white p-6 pt-8
      "
      >
<div  className="w-full ">
  
        <div className="flex items-center gap-4 mb-6 ">
          <h2 className={`${joSan.className} text-2xl md:text-3xl font-bold text-slate-800 tracking-wide uppercase`}>
            See It In Action
          </h2>
        </div>
        {/* Single poster */}
        <VideoGrid
          cols={5} // 4 columns for "Shorts" look
          videoIndex={[1, 5]} // Next 4 videos
          aspect="9/16" // Vertical Phone Ratio
          autoplay={false} // Auto-play muted to grab attention
          rounded="xl"
        />
</div>
      </section>


 
      <section className="flex justify-center max-w-[1600px] mx-auto mt-2 sm:mt-4 md:mt-6  ">
        <New />
      </section>



<section
        className=" hidden w-full justify-center 
      max-w-[1600px] 
      mx-auto 
      mt-2 sm:mt-4 md:mt-6   bg-white p-6 pt-8
      "
      >
<div  className="w-full ">
  
        <div className="flex items-center gap-4 mb-6 ">
          <div className="h-[1px] bg-slate-300 flex-1"></div>

          <h2 className={`${joSan.className} text-2xl md:text-3xl font-bold text-slate-800 tracking-wide uppercase`}>
            Craftsmanship & Quality
          </h2>
          <div className="h-[1px] bg-slate-300 flex-1"></div>
        </div>
        {/* Single poster */}
        <div className="px-[300px]">
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

    

      

      <section className="lg:flex justify-center max-w-[1600px] mx-auto  my-2 sm:my-4 md:my-6 px-2 sm:px-4 md:px-6 gap-4  ">
        <Recommendations limit={8} />
        <RecentlyViewed />
      </section>
    </div>
  );
}
