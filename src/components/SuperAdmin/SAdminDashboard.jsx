import { useState, useEffect, useRef } from "react";
import { GrAnnounce } from "react-icons/gr";
import { FiFilter } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import SAMenu from "./SAMenu";

const DynamicCalendarIcon = ({ date }) => {
  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.toLocaleString("default", { month: "short" });

  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-lg shadow-md">
      <span className="text-sm font-semibold uppercase">{month}</span>
      <span className="text-2xl font-bold">{day}</span>
    </div>
  );
};

export default function SuperAdminDashboard() {
  const modalRef = useRef(null); // Initialize the modalRef
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedPurok, setSelectedPurok] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Neneng",
      content: "Hoy tangina asa ni dapit?",
      timestamp: "06/06/21 8:00pm",
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    ...Array(5)
      .fill(null)
      .map((_, i) => ({
        id: i + 2,
        author: `User ${i + 2}`,
        content: "Makit'an tika boss ibtan tikag ngipon! 👍",
        timestamp: "06/06/21 8:00pm",
        avatar:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      })),
  ]);
  const [selectedPostId, setSelectedPostId] = useState(null); // Store the ID of the selected post

  const announcements = [
    {
      id: 1,
      date: "2025-01-12",
      text: "Meeting rescheduled to January 12th, 2025.",
      purok: "6",
      admin: "Admin 1",
    },
    {
      id: 2,
      date: "2025-01-15",
      text: "Submit reports before deadline.",
      purok: "7",
      admin: "Admin 2",
    },
    {
      id: 3,
      date: "2025-01-16",
      text: "Community cleanup drive.",
      purok: "6",
      admin: "Admin 3",
    },
  ];

  const socialPosts = [
    {
      id: 1,
      admin: "Marc Gerasmio",
      purok: "6",
      content: "Bossing?! Musta ang buhay buhay",
      date: "2025-02-05",
      comments: 10,
      images: [
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      ],
    },
    {
      id: 2,
      admin: "Juan Dela Cruz",
      purok: "7",
      content: "Salamat sa tanan ni-ambit sa atong clean-up drive!",
      date: "2025-02-06",
      comments: 15,
      images: [
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      ],
    },
    {
      id: 3,
      admin: "Maria Santos",
      purok: "3",
      content: "Nag-abot na ang relief goods, palihug kuha sa Brgy. Hall.",
      date: "2025-02-07",
      comments: 12,
      images: [],
    },
  ];

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "You",
        content: commentText,
        timestamp: new Date().toLocaleString(),
        avatar:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      };
      setComments([...comments, newComment]);
      setCommentText("");
    }
  };

  const openComments = (postId) => {
    setSelectedPostId(postId); // Set the post ID for the selected post
    setIsCommentsOpen(true); // Open the comments modal
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsCommentsOpen(false);
      }
    };

    if (isCommentsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCommentsOpen]);

  useEffect(() => {
    if (isCommentsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCommentsOpen]);

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      (selectedPurok === "all" ||
        announcement.purok.toString() === selectedPurok) &&
      (announcement.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.admin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSocialPosts = socialPosts.filter(
    (post) =>
      (selectedPurok === "all" || post.purok.toString() === selectedPurok) &&
      (post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.admin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#89C6A7] to-[#25596E]">
      <div className="p-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 mt-3">
          <h1 className="text-2xl font-bold text-white">SuperAdmin</h1>
          <button
            onClick={() => setShowFilterModal(true)}
            className="bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <FiFilter />
            {selectedPurok === "all" ? "All Purok" : `Purok ${selectedPurok}`}
          </button>
        </div>

        {/* Announcements Section */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white flex items-center gap-2">
              <GrAnnounce className="text-white" /> Announcements
            </h2>
            <span className="text-white text-sm">
              {filteredAnnouncements.length} posts
            </span>
          </div>

          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            loop
            autoplay={{ delay: 1500 }}
            className="rounded-lg"
          >
            {filteredAnnouncements.map((announcement) => (
              <SwiperSlide key={announcement.id}>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex gap-4">
                    <DynamicCalendarIcon date={announcement.date} />
                    <div className="flex-1">
                      <p className="text-sm mb-2">{announcement.text}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Admin: {announcement.admin}</span>
                        <span>Purok {announcement.purok}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <hr className="border-t border-white my-4" />

        {/* Social Posts Section */}
        {filteredSocialPosts.length > 0 ? (
          filteredSocialPosts.map((post) => (
            <div
              key={post.id}
              className="max-w-lg mx-auto bg-white rounded-xl shadow-sm mb-4"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 p-4">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Profile picture"
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <h2 className="font-medium">{post.admin}</h2>
                </div>
                <span className="ml-auto text-sm text-white rounded-full p-1 bg-[#77cdb1] w-1/4 flex justify-center">
                  Purok {post.purok}
                </span>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-2">
                <p className="mb-3">{post.content}</p>

                {/* Image Grid (if images exist) */}
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 mb-4">
                    {post.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square relative"
                        onClick={() => setPreviewImage(image)}
                      >
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="object-cover w-full h-full rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {previewImage && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20"
                  onClick={() => setPreviewImage(null)} // Close on background click
                >
                  <div className="relative">
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 text-white text-2xl"
                    >
                      <IoClose />
                    </button>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-screen rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Comment Button */}
              <div className="flex justify-end items-center px-4 pb-3 text-gray-600 text-sm">
                <button
                  onClick={() => openComments(post.id)} // Call openComments with the post ID
                  className="flex items-center gap-1 text-gray-600 text-sm hover:text-gray-900"
                >
                  <FaRegComment className="w-5 h-5" />
                  <span>{post.comments} Comments</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center">
            No posts available for this Purok.
          </p>
        )}
      </div>

      {/* Comments Modal */}
      {isCommentsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
          <div
            ref={modalRef}
            className="bg-base-200 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col"
          >
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Comments</h2>
                <button
                  onClick={() => setIsCommentsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Comments Section (Updated Responsive Design) */}
            <div className="flex flex-col gap-3 p-4 max-h-[60vh] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={comment.avatar || "/placeholder.svg"}
                    alt={`${comment.author}'s avatar`}
                    className="rounded-full w-10 h-10"
                  />
                  <div className="flex-1">
                    <div className="bg-white p-3 rounded-2xl shadow-md">
                      <h3 className="font-medium">{comment.author}</h3>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {comment.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <form
              onSubmit={handleSubmitComment}
              className="p-4 border-t mt-auto bg-white shadow-md"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full min-h-[40px] p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#77cdb1] text-white mt-2 sm:mt-0 sm:w-[100px] px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purok Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-2xl w-full max-w-md p-4">
            <h3 className="text-lg font-medium mb-4">Filter by Purok</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => {
                  setSelectedPurok("all");
                  setShowFilterModal(false);
                }}
                className={`p-2 rounded-lg border ${
                  selectedPurok === "all" ? "bg-blue-500 text-white" : ""
                }`}
              >
                All
              </button>
              {["6", "7", "8", "3"].map((purok) => (
                <button
                  key={purok}
                  onClick={() => {
                    setSelectedPurok(purok);
                    setShowFilterModal(false);
                  }}
                  className={`p-2 rounded-lg border ${
                    selectedPurok === purok ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  Purok {purok}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <SAMenu />
    </div>
  );
}
