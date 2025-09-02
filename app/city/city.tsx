"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { ChevronDown, User } from "lucide-react";
import StayPage from "../../component/StayPage";

type Post = {
  _id: string;
  title: string;
  city: string;
  country: string;
  location: string;
  images: string[];
  star: number;
  price: number;
};

type Room = {
  adults: number;
  children: number;
};

interface CityProps {
  city: string;
  rooms: Room[];
  checkIn: Date | null;
  checkOut: Date | null;
}

export default function City({ city, rooms, checkIn, checkOut }: CityProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    setLoading(true); // start loading before fetch
    fetch(process.env.NEXT_PUBLIC_API_URL + "/posts")
      .then((res) => res.json())
      .then((res: Post[]) => {
        if (city) {
          const q = city.toLowerCase();
          const filtered = res.filter((p) =>
            p.city?.toLowerCase().includes(q)
          );
          setPosts(filtered);
        } else {
          setPosts(res);
        }
        setLoading(false); // stop loader after data
      })
      .catch((e) => {
        console.error("Fetch posts failed:", e);
        setPosts([]);
        setLoading(false);
      });
  }, [city]);

  // Loader UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-10 w-10 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-white">
      {/* Header */}
      <header className="bg-white p-4 top-0 left-0 w-full z-50 border-b border-gray-300 sticky">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute pt-2 md:hidden"
        >
          <ArrowLeftIcon className="h-6 w-6 text-cyan-600" />
        </button>

        {/* City Name */}
        <div
          onClick={() => setIsOpened(true)}
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="font-semibold text-black text-lg">
            {posts[0]?.city}, {posts[0]?.country}
          </div>

          {/* Guests + Dates */}
          <div className="flex items-center text-gray-600 text-xs gap-2">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4 text-gray-500" />
              {rooms.reduce((sum, r) => sum + r.adults + r.children, 0)}
            </span>
            <span className="flex items-center gap-1">
              {checkIn?.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}{" "}
              -{" "}
              {checkOut?.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
              <ChevronDown className="text-cyan-600" />
            </span>
          </div>
        </div>

        {/* Dialog */}
        <StayPage isOpened={isOpened} setIsOpened={setIsOpened} />
      </header>

      {/* Hotels Grid */}
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/hotel/${post._id}?city=${encodeURIComponent(
            city
          )}&checkIn=${encodeURIComponent(
            checkIn ? checkIn.toISOString() : ""
          )}&checkOut=${encodeURIComponent(
            checkOut ? checkOut.toISOString() : ""
          )}&rooms=${encodeURIComponent(JSON.stringify(rooms))}`}
        >
          <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden hover:shadow-sm transition">
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
              <p className="text-sm text-gray-500">
                {post.star}-star Hotel{" "}
                <span className="text-black font-bold px-1">•</span>{" "}
                {post.location}
              </p>
              <p className="text-gray-600 text-md">
                {post.city}, {post.country}
              </p>

              {/* Price */}
              <div className="mt-3 flex flex-col items-end">
                <p className="text-lg font-bold text-gray-800">
                  AED {post.price}
                </p>
                <p className="text-xs text-gray-500">
                  Total for 1 night (incl. VAT)
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
