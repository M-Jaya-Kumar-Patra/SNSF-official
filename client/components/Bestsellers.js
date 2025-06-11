"use client"
import React from 'react';
import { Josefin_Sans } from 'next/font/google';
import { usePrd } from '@/app/context/ProductContext';
import Button from '@mui/material/Button';
import { LiaRupeeSignSolid } from "react-icons/lia";


const joSan = Josefin_Sans({ subsets: ['latin'], weight: '400' })

const Bestsellers = () => {
    const { prdData } = usePrd()


    return (
        <div className="flex flex-col items-center mt-5  w-full pb-10">
            <h1 className={`text-3xl font-bold text-black mt-10 mb-14  ${joSan.className} `}>Best sellers</h1>

            <div className="flex justify-center items-center">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-5 mb-5">
                    {
                        prdData
                            ?.filter(prd => prd?.isFeatured)
                            .slice(0, 3)
                            .map((prd, index) => (
                                <a
                                    href={`/product/${prd?._id}`}
                                    key={prd?._id || index}
                                    className="group w-[260px] min-h-[360px] border border-slate-200 shadow-sm flex flex-col items-center justify-between p-3 hover:shadow-xl transition duration-300 hover:scale-105"
                                >
                                    <div className="w-full flex flex-col items-center">
                                        <img
                                            src={prd?.images}
                                            alt={prd?.name}
                                            className="h-[250px] w-full object-cover"
                                        />
                                        <h1 className="text-black text-[19px] mt-3 font-medium font-sans text-center">
                                            {prd?.name}
                                        </h1>
                                        <h1 className="text-gray-500 text-[16px] mt-1 font-sans text-center">
                                            {prd?.brand}
                                        </h1>

                                        <div className="flex items-center gap-2 mt-1">
                                            {prd?.oldPrice && (
                                                 <p className="text-sm line-through text-gray-400">₹{prd?.oldPrice}</p>
                                            )}
                                            <p className="text-sm font-semibold text-black">₹{prd?.price}</p>
                                        </div>



                                    </div>

                                    {/* Buttons shown only on hover */}
                                    <div className="flex gap-2 w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Button
                                            variant="outlined"
                                            className="text-white bg-gray-600 rounded-md px-0 py-2 w-1/2 text-xs text-nowrap"
                                        >
                                            Add to cart
                                        </Button>
                                        <Button
                                            variant="contained"
                                            className="!bg-rose-600 hover:!bg-rose-700 text-white rounded-md px-0 py-2 w-1/2 text-xs text-nowrap"
                                        >
                                            Shop now
                                        </Button>
                                    </div>
                                </a>
                            ))
                    }
                </div>
            </div>


<Button
  variant="contained"
  className="!bg-blue-900 hover:!bg-blue-950 text-white rounded-md px-6  py-2"
>
  Explore Now
</Button>






        </div>
    )
}

export default Bestsellers
