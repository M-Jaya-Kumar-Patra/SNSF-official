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
import { useWishlist } from '@/app/context/WishlistContext';






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
      <div className="w-[1020px] my-3 p-2 mx-auto flex justify-between bg-white">
        {/* Left: Image Section */}
        <div className="image sticky top-[50px] w-[400px] h-[350px] p-[2px] border border-slate-400 m-3 mr-4  flex gap-[2px]">
          <div className="w-[75px] overflow-y-auto h-full p-[2px] border scrollbar-hide">
            <ul className="space-y-1">
              {productImages?.map((src, idx) => (
                <li
                  key={idx}
                  className={`border rounded cursor-pointer ${selectedImage === src ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setSelectedImage(src)}
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-[128px] h-[64px] object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="w-[319px] bg-gray-100 h-[300px] flex justify-center items-center">
              <img
                className="h-[300px] w-full object-contain border"
                src={selectedImage}
                alt="Selected Product"
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
                  <MdFavorite className="!text-rose-600 text-[22px]" />
                ) : (
                  <MdFavoriteBorder className="text-slate-600 text-[22px]" />
                )}
              </div>
            </div>

            <div className="flex justify-around my-2 gap-2">



              <Button
                variant="outlined"
                className="text-white bg-gray-600 rounded-md px-1 py-1 text-xs w-1/2 text-nowrap"
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
        <div className="details w-[600px] p-4 pt-6">
          <h2 className="text-[25px] font-medium mb-3 text-gray-800">
            {openedProduct?.name}
          </h2>

          <h2 className="text-[20px] font-medium mb-3 text-gray-500">
            {openedProduct?.brand}
          </h2>



          <div
            className={`flex justify-center items-center gap-[2px] text-white text-sm font-semibold px-[6px] w-[50px] h-[23px] rounded ${openedProduct?.rating > 4.5
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
            <div className="mt-4 text-[25px] font-semibold text-black ">
              ₹{openedProduct?.price}
            </div>
            <div className=" line-through text-gray-500 mt-4 text-[17px] font-normal ">
              ₹{openedProduct?.oldPrice}
            </div>

            <div className="  text-green-700 mt-4 text-[17px] font-medium ">
              {openedProduct?.discount}% off
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <h1 className="text-gray-500 font-semibold ">
              Delivery
            </h1>
            <p className="text-black font">

            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <h1 className="text-gray-500 font-semibold ">
              Highlights
            </h1>
            <p className="text-black font">

            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <h1 className="text-gray-500 font-semibold ">
              Description
            </h1>
            <p className="text-black font">
              {openedProduct?.description}
            </p>
          </div>

          <h2 className="text-[22px] text-black font-bold mt-10">Specification</h2>


          {/* <table className="text-black border border-black">
              <td className="border-black">Model Name</td>
              <td>S N Steel Fabrication Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae labore aspernatur quae facere ut itaque blanditiis vero architecto cum at corporis odit laboriosam maxime velit, maiores tempore quidem suscipit. Quam, numquam. Sequi sunt inventore aspernatur recusandae officiis minima aliquam fugit non maxime iure quas id porro dolorum unde, tempore enim cum ea praesentium earum? Harum, aspernatur nesciunt quas soluta illo, sit at dolores a omnis, ullam laborum suscipit error animi tempora quod ipsam magnam consectetur dolor illum deleniti adipisci et. Nostrum, harum! Voluptate, voluptatem! Eos, tenetur, reiciendis vt minima expedita similique eos inventore totam consequuntur assumenda necessitatibus distinctio blanditiis ipsam, maiores corrupti quos impedit deleniti repudiandae veniam. Est aliquam iste alias, iure rerum fuga magnam facere similique eaque dolor modi expedita corporis, beatae libero. Officiis, illum. Sint voluptatibus dolorum quptates, quaerat, vero recusandae tempore saepe! Optio, vel corrupti. Consequatur dolorem explicabo temporibus commodi incidunt ex autem sed expedita hic velit sit maiores launeque libero vero ullam accusantium suscipit iste, iusto tempora perspiciatis provident voluptatum deserunt pariatur? Quod sint molestiae quia officiis libero animi, assumenda fugit qui, accusantium atque ad asperiores perspiciatis magni nihil? Minima, ipsa incidunt ratione dolores voluptas animi ab magni eveniet est totam, placeat porro velit pariatur earum cum a hic quo. Ipsa obcaecati similique pariatur alias, eveniet voluptatibus doloremque, rerum mollitia omnis voluptatum earum eum deleniti sint? Quia exercitationem nesciunt minus inventore! Minima natus modi, a laboriosam, quidem aliquid cupiditate, ea neque nesciunt debitis dolorum. Harum vel minima recusandae soluta odit dicta voluptatibus dolorem velit ree aut quibusdam quisquam distinctio debitis fugit non quasi! Mollitia, perspiciatis fugiat veniam quae corporis error vitae modi a veritatis doloremque maxime expturi ducimus voluptate consequuntur officia, iusto accusamus necexercitationem quia minus sint minima adipisci maxime esse illo voluptates? Corporis, qui a nemo, odio autem dolor nobis nisi ducimus temporibus dolorum corrupti culpa quam eius natus nostrum sunt adipisci ipsa tenetur id voluptatem consectetur, reprehenderit rem eligendi! Dolore, eveniet ratione repudiandae non cum minus modi. Obcaecati omnis perspiciatis amet natus repellat reiciendis id illum perferendis in, assumenda quidem porro et a dolorem veniam, recusandae soluta deserunt! Eaque maxime aliquam sapiente laborum!</td>
            
          </table> */}
          <div className="text-black border border-black">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia unde harum natus animi ut laborum recusandae dolor dolore, ex repudiandae, aspernatur, magni a! Quaerat accusantium fuga aut blanditiis distinctio sed eaque incidunt quas quia dolorem maxime, vero iste commodi ut suscipit nam saepe voluptas dolores excepturi? Tenetur, voluxime veniam nam tempore quasi laborum velit sed id ab, quis qui necessitatibus omnis, odio quia deserunt possimus! Odio blanditiis amet doloribus natus sapiente perspiciatis, quaerat repellat reprehenderit atque eos obcaecati inventore voluptate voluptas impedit iste vitae corporis error quis illo voluptates.
          </div>

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
