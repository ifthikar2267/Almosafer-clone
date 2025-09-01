"use client";

import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-10">
     {/* Top Links */}
<div className="space-y-4 mb-8">
  {/* Corporate */}
  <div>
    <h3 className="font-semibold text-gray-900 inline-block mr-2 mb-2">Corporate:</h3>
    <div className="inline-flex flex-wrap gap-x-3 gap-y-1">
      <Link href="#" className="text-cyan-600 hover:underline">About us</Link>
      <Link href="#" className="text-cyan-600 hover:underline">Careers</Link>
      <Link href="#" className="text-cyan-600 hover:underline">Almosafer Business</Link>
      <Link href="#" className="text-cyan-600 hover:underline">Almosafer Corporate</Link>
    </div>
  </div>

  {/* Legal */}
  <div>
    <h3 className="font-semibold text-gray-900 inline-block mr-2">Legal:</h3>
    <div className="inline-flex flex-wrap gap-x-3 gap-y-1">
      <Link href="#" className="text-cyan-600 hover:underline">Terms & conditions</Link>
      <Link href="#" className="text-cyan-600 hover:underline">Privacy Policy</Link>
    </div>
  </div>

  {/* Support */}
  <div>
    <h3 className="font-semibold text-gray-900 inline-block mr-2">Support:</h3>
    <div className="inline-flex flex-wrap gap-x-3 gap-y-1">
      <Link href="#" className="text-cyan-600 hover:underline">Contact us</Link>
      <Link href="#" className="text-cyan-600 hover:underline">FAQs</Link>
    </div>
  </div>

  {/* Countries */}
  <div>
    <h3 className="font-semibold text-gray-900 inline-block mr-2 mb-2">Countries:</h3>
    <div className="inline-flex flex-wrap gap-x-3 gap-y-1">
      <Link href="#" className="text-cyan-600 hover:underline">Saudi Arabia</Link>
      <Link href="#" className="text-cyan-600 hover:underline">Kuwait</Link>
      <Link href="#" className="text-cyan-600 hover:underline">United Arab Emirates</Link>
      <Link href="#" className="text-cyan-600 hover:underline">Bahrain</Link>
      <Link href="#" className="text-cyan-600 hover:underline">Qatar</Link>
      <Link href="#" className="text-cyan-600 hover:underline">Oman</Link>
      <Link href="#" className="text-cyan-600 hover:underline">Worldwide</Link>
    </div>
  </div>
</div>


        {/* Social Icons */}
        <div className="flex justify-center gap-8 text-cyan-600 text-lg mb-6">
          <Link href="https://www.facebook.com/Almosafertravel"><FaFacebookF /></Link>
          <Link href="https://www.linkedin.com/company/almosafer"><FaLinkedinIn /></Link>
          <Link href="https://www.instagram.com/almosafertravel_sa/?hl=en"><FaInstagram /></Link>
          <Link href="https://x.com/Almosafertravel"><FaXTwitter /></Link>
          <Link href="https://www.youtube.com/almosafertravel"><FaYoutube /></Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 text-sm">
          <p className="text-gray-600">Copyright © 2025 Almosafer</p>

          <div className="mt-4 space-y-2">
            <p className="flex flex-start text-black text-xs">Travel and Tourism Services License Permit Number:<br /></p>
            <span className="flex flex-start text-gray-600 text-xs">73103013</span>
            <p className="flex flex-start text-black text-xs">Commercial Registration Number:<br /></p>
            <span className="flex flex-start text-gray-600 text-xs">1010363465</span>
            <p className="flex flex-start text-black text-xs">Category:<br /></p>
            <span className="flex flex-start text-gray-600 text-xs">General Travel & Tourism Service Provider</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
