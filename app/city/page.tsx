import { Suspense } from "react";
import City from "./city";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading city...</div>}>
      <City />
    </Suspense>
  );
}
