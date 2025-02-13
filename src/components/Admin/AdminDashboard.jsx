import React from "react";
import Menu from "../../Menu";
import { GrAnnounce } from "react-icons/gr";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import AdminSocialPost from "./AdminSocialPost";
import CreatePostModal from "./CreatePostModal";
import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import { FaEdit } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";

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

const AdminDashboard = () => {
  const purokno = sessionStorage.getItem("purokno");
  const [announcements, setAnnouncements] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("Announcement")
      .select("*")
      .eq("purokno", purokno)
      .order("created_at", { ascending: false });
    
    setAnnouncements(data || []);
  };

  const handleEdit = (announcement) => {
    setCurrentAnnouncement(announcement);
    setEditModal(true);
  };

  const handleSaveEdit = async () => {
    const { error } = await supabase
    .from('Announcement')
    .update({ date: currentAnnouncement.date,
              content : currentAnnouncement.content,
     })
    .eq('id', currentAnnouncement.id);

  if (error) {
    console.error("Error updating comment:", error);
    alert("Error updating comment");
  } else {
    window.location.reload();
  }
  };

  const confirmDelete = (id) => {
    setAnnouncementToDelete(id);
    setDeleteModal(true);
  };

  const handleDeleteAnnouncement = async () => {
    const { error } = await supabase
    .from('Announcement')
    .delete()
    .eq('id', announcementToDelete);

  if (error) {
    console.error("Error deleting announcement:", error);
    alert("Error deleting announcement");
  } else {
   window.location.reload();
  }
  };





  return (
    <div className="relative min-h-screen flex flex-col" 
  style={{ background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)" }}>
  
  <div className="p-3 flex-1 overflow-hidden">
    <p className="text-3xl font-bold text-white mb-2 mt-5">Dashboard</p>
    
    <div className="flex justify-between mt-4 mb-2">
      <p className="text-xl text-white flex gap-2">
        Announcement <GrAnnounce />
      </p>
      <button
        onClick={() => setShowModal(true)}
        className="bg-[#25596E] text-white rounded-full shadow-lg btn-sm"
      >
        + Create Post
      </button>
    </div>

    <section className="mt-4 ">
    {announcements.length > 0 ? (
      <Swiper spaceBetween={10} slidesPerView={1} loop autoplay={{ delay: 1500 }} 
        className="rounded-lg shadow-md">
        {announcements.map((announcement) => (
          <SwiperSlide key={announcement.id} 
            className="flex-shrink-0 w-80 p-4 bg-white rounded-lg shadow-md flex flex-col justify-between">
            <div className="flex gap-2">
              <DynamicCalendarIcon date={announcement.date} />
              <p className="text-sm mt-2">{announcement.content}</p>
            </div>
               {/* Buttons for Edit & Delete */}
               <div className="flex justify-end gap-3 mt-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="text-blue-500 text-xl"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => confirmDelete(announcement.id)}
                      className="text-red-500 text-xl"
                    >
                      <IoTrash />
                    </button>
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

    {/* Scrollable AdminSocialPost */}
    <div className="overflow-y-auto max-h-[500px] pb-20">
      <AdminSocialPost />
    </div>

    <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
  </div>

  {/* Fixed Bottom Menu */}
  <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
    <Menu />
  </div>

  {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3">Edit Announcement</h2>
            <input
              type="date"
              value={currentAnnouncement.date}
              onChange={(e) =>
                setCurrentAnnouncement({
                  ...currentAnnouncement,
                  date: e.target.value, // Update the date in state
                })
              }
              className="w-full p-2 border rounded"
            />
            <textarea
              value={currentAnnouncement.content}
              onChange={(e) =>
                setCurrentAnnouncement({
                  ...currentAnnouncement,
                  content: e.target.value,
                })
              }
              className="w-full p-2 border rounded resize-none h-24"
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3">Confirm Deletion</h2>
            <p>Are you sure you want to delete this announcement?</p>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick= {handleDeleteAnnouncement}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

</div>

  );
};

export default AdminDashboard;
