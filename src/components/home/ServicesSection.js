"use client";

const SERVICES = [
  {
    id: "transfers",
    label: "Airport transfer",
    icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-11/transfers.svg",
  },
  {
    id: "car",
    label: "Car rental",
    icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/carrental.svg",
  },
  {
    id: "activities",
    label: "Activities",
    icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/intactivities.svg",
  },
  {
    id: "packages",
    label: "Packages",
    icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/packages.svg",
  },
  {
    id: "lounges",
    label: "Airport lounge passes",
    icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/lounges.svg",
  },
  {
    id: "vip",
    label: "Vip meet and greet",
    icon: "https://cms-cdn.almosafer.com/drupal_cms/alm/files/public/2025-06/vipmeetandgreet.svg",
  },
  {
    id: "more",
    label: "More",
    icon: "https://static-sites.almosafer.com/assets/images/svg/visual_icons/moreservices.svg",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:overflow-visible md:grid md:grid-cols-4 lg:grid-cols-7 md:gap-5">
          {SERVICES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex-shrink-0 w-[100px] md:w-auto group"
            >
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 md:p-5 flex flex-col items-center justify-center min-h-[100px] md:min-h-[120px] transition-all duration-200 group-hover:shadow-md group-hover:scale-[1.02] group-hover:border-cyan-100">
                <img
                  src={item.icon}
                  alt=""
                  className="w-10 h-10 md:w-12 md:h-12 object-contain mb-2"
                />
                <span className="text-xs md:text-sm font-medium text-gray-700 text-center leading-tight">
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
