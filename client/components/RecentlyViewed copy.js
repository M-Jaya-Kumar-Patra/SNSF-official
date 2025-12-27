"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Josefin_Sans } from "next/font/google";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });


export default function RecentlyViewed() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

        if (viewed.length === 0) return;

        fetch(process.env.NEXT_PUBLIC_API_URL + `${`/api/product/recently-viewed`}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: viewed })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Order the products exactly as stored in localStorage
                    const ordered = viewed
                        .map(id => data.data.find(p => p._id === id))
                        .filter(Boolean);

                    setProducts(ordered);
                }
            });
    }, []);

    if (products.length === 0) return null;

    return (
        <div className="flex flex-col items-center mt-2 sm:mt-5 w-full pb-4 sm:pb-8">
      <h1
        className={`text-2xl sm:text-3xl font-bold text-black mt-4 mb-4 sm:mt-8 sm:mb-8 ${joSan.className}`}
      >Recently Viewed</h1>

            <div className="flex gap-4 overflow-x-auto pb-3">
                {products.map(product => (
                    <Link 
                        key={product._id} 
                        href={`/product/${product._id}`} 
                        className="min-w-[180px] max-w-[180px] bg-white shadow rounded-lg p-3"
                    >
                        <div className="w-full h-32 relative mb-2">
                            <Image
                                src={product.images?.[0]  || "/images/placeholder.jpg"}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                            />
                        </div>

                    </Link>
                ))}
            </div>
        </div>
    );
}
