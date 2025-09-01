import { Dialog } from "@headlessui/react";
import Stay from "../app/stay/page";

export default function StayPage({ isOpened, setIsOpened }) {
  return (
    <Dialog open={isOpened} onClose={() => setIsOpened(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-x-0 bottom-0 flex justify-center">
        <Dialog.Panel className="bg-white w-full max-h-[65vh] rounded-t-2xl p-5">
          {/* Pass onSuccess callback */}
          <Stay onSuccess={() => setIsOpened(false)} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
