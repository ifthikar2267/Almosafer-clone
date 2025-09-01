"use client";

import { useParams, useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { MapPin, Wifi, Dumbbell, CircleParking, WavesLadder, ChevronRight, ChevronDown, ChevronUp, Phone, Mail, Store, } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Guests from "../../../component/Guests";
import Footer from "../../../component/Footer";
import { FaWhatsapp } from "react-icons/fa";

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


export default function HotelDetail() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");
  const roomsParam = searchParams.get("rooms");

  const [checkIn, setCheckIn] = useState<Date | null>(
    checkInParam ? new Date(checkInParam) : null
  );
  const [checkOut, setCheckOut] = useState<Date | null>(
    checkOutParam ? new Date(checkOutParam) : null
  );
  const [rooms, setRooms] = useState<Room[]>(
    roomsParam ? JSON.parse(roomsParam) : [{ adults: 2, children: 0 }]
  );

  const [post, setPost] = useState<Post | null>(null);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [similarPosts, setSimilarPosts] = useState<Post[]>([]);

   const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



useEffect(() => {
  if (!post?.city || !post?._id) return;

  fetch(`/api/posts?city=${encodeURIComponent(post.city)}&excludeId=${post._id}`)
    .then((res) => res.json())
    .then((data) => setSimilarPosts(data))
    .catch((err) => console.error("Similar posts error:", err));
}, [post]);



  const faqs = post ?
  [
    {
      question: `What are the check-in and check-out times at ${post.title}?`,
      answer: "The check-in time is 18:00 and the check-out time is 12:00.",
    },
    {
      question: `Where is the ${post.title} property located?`,
      answer: `Located in ${post.location}, ${post.city}, ${post.country}.`,
    },
    {
      question: `What are the dining options available at ${post.title}?`,
      answer: "Guests can enjoy multiple dining options offering international and local cuisines.",
    },
    {
      question: "Is free cancellation available?",
      answer: "Yes, free cancellation is available on eligible bookings.",
    },
    {
      question: `Is parking available at ${post.title}?`,
      answer: "Yes, parking is available for guests.",
    },
  ] : [];

  const toggleFAQ = (index: SetStateAction<number | null>) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`)
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (!res.ok) throw new Error(data.error || "Failed to fetch");
          setPost(data);
        } catch (err) {
          console.error("Response was not JSON:", text);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  if (!post) return <div className="bg-white text-black">Loading...</div>;

  return (
    <div className="bg-white overflow-y-auto no-scrollbar ">
        {show && (
        <div className="fixed top-0 left-0 w-full bg-gray-50 p-6 z-50 transition duration-300">
            <button
              onClick={() => router.back()}
              className="absolute pt-1 md:hidden"
            >
              <ArrowLeftIcon className="h-6 w-6 text-cyan-600 " />
            </button>
          <h1 className="text-xl text-black flex items-center justify-center">{post.title}</h1>
        </div>
      )}
      {/* Hotel images slider */}
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
            <button
              onClick={() => router.back()}
              className="absolute pt-3 px-5 md:hidden"
            >
              <ArrowLeftIcon className="h-6 w-6 text-white" />
            </button>
            <img
              src={img}
              alt={`${post.title} - ${index + 1}`}
              className="w-full h-60 object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Hotel Title & Location */}
      <div className="p-5 relative">
        <h1 className="text-xl text-black font-bold">{post.title}</h1>
        <p className="text-gray-600 flex items-center gap-1 pt-1">
          <MapPin className="h-4 w-4" /> {post.location}
        </p>
      </div>

      {/* Facilities Section */}
      <div className="px-4">
        <h2 className="text-black text-xl font-semibold pt-6">Amenities</h2>
        <p className="text-gray-600">Amenities for {post.title}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-4">
          <div className="flex items-center gap-2">
            <Wifi className="h-7 w-7 text-cyan-600" />
            <span className="text-gray-800">Wi-Fi</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-cyan-600" />
            <span className="text-gray-800">Gym/Fitness</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleParking className="h-7 w-7 text-cyan-600" />
            <span className="text-gray-800">Parking</span>
          </div>
          <div className="flex items-center gap-2">
            <WavesLadder className="h-7 w-7 text-cyan-600" />
            <span className="text-gray-800">Swimming Pool</span>
          </div>
        </div>
      </div>

      {/* Room selection */}
      <div className="p-4 border-t border-gray-300 mt-6">
        <h1 className="text-black text-xl pb-4">Select a room</h1>

        <div className="flex flex-row sm:flex-row gap-2">
        {/* Check-in & Check-out in one pill */}
        <div className="flex items-center border border-gray-300 rounded-2xl p-1 w-50">
          {/* Check-in */}
          <div className="flex flex-col relative">
  <p className="text-sm text-gray-500 px-2">Check-in</p>
  <DatePicker
    selected={checkIn}
    onChange={(date) => date && setCheckIn(date)}
    selectsStart
    startDate={checkIn}
    endDate={checkOut}
    minDate={new Date()}
    dateFormat="dd MMM"
    className="w-20 text-cyan-600 font-medium text-sm bg-transparent focus:outline-none px-4"
    popperPlacement="bottom-start"
  />
</div>


          {/* Arrow */}
          <ChevronRight className="text-gray-400" />

          {/* Check-out */}
          <div className="flex flex-col">
            <p className="text-sm px-1 text-gray-500">Check-out</p>
            <DatePicker
              selected={checkOut}
              onChange={(date) => date && setCheckOut(date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              dateFormat="dd MMM"
              className="w-20 text-cyan-600 font-medium text-sm bg-transparent focus:outline-none px-4"
            />
          </div>
        </div>

        {/* Guests pill */}
        <div
          className="border border-gray-300 rounded-2xl p-4 cursor-pointer flex flex-row items-center justify-center w-40 sm:w-auto"
          onClick={() => setIsGuestsOpen(true)}
        >
          <p className="text-cyan-600 font-medium text-xs">
            {rooms.length} ROOM{rooms.length > 1 ? "S" : ""},{" "}
            {rooms.reduce((sum, r) => sum + r.adults, 0)} ADULTS
          </p>
        </div>
      </div>

      {/* Guests Modal */}
      {isGuestsOpen && (
        <Guests
          rooms={rooms}
          setRooms={setRooms}
          isOpened={isGuestsOpen}
          setIsOpened={setIsGuestsOpen}
        />
      )}
            </div>
            <div>
                <h1 className="text-black p-4 text-xl">About the property</h1>
                <p className="text-gray-600 p-3">Nestled in the heart of the city, this property blends comfort, convenience, and modern style. Whether you’re here for business or leisure, you’ll enjoy spacious rooms, attentive service, and easy access to nearby attractions. Designed with both relaxation and productivity in mind, the hotel ensures a memorable stay for every guest.</p>
            </div>

             <div className="p-4 pb-8">
        <h2 className="text-black text-xl mb-4">FAQs</h2>
        <div className="space-y-1 border border-gray-300 rounded-lg">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                className="w-full text-left text-gray-900 p-3 font-small flex justify-between items-center border-b border-gray-300"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>{openIndex === index ? <ChevronUp className="text-cyan-600"/> : <ChevronDown className="text-cyan-600"/>}</span>
              </button>
              {openIndex === index && (
                <p className="p-3 text-gray-600 font-small">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-black px-5 text-xl pb-4">Similar properties</h1>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar p-4 snap-x snap-mandatory pb-5">
  {similarPosts.length > 0 ? (
    similarPosts.map((item) => (
      <div
        key={item._id}
             className="snap-center flex-shrink-0 w-[90%] sm:w-[250px] md:w-[300px] rounded-xl bg-white border border-gray-300"
        onClick={() => router.push(`/hotel/${item._id}`)}
      >
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
              {item.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    alt={`${item.title} - ${index + 1}`}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500">{item.star}-star Hotel <span className="text-black font-bold px-1">•</span>  {item.location}</p>
              <p className="text-gray-600 text-md">{item.city}, {item.country}</p>
              {/* Price */}
              <div className="mt-3 flex flex-col items-end">
                <p className="text-lg font-bold text-gray-800">
                  AED {item.price}
                </p>
                <p className="text-xs text-gray-500">Total for 1 night(incl. VAT)</p>
              </div>
            </div>
          </div>
    ))
  ) : (
    <p className="text-gray-500">No similar properties found.</p>
  )}
</div>


<div className="p-6 bg-white space-y-6">
      <h1 className="text-black text-lg font-semibold">Need help?</h1>

      {/* WhatsApp */}
      <div className="flex items-center justify-between cursor-pointer">
        <div className="flex items-center space-x-3">
           <FaWhatsapp className="text-black-500 text-2xl" />
          <div>
            <p className="font-medium text-black">WhatsApp</p>
            <p className="text-gray-500 text-sm">+966 55 440 0000</p>
          </div>
        </div>
        <span className="text-cyan-600 text-xl"><ChevronRight/></span>
      </div>

      {/* Call */}
      <div className="flex items-center justify-between cursor-pointer border-t border-gray-300">
        <div className="flex items-center space-x-3 pt-4">
          <Phone className="text-black-500" />
          <div>
            <p className="font-medium text-black">Call us</p>
            <p className="text-gray-500 text-sm">920000997</p>
          </div>
        </div>
        <span className="text-cyan-600 text-xl"><ChevronRight/></span>
      </div>

      {/* Email */}
      <div className="flex items-center justify-between cursor-pointer border-t border-gray-300">
        <div className="flex items-center space-x-3 pt-4">
          <Mail className="text-black-500" />
          <div>
            <p className="font-medium text-black">Email us</p>
            <p className="text-gray-500 text-sm">support@almosafer.com</p>
          </div>
        </div>
        <span className="text-cyan-600 text-xl"><ChevronRight/></span>
      </div>

      {/* Visit */}
      <div className="flex items-center justify-between cursor-pointer border-t border-gray-300">
        <div className="flex items-center space-x-3 pt-4">
          <Store className="text-black-500" />
          <div>
            <p className="font-medium text-black">Visit Us now</p>
            <p className="text-gray-500 text-sm">Find a branch</p>
          </div>
        </div>
        <span className="text-cyan-600 text-xl"><ChevronRight/></span>
      </div>
    </div>
           
            <Footer/>
    </div>
  );
}
