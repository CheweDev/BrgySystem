import Menu from "../../Menu";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrAnnounce } from "react-icons/gr";

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

const AdminAttendance = () => {
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

  // Dummy data for attendees
  const attendees = [
    // {
    //   id: 1,
    //   name: "Neneng B Angkatawan",
    //   hours: 21,
    //   image:
    //     "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    // },
    // {
    //   id: 2,
    //   name: "Thomas Andre",
    //   hours: 19,
    //   image:
    //     "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    // },
    // {
    //   id: 3,
    //   name: "Dodong Upaw",
    //   hours: 17,
    //   image:
    //     "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    // },
    // {
    //   id: 4,
    //   name: "Ineng Tidyawat",
    //   hours: 15,
    //   image:
    //     "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    // },
    // {
    //   id: 5,
    //   name: "Sikma Bois",
    //   hours: 13,
    //   image:
    //     "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    // },
  ];

  return (
    <>
      <div
        style={{
          background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
        }}
        className="min-h-screen"
      >
        <div className="p-3">
          <p className="text-3xl font-bold text-white mb-2 mt-5">Dashboard</p>
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          <p className="text-xl text-white flex gap-2 mt-4 mb-2">
            Announcement <GrAnnounce />
          </p>

          {/* Announcements Section */}
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
              <p className="text-center text-gray-500 p-4">
                No announcements available
              </p>
            )}
          </section>

          <hr className="border-t border-white my-4" />

          {/* Attendance List */}
          <div className="px-2 mb-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white">Attendance</h2>
              <span className="text-white text-sm opacity-75">
                Volunteer hours
              </span>
            </div>

            {attendees.length > 0 ? (
              <div className="space-y-3">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="bg-base-200 rounded-3xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 overflow-hidden rounded-full">
                        <img
                          src={
                            attendee.image || "https://placehold.co/600x400/png"
                          }
                          alt={attendee.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <span className="text-gray-700 font-medium">
                        {attendee.name}
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-[#2A7B62] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {attendee.hours}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-white">No attendees available</p>
            )}
          </div>
        </div>
        <Menu />
      </div>
    </>
  );
};

export default AdminAttendance;
