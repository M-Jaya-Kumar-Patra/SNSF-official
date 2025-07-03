"use client";
import React, { useEffect, useState } from "react";
import { MdStar } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { useParams } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { Button } from "@mui/material";
import Reviews from "./Reviews";
import Similar from "./Similar";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import Image from "next/image";
import { useWishlist } from '@/app/context/WishlistContext';
import Pincode from "./Pincode";
import ProductSpecs from "@/components/ProductSpecs";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Loading from "@/components/Loading";
import { RxCross2 } from "react-icons/rx";
import { Navigation, Pagination, A11y } from 'swiper/modules';



import "swiper/css/navigation";
import "swiper/css/pagination";

const Page = () => {
  const [productImages, setProductImages] = useState([]);
  const [openedProduct, setOpenedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [quantity, setQuantity] = useState(1);
  
  const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist()
  const { userData, setUserData, isLogin, isCheckingToken } = useAuth();
  const { cartData, addToCart, buyNowItem, setBuyNowItem } = useCart();
const [showLarge, setShowLarge] = useState(null); // null means no modal, otherwise holds image src
const [hideArrows, setHideArrows] = useState(null)

  const params = useParams();
  const router = useRouter();
  const prdId = params?.prd;

  useEffect(() => {
    fetchDataFromApi(`/api/product/${prdId}`, false).then((res) => {
      setOpenedProduct(res?.product);
      setProductImages(res?.product?.images);
      setSelectedImage(res?.product?.images[0]);
      window.scrollTo(0, 0);
    });
  }, [prdId, userData]);

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") setShowLarge(null);
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);


  const handleAddToCart = () => {
    addToCart(openedProduct);
  };

  if (isCheckingToken) {
    return <div className="text-center mt-10">Checking session...</div>;
  }

  if (!openedProduct || !productImages) {
    return <Loading />;
  }

  const addToCartFun = async (prd, userId, quantity) => {
    try {
      const added = await addToCart(prd, userId, quantity);
      if (added?.success || true) { // Optional: check your `addToCart` return type
        // Manually update userData.shopping_cart
        setUserData(prev => ({
          ...prev,
          shopping_cart: [...(prev?.shopping_cart || []), String(prd._id)]
        }));
      }
    } catch (err) {
      console.error("Error adding to cart", err);
    }
  };








  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-slate-100">
      <div className="w-full sm:w-[1020px] mb-2 sm:my-3 pt-2 sm:p-2 mx-auto sm:flex justify-between bg-white">
        {/* Left: Image Section */}
        <div className="image sm:sticky top-[50px] w-full sm:w-[400px] sm:h-[350px] sm:p-[2px] sm:border sm:border-slate-400 sm:m-3 mr-4 flex gap-[2px] flex-col sm:flex-row">
  {/* Mobile Carousel */}
  {/* Mobile Carousel */}
<div className="block sm:hidden w-full relative">
  <Swiper spaceBetween={10} slidesPerView={1} className="w-full h-auto">
    {productImages?.map((src, idx) => (
      <SwiperSlide key={idx}>
        <Image
          src={src}
          alt={`Slide ${idx + 1}`}
          className="w-full h-[300px] object-contain"
          width={500}
          height={300}
          unoptimized
          onClick={() => {setShowLarge(src)
            setHideArrows(true)
          }} // show this image in modal
        />
      </SwiperSlide>
    ))}
  </Swiper>

  {/* Wishlist Button for mobile */}
  <div
    className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-3 right-3 cursor-pointer z-[90]"
    onClick={(e) => {
      if (!isLogin) {
        router.push("/login");
      } else {
        const isAlreadyInWishlist = userData?.wishlist?.some(item => item === String(openedProduct?._id));
        if (isAlreadyInWishlist) {
          const wishItem = wishlistData?.find(itemInWishData => itemInWishData.productId === openedProduct?._id);
          const itemId = wishItem?._id;
          if (itemId) removeFromWishlist(e, itemId, openedProduct?._id);
        } else {
          addToWishlist(e, openedProduct, userData?._id);
        }
      }
    }}
  >
    {isLogin && userData?.wishlist?.some(item => item === String(openedProduct?._id)) ? (
      <MdFavorite className="!text-rose-600 text-[22px] z-10" />
    ) : (
      <MdFavoriteBorder className="text-slate-600 text-[22px]" />
    )}
  </div>
</div>


{/* Fullscreen Modal for Mobile Large View */}
{showLarge && (
  <div className="fixed inset-0 bg-slate-100 bg-opacity-80 z-[999] flex flex-col items-center justify-center px-4">
    <div className="w-full flex justify-end">
      <button
        onClick={() => {setShowLarge(null)
          setHideArrows(false)
        }}
        className="!text-black text-3xl p-2"
      >
        <RxCross2 />
      </button>
    </div>

    <div className="w-full max-w-[500px] h-[80vh] flex justify-center items-center">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full"
        initialSlide={productImages.findIndex(img => img === showLarge) || 0}
      >
        {productImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <Image
              src={img}
              alt={`Slide ${idx + 1}`}
              width={500}
              height={500}
              className="object-contain w-full h-full"
              unoptimized
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>
)}




  {/* Desktop Thumbnail + Main Image */}
  <div className="hidden sm:flex gap-2">
    <div className="w-[75px] overflow-y-auto h-full p-[2px] border scrollbar-hide">
      <ul className="space-y-1">
        {productImages?.map((src, idx) => (
          <li
            key={idx}
            className={`border rounded cursor-pointer ${selectedImage === src ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setSelectedImage(src)}
          >
            <Image
              src={src}
              alt={`Thumbnail ${idx + 1}`}
              className="w-[128px] h-[64px] object-contain"
              width={100}
              height={100}
            />


          </li>
        ))}
      </ul>
    </div>

    <div className="w-full relative">
      <div className="w-full sm:w-[319px] bg-gray-100 sm:h-[300px] flex justify-center items-center relative">
        <Image
  className="h-[300px] w-full object-contain border cursor-zoom-in"
  src={selectedImage || productImages?.[0] || "/"}
  alt="Selected Product"
  unoptimized
  width={300}
  height={300}
  onClick={() => {setShowLarge(selectedImage)
    setHideArrows(true)
  }} // Open modal
/>


        {/* Wishlist Button */}
        <div
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-4 right-3 cursor-pointer z-[500]"
          onClick={(e) => {
            if (!isLogin) {
              router.push("/login");
            } else {
              const isAlreadyInWishlist = userData?.wishlist?.some(item => item === String(openedProduct?._id));
              if (isAlreadyInWishlist) {
                const wishItem = wishlistData?.find(itemInWishData => itemInWishData.productId === openedProduct?._id);
                const itemId = wishItem?._id;
                if (itemId) removeFromWishlist(e, itemId, openedProduct?._id);
              } else {
                addToWishlist(e, openedProduct, userData?._id);
              }
            }
          }}
        >
          {isLogin && userData?.wishlist?.some(item => item === String(openedProduct?._id)) ? (
            <MdFavorite className="!text-rose-600 text-[22px] z-10" />
          ) : (
            <MdFavoriteBorder className="text-slate-600 text-[22px]" />
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="hidden sm:flex w-[319px] justify-around my-2 gap-2">
        <Button
          variant="outlined"
          className="!text-black bg-gray-600 rounded-md py-1 text-xs w-1/2 text-nowrap"
          onClick={() => {
            if (isLogin) {
              if (userData?.shopping_cart?.some(item => item === String(openedProduct?._id))) {
                router.push("/cart");
              } else {
                addToCartFun(openedProduct, userData?._id, quantity);
              }
            } else {
              router.push("/login");
            }
          }}
        >
          {isLogin && userData?.shopping_cart?.some(item => item === String(openedProduct?._id))
            ? "Go to cart"
            : "Add to cart"}
        </Button>

        <Button
          variant="contained"
          className="!bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-2 py-1 text-xs !w-1/2 text-nowrap"
          onClick={() => {
            setBuyNowItem({ ...openedProduct, quantity: 1 });
            router.push("/checkOut");
          }}
        >
          Book Now
        </Button>
      </div>
    </div>
  </div>


  {/* Fullscreen Modal for Large Image View */}
{showLarge && (
  <div className="fixed inset-0 bg-slate-100 bg-opacity-80 z-[999] flex flex-col items-center justify-center px-4">
    <div className="w-full flex justify-end">
      <button
        onClick={() =>{ setShowLarge(null)
          setHideArrows(false)
        }}
        className="text-black text-3xl p-2"
      >
        <RxCross2 />
      </button>
    </div>

    <div className="w-full max-w-[800px] h-[80vh] flex justify-center items-center">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full"
        initialSlide={productImages.findIndex(img => img === showLarge) || 0}
      >
        {productImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <Image
              src={img}
              alt={`Slide ${idx + 1}`}
              width={800}
              height={800}
              className="object-contain w-full h-full"
              unoptimized
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>
)}


</div>

        {/* Right: Product Details */}
<div className="details sm:w-[600px] px-3 sm:p-4 sm:pt-6">
  <h2 className="text-[22px] sm:text-[25px] font-medium mt-2 am:mt-0 mb-1 sm:mb-3 text-gray-800">
    {openedProduct?.name}
  </h2>

  <h2 className="text-[18px] sm:text-[20px] font-medium mb-2 sm:mb-3 text-gray-500">
    {openedProduct?.brand}
  </h2>

  <div
    className={`flex justify-center items-center gap-[2px] text-white  !text-sm font-semibold  sm:px-[6px] w-[50px] h-[23px] rounded ${
      openedProduct?.rating > 4.5
        ? 'bg-green-600'
        : openedProduct?.rating > 3.5
        ? 'bg-green-500'
        : openedProduct?.rating > 2.5
        ? 'bg-amber-500'
        : openedProduct?.rating > 1.5
        ? 'bg-orange-500'
        : 'bg-red-500'
    }`}
  >
    {parseFloat(openedProduct?.rating).toFixed(1)} <MdStar />
  </div>

  <div className="flex items-center gap-2">
    <div className="mt-2 sm:mt-4 text-[22px] sm:text-[25px] font-semibold text-black">
      ₹{openedProduct?.price}
    </div>
    <div className="line-through text-gray-500 mt-2 sm:mt-4 text-[15px] sm:text-[17px] font-normal">
      ₹{openedProduct?.oldPrice}
    </div>
    <div className="text-green-700 mt-2 sm:mt-4 text-[15px] sm:text-[17px] font-medium">
      {openedProduct?.discount}% off
    </div>
  </div>


  <div className="sm:hidden flex justify-around my-2 gap-2">



              <Button
                variant="outlined"
                className="!text-[#1e40af] !border-[#1e40af] bg-gray-600 rounded-md px-1 py-1 text-xs !w-1/2 !text-nowrap"
                onClick={() => {
                  if (isLogin) {
                    if (userData?.shopping_cart?.some(item => item === String(openedProduct?._id))) {
                      router.push("/cart");
                    } else {
                      addToCartFun(openedProduct, userData?._id, quantity);
                    }
                  } else {
                    router.push("/login");
                  }
                }}
              >
                {isLogin
                  ? userData?.shopping_cart?.some(item => item === String(openedProduct?._id))
                    ? 'Go to cart'
                    : 'Add to cart'
                  : 'Add to cart'}
              </Button>


              <Button
                variant="contained"

                className="!bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-2 py-1 text-xs w-1/2 text-nowrap"
                onClick={() => {
                  setBuyNowItem({ ...openedProduct, quantity: 1 });
                  router.push("/checkOut");
                }}
              >
                Book Now
              </Button>
            </div>


<div className="flex gap-4 mt-4">
  <p className="text-sm text-gray-600 mt-2">  
  {`Your order will be delivered within ${openedProduct?.delivery_days} days from the date it was placed.`}
</p>


  </div>


  


  {/* Description */}
  {openedProduct?.description && 
  <div className="flex gap-4 mt-4">
    <h1 className="text-gray-500 font-semibold">Description</h1>
    <p className="text-black">
      {openedProduct?.description}
    </p>
  </div>
  }
  {/* Warranty Info */}
  <div className="flex gap-4 mt-4">
     <h1 className="text-gray-500 font-semibold">Warranty </h1>
  <p className="text-black text-sm"><Link href="/warranty" className="text-blue-600 underline">View warranty policy</Link>
  </p>
  </div>

  {/* Product Specs */}
  <ProductSpecs specs={openedProduct?.specifications} />

  {/* Reviews */}
  <Reviews productId={prdId} />
</div>

      </div>


      {/* similar products */}
      <div className=" w-full mx-10">
        <Similar prdId={prdId}  hideArrows={hideArrows} />
      </div>
    </div>
  );
};

export default Page;