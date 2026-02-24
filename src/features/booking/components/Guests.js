"use client";

import { Bed } from "lucide-react";
import SlideUpDialog from "@/components/ui/SlideUpDialog";

export default function Guests({ rooms, setRooms, isOpened, setIsOpened }) {
  const updateAdults = (roomIndex, value) => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === roomIndex
          ? { ...room, adults: Math.max(1, room.adults + value) }
          : room
      )
    );
  };

  const updateChildren = (roomIndex, value) => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === roomIndex
          ? { ...room, children: Math.max(0, room.children + value) }
          : room
      )
    );
  };

  const addRoom = () => {
    if (rooms.length < 5) {
      setRooms([...rooms, { adults: 1, children: 0 }]);
    }
  };

  const removeRoom = (index) => {
    if (rooms.length > 1) {
      setRooms((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <SlideUpDialog
      open={isOpened}
      onClose={() => setIsOpened(false)}
      title="Guests"
    >
      <p className="flex items-center justify-center text-md text-gray-500 mb-5">
        Maximum number of guests per room is 8
      </p>

      {rooms.map((room, index) => (
        <div key={index} className="border border-gray-300 rounded-xl p-3 mb-3">
          <div className="flex items-center mb-2 relative gap-3">
            <Bed className="absolute-left text-black"/>
            <p className="font-medium text-black">Room {index + 1}</p>
            {rooms.length > 1 && (
              <button
                onClick={() => removeRoom(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="text-black">
              Adults <span className="text-gray-400">(Age 12+)</span>
            </span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => updateAdults(index, -1)}
                className="px-3 py-1 border border-gray-600 rounded-full"
              >
                <span className="text-gray-600">-</span>
              </button>
              <span className="text-black">{room.adults}</span>
              <button
                onClick={() => updateAdults(index, 1)}
                className="px-3 py-1 border border-cyan-600 rounded-full"
              >
                <span className="text-cyan-600">+</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 border-t border-gray-300">
            <span className="mt-5 text-black">
              Children <span className="text-gray-400">(Age 0-11)</span>
            </span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => updateChildren(index, -1)}
                className="px-3 py-1 border border-gray-600 rounded-full mt-5"
              >
                <span className="text-gray-600">-</span>
              </button>
              <span className="mt-5 text-black">{room.children}</span>
              <button
                onClick={() => updateChildren(index, 1)}
                className="px-3 py-1 border border-cyan-600 rounded-full mt-5"
              >
                <span className="text-cyan-600">+</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center mt-8">
        <button
          onClick={addRoom}
          className="w-50 py-2 border border-cyan-600 rounded-full text-cyan-600"
        >
          <span className="font-semibold text-lg ">+</span> Add another room
        </button>
      </div>

      <button
        onClick={() => setIsOpened(false)}
        className="w-full bg-cyan-600 text-white py-3 rounded-full fixed bottom-5 left-1/2 transform -translate-x-1/2 max-w-xs"
      >
        Apply
      </button>
    </SlideUpDialog>
  );
}
