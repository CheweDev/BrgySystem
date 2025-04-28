import React from "react";
import Menu from "../../Menu";
import { GrAnnounce } from "react-icons/gr";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import UserSocialPost from "./UserSocialPost";
import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import { Autoplay } from "swiper/modules";
import { MdWavingHand } from "react-icons/md";
import styled, { keyframes } from "styled-components";

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

const wave = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-15deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const WavingHandIcon = styled(MdWavingHand)`
  display: inline-block;
  animation: ${wave} 0.5s ease-in-out infinite;
`;

const UserDashboard = () => {
  const purokno = sessionStorage.getItem("purokno");
  const [announcements, setAnnouncements] = useState([]);
  let name = sessionStorage.getItem("name");

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
      <div className="flex flex-col flex-grow overflow-hidden p-2">
        <p className="text-2xl font-bold text-white mt-3 tracking-wide flex items-center gap-2 px-1">
          Welcome, <span className="text-[#daf86c]">{name}</span>
          <WavingHandIcon />
        </p>

        <p className="text-md text-white flex gap-1 mt-2 mb-1 px-1">
          Announcement <GrAnnounce />
        </p>

        <section className="shrink-0">
          {announcements.length > 0 ? (
            <Swiper
              modules={[Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              className="rounded-lg shadow-md"
            >
              {announcements.map((announcement) => (
                <SwiperSlide
                  key={announcement.id}
                  className="flex-shrink-0 w-80 p-3 bg-white rounded-lg shadow-md flex flex-col justify-between"
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

        <div className="flex-grow overflow-y-auto pb-12">
          <UserSocialPost />
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <Menu />
      </div>
    </div>
  );
};

export default UserDashboard;
