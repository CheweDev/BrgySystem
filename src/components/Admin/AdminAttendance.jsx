import Menu from "../../Menu";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrAnnounce } from "react-icons/gr";
import { useEffect, useState } from "react";
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

const AdminAttendance = () => {
  const avatar = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  const purokno = sessionStorage.getItem("purokno");
  const [announcements, setAnnouncements] = useState([]);
  const [attendees, setAttendees] = useState([]);

  
  useEffect(() => {
    fetchAnnouncements();
    fetchMembers();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("Announcement")
      .select("*")
      .eq("purokno", purokno)
      .order("created_at", { ascending: false });
    
    setAnnouncements(data || []);
  };

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("Attendance")
      .select("*")
      .eq("purokno", purokno);
  
    if (data) {
      // Merge attendees by name and sum their total time
      const mergedAttendees = data.reduce((acc, attendee) => {
        const existing = acc.find((a) => a.name === attendee.name);
        const [hours, minutes] = attendee.total.split(".").map(Number); // Parse hours and minutes
        const totalMinutes = (hours * 60) + (minutes || 0); // Convert to total minutes
  
        if (existing) {
          existing.totalMinutes += totalMinutes; // Sum minutes
        } else {
          acc.push({ ...attendee, totalMinutes });
        }
        return acc;
      }, []);
  
      // Convert total minutes back to hours and minutes format
      const finalAttendees = mergedAttendees.map((attendee) => {
        let finalHours = Math.floor(attendee.totalMinutes / 60);
        let finalMinutes = Math.round(attendee.totalMinutes % 60);
  
        if (finalMinutes === 60) {
          finalHours += 1;
          finalMinutes = 0;
        }
  
        return {
          ...attendee,
          total: `${finalHours}.${finalMinutes}`, // Format as "H.MMm"
        };
      });
  
      setAttendees(finalAttendees);
    } else {
      setAttendees([]);
    }
  };
  
 
  return (
    <>
      <div
        style={{
          background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
        }}
        className="min-h-screen"
      >
        <div className="p-3">
          <p className="text-3xl font-bold text-white mb-2 mt-3">Attendance List</p>

          <hr className="border-t border-white my-4" />

          {/* Attendance List */}
          <div className="px-2 mb-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white">Attendance</h2>
              <span className="text-white text-sm">
                Volunteer Hours
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
                          avatar || "https://placehold.co/600x400/png"
                        }
                        alt={attendee.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="text-gray-700 font-medium">
                      {attendee.name}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-[#2A7B62] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {attendee.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
             ) : (
              <p className="text-center text-white">
                No attendees available.
              </p>
            )}
          </div>
        </div>
        <Menu />
      </div>
    </>
  );
};

export default AdminAttendance;
