"use client";

import { useRouter } from "next/navigation";
import SlideUpDialog from "@/components/ui/SlideUpDialog";
import SearchPanel from "@/components/home/SearchPanel";

export default function StayPage({ isOpened, setIsOpened }) {
  const router = useRouter();

  const handleSubmit = ({ destination, checkIn, checkOut, rooms }) => {
    const params = new URLSearchParams();
    if (destination) params.set("city", destination);
    params.set("checkIn", checkIn.toISOString());
    params.set("checkOut", checkOut.toISOString());
    params.set("rooms", JSON.stringify(rooms));
    setIsOpened(false);
    router.push(`/city?${params.toString()}`);
  };

  return (
    <SlideUpDialog
      open={isOpened}
      onClose={() => setIsOpened(false)}
      variant="bottom"
    >
      <SearchPanel onSubmit={handleSubmit} />
    </SlideUpDialog>
  );
}
