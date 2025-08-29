"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";


type Post = {
  _id: string;
  title: string;
  city: string;
  location: string;
  images: string[];
  star: number;
  price: number;  
};

interface CityProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function City({ searchParams }: CityProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const city = (searchParams.city as string)?.trim() ?? "";


  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/posts")
      .then((res) => res.json())
      .then((res: Post[]) => {
        if (city) {
          const q = city.toLowerCase();
          const filtered = res.filter(
            (p) => p.city?.toLowerCase().includes(q)
          );
          setPosts(filtered);
        } else {
          setPosts(res);
        }
      })
      .catch((e) => {
        console.error("Fetch posts failed:", e);
        setPosts([]);
      });
  }, [city]);



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        <div className="p-5">
            <button 
                             onClick={() => router.back()}
                             className="absolute left-4 md:hidden">
                                <ArrowLeftIcon className="h-6 w-6 text-cyan-600" />
                            </button>
        </div>
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-2xl border border-gray-300 overflow-hidden hover:shadow-sm transition"
        >
          {/* Hotel Image */}
           <Swiper
            modules={[Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            className="w-full h-48 bg-white text-white"
          >
             <style jsx global>{`
                .swiper-pagination-bullet {
                background: white !important;
                opacity: 0.5 !important;
                }
                .swiper-pagination-bullet-active {
                background: white !important;
                opacity: 1 !important;
                }
            `}</style>
            {post.images.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`${post.title} - ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Content */}
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500">{post.star}-star Hotel <span className="text-black font-bold px-1">•</span>  {post.location}</p>
            <p className="text-gray-600 text-md">{post.city}</p>

            {/* Rating */}
            {/* <div className="flex items-center mt-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                {post.star} ⭐ 
              </span> */}
              {/* <span className="ml-2 text-gray-600 text-sm">
                {post.reviews} reviews
              </span> */}
            {/* </div> */}

            {/* Price */}
            <div className="mt-3 flex flex-col items-end">
              {/* <span className="text-gray-500 line-through text-sm">
                {post.oldPrice ? `AED ${post.oldPrice}` : ""}
              </span> */}
              <p className="text-lg font-bold text-gray-800">
                AED {post.price}
              </p>
              <p className="text-xs text-gray-500">Total for 1 night(incl. VAT)</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
