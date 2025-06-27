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
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import Image from "next/image";
import { useWishlist } from '@/app/context/WishlistContext';
import Pincode from "./Pincode";
import ProductSpecs from "@/components/ProductSpecs";
import Link from "next/link";





const Page = () => {
  const [productImages, setProductImages] = useState([]);

  const { userData, setUserData, isLogin } = useAuth()

  const { cartData, addToCart, buyNowItem, setBuyNowItem } = useCart()


  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(product);
  };


  const params = useParams()
  const prdId = params?.prd;

  const [openedProduct, setOpenedProduct] = useState(null)

  useEffect(() => {
    fetchDataFromApi(`/api/product/${prdId}`, false).then((res) => {
      setOpenedProduct(res?.product)
      setProductImages(res?.product?.images)
      setSelectedImage(res?.product?.images[0])
    })

  }, [prdId, userData])

  const [selectedImage, setSelectedImage] = useState();

  const [quantity, setQuantity] = useState(1)


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


  const { addToWishlist, removeFromWishlist, wishlistData } = useWishlist()




  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-slate-100">
      <div className="w-full sm:w-[1020px] mb-2 sm:my-3 pt-2 sm:p-2 mx-auto sm:flex justify-between bg-white">
        {/* Left: Image Section */}
        <div className="image sm:sticky top-[50px] w-full sm:w-[400px] sm:h-[350px]  sm:p-[2px] sm:border sm:border-slate-400 sm:m-3 mr-4  flex gap-[2px]">
          <div className="hidden sm:block w-[75px] overflow-y-auto h-full p-[2px] border scrollbar-hide">
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
                                width={100} height={100}

                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            <div className="w-full sm:w-[319px] bg-gray-100 sm:h-[300px] flex justify-center items-center">
              <Image
                className="h-[300px] w-full object-contain border"
                src={selectedImage||"/"}
                alt="Selected Product"
                                width={100} height={100}

              />
              <div
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 border-opacity-50 shadow-md hover:shadow-inner absolute top-4 right-3 cursor-pointer"
                onClick={(e) => {
                  if (!isLogin) {
                    router.push("/login");
                  } else {
                    const isAlreadyInWishlist = userData?.wishlist?.some(
                      (item) => item === String(openedProduct?._id)
                    );

                    if (isAlreadyInWishlist) {
                      const wishItem = wishlistData?.find(
                        (itemInWishData) => itemInWishData.productId === openedProduct?._id
                      );
                      const itemId = wishItem?._id;

                      if (itemId) {
                        removeFromWishlist(e, itemId, openedProduct?._id); // Assuming this function is defined and takes these args
                      }
                    } else {
                      addToWishlist(openedProduct, userData?._id);
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

            <div className="hidden  sm:flex justify-around my-2 gap-2">



              <Button
                variant="outlined"
                className="text-white bg-gray-600 rounded-md px-1 py-1   text-xs w-1/2 text-nowrap"
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
                Shop now
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Product Details */}
<div className="details sm:w-[600px] px-2 sm:p-4 sm:pt-6">
  <h2 className="text-[17px] sm:text-[25px] font-medium mt-2 am:mt-0 mb-1 sm:mb-3 text-gray-800">
    {openedProduct?.name}
  </h2>

  <h2 className="text-[15px] sm:text-[20px] font-medium mb-2 sm:mb-3 text-gray-500">
    {openedProduct?.brand}
  </h2>

  <div
    className={`flex justify-center items-center gap-[2px] text-white  !text-xs sm:text-sm font-semibold  sm:px-[6px] w-[40px] h-[21px] sm:w-[50px] sm:h-[23px] rounded ${
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
    <div className="mt-2 sm:mt-4 text-[20px] sm:text-[25px] font-semibold text-black">
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
                Shop now
              </Button>
            </div>

  {/* Pincode Checker */}
  <div className="sm:flex gap-4 mt-6">
    <h1 className="text-gray-500 font-semibold">Check delivery availability</h1>
    <Pincode />
  </div>
  {/* Estimated Delivery */}
  <div className="flex gap-4 mt-4">
    
    <p className="text-black">
      Delivery within 5–7 business days from order confirmation.
    </p>
  </div>


  {/* Warranty Info */}
  <div className="flex gap-4 mt-4">
     <h1 className="text-gray-500 font-semibold">Warranty </h1>
  <p className="text-black text-sm"><Link href="/warranty" className="text-blue-600 underline">View warranty policy</Link>
  </p>
  </div>

  {/* Description */}
  <div className="flex gap-4 mt-4">
    <h1 className="text-gray-500 font-semibold">Description</h1>
    <p className="text-black">
      {openedProduct?.description}
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
        <Similar prdId={prdId} />
      </div>
    </div>
  );
};

export default Page;
