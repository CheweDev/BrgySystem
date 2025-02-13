import React from "react";
import Menu from "../../Menu";
import { GrAnnounce } from "react-icons/gr";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import UserSocialPost from "./UserSocialPost";
import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";

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
  const purokno = sessionStorage.getItem("purokno");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("Announcement")
      .select("*")
      .eq("purokno", purokno);
    
    setAnnouncements(data || []);
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
      className="min-h-screen flex flex-col"
    >
      <div className="p-3 flex-grow">
        <p className="text-3xl font-bold text-white mb-2 mt-5">Dashboard</p>
        <p className="text-xl text-white mt-4 flex gap-2 mb-2">
          Announcement <GrAnnounce />
        </p>

        <section className="mt-4 rounded-lg">
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
                  <p className="text-sm mt-2">{announcement.content}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
            ) : (
              <div className="p-4 text-center text-white">
                No announcement available.
              </div>
            )}
        </section>

        <hr className="border-t border-white my-4" />

        {/* Scrollable UserSocialPost */}
        <div className="overflow-y-auto max-h-[60vh] px-2 pb-4">
          <UserSocialPost />
        </div>
      </div>

      {/* Ensure Menu does not overlap buttons */}
      <div className="relative z-10">
        <Menu />
      </div>
    </div>
  );
};

export default UserDashboard;
