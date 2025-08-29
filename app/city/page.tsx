// app/city/page.tsx
import { Suspense } from "react";
import dynamic from "next/dynamic";

const City = dynamic(() => import("./city"), { ssr: false });


export default function Page() {
  return (
    <Suspense fallback={<div>Loading city...</div>}>
      <City />
    </Suspense>
  );
}
