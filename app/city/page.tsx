// app/city/page.tsx
import { Suspense } from "react";
import City from "./city";

export default function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <Suspense fallback={<div>Loading city...</div>}>
      <City city={searchParams.city || ""} />
    </Suspense>
  );
}
