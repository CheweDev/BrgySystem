import React from "react";
import Menu from "../../Menu";
import { GrAnnounce } from "react-icons/gr";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import UserSocialPost from "./UserSocialPost";

const DynamicCalendarIcon = ({ date }) => {
  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.toLocaleString("default", { month: "short" });

  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-lg shadow-md">
      <span className="text-sm font-semibold uppercase">{month}</span>{" "}
      <span className="text-2xl font-bold">{day}</span>
    </div>
  );
};

const UserDashboard = () => {
  // Simulated announcements
  const announcements = [
    // {
    //   id: 1,
    //   date: "2025-01-12",
    //   text: "Meeting rescheduled to January 12th, 2025. Please mark your calendars.",
    // },
    // {
    //   id: 2,
    //   date: "2025-01-15",
    //   text: "Reminder: Submit your reports before the deadline on January 15th, 2025.",
    // },
    // {
    //   id: 3,
    //   date: "2025-01-16",
    //   text: "Meeting rescheduled to January 16th, 2025. Please mark your calendars.",
    // },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
      className="min-h-screen"
    >
      <div className="p-3">
        <p className="text-3xl font-bold text-white mb-2 mt-5">Dashboard</p>
        <hr className="border-t border-white my-4" />
        <p className="text-xl text-white flex gap-2 mb-2">
          Announcement <GrAnnounce />
        </p>

        <section className="mt-4 bg-gray-100 rounded-lg">
          {announcements.length > 0 ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              loop
              autoplay={{ delay: 1500 }}
              className="rounded-lg shadow-md"
            >
              {announcements.map((announcement) => (
                <SwiperSlide
                  key={announcement.id}
                  className="flex-shrink-0 w-80 p-4 bg-white rounded-lg shadow-md flex flex-col justify-between"
                >
                  <div className="flex gap-2">
                    <DynamicCalendarIcon date={announcement.date} />
                    <p className="text-sm mt-2">{announcement.text}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No announcement available.
            </div>
          )}
        </section>

        <hr className="border-t border-white my-4" />
        <UserSocialPost />
      </div>

      <Menu />
    </div>
  );
};

export default UserDashboard;
