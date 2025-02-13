import { useState, useEffect, useRef } from "react";
import { GrAnnounce } from "react-icons/gr";
import { FiFilter } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import SAMenu from "./SAMenu";
import supabase from "../../supabaseClient";

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
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replies, setReplies] = useState({});
  const avatar = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  const modalRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedPurok, setSelectedPurok] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null); // Store the ID of the selected post
  const [announcements, setAnnouncements] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const name = sessionStorage.getItem("name");
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const getCurrentTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    };

    const isAuthor = (authorName) => {
      return name === authorName;
    };

  useEffect(() => {
    fetchAnnouncements();
    fetchPosts();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("Announcement")
      .select("*")
      .order("created_at", { ascending: false });
    
    setAnnouncements(data || []);
  };

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("Social")
      .select("*")
      .order("created_at", { ascending: false });
    
    setSocialPosts(data || []);
  };



  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const post_id = sessionStorage.getItem("id");
    const { data, error } = await supabase
        .from('Comments')
        .insert([
          {
            name,
            comment : commentText,
            post_id,
            date: formattedDate,
            time : getCurrentTime(),
          },
        ])
        .select();
  
      if (error) {
        console.error("Error inserting data:", error);
        alert("Error inserting data");
      } else {
        console.log("Data inserted successfully:", data);
        window.location.reload();
      }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyText[commentId]?.trim()) return;

    const post_id = sessionStorage.getItem("id");
    const { error } = await supabase
      .from('Replies')
      .insert([{
        name,
        content: replyText[commentId],
        post_id,
        comment_id: commentId,
        date: formattedDate,
        time: getCurrentTime(),
      }]);

    if (error) {
      console.error("Error posting reply:", error);
      alert("Error posting reply");
    } else {
      setReplyText(prev => ({ ...prev, [commentId]: "" }));
      setReplyingTo(null);
      fetchComments(post_id);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase
      .from('Comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment");
    } else {
      const post_id = sessionStorage.getItem("id");
      fetchComments(post_id);
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment);
  };

  const handleSaveEdit = async (commentId) => {
    const { error } = await supabase
      .from('Comments')
      .update({ comment: editText })
      .eq('id', commentId);

    if (error) {
      console.error("Error updating comment:", error);
      alert("Error updating comment");
    } else {
      setEditingComment(null);
      const post_id = sessionStorage.getItem("id");
      fetchComments(post_id);
    }
  };

  const handleDeleteReply = async (replyId) => {
    const { error } = await supabase
      .from('Replies')
      .delete()
      .eq('id', replyId);

    if (error) {
      console.error("Error deleting reply:", error);
      alert("Error deleting reply");
    } else {
      const post_id = sessionStorage.getItem("id");
      fetchComments(post_id);
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
        announcement.purokno.toString() === selectedPurok) &&
      (announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.admin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSocialPosts = socialPosts.filter(
    (post) =>
      (selectedPurok === "all" || post.purokno.toString() === selectedPurok) &&
      (post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const fetchComments = async (id) => {
    const { data: commentsData } = await supabase
      .from("Comments")
      .select("*")
      .eq("post_id", id);
    
    const { data: repliesData } = await supabase
      .from("Replies")
      .select("*")
      .eq("post_id", id);

    setComments(commentsData || []);
    
    // Organize replies by comment_id
    const repliesByComment = {};
    (repliesData || []).forEach(reply => {
      if (!repliesByComment[reply.comment_id]) {
        repliesByComment[reply.comment_id] = [];
      }
      repliesByComment[reply.comment_id].push(reply);
    });
    setReplies(repliesByComment);
  };

  const openComment = (post) => {
    const id = sessionStorage.setItem("id", post.id)
    fetchComments(post.id)
    setIsCommentsOpen(true);
  }

  function formatDateTime(dateStr, timeStr) {
    let [year, month, day] = dateStr.split("-").map(Number);
    let [hour, minute, second] = timeStr.split(":").map(Number);
    let date = new Date(year, month - 1, day, hour, minute, second);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

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
          {filteredAnnouncements.length > 0 ? (
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
                      <p className="text-sm mb-2">{announcement.content}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Purok {announcement.purokno}</span>
                      </div>
                    </div>
                  </div>
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
          <div className="overflow-y-auto max-h-[500px] pb-20">
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
                  <h2 className="font-medium">{post.name}</h2>
                </div>
                <span className="ml-auto text-sm text-white rounded-full p-1 bg-[#77cdb1] w-1/4 flex justify-center">
                  Purok {post.purokno}
                </span>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-2">
                <p className="mb-3">{post.text}</p>

                <div className="grid grid-cols-3 gap-1 mb-4">
                  {[post.image1, post.image2, post.image3]
                    .filter((img) => img) // Remove null/undefined images
                    .map((img, index) => (
                      <div
                        key={index}
                        className="aspect-square relative"
                        onClick={() => setPreviewImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Image ${index + 1}`}
                          className="object-cover w-full h-full rounded cursor-pointer"
                        />
                      </div>
                    ))}
                </div>
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
               onClick={() => openComment(post)} // Call openComments with the post ID
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
            No post available.
          </p>
        )}
      </div>
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

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={avatar}
                        alt={`${comment.name}'s avatar`}
                        className="rounded-full w-8 h-8"
                      />
                      <div className="flex-1">
                        <div className="bg-white p-3 rounded-2xl">
                          <h3 className="font-medium">{comment.name}</h3>
                          {editingComment === comment.id ? (
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-1 border rounded mt-2"
                            />
                          ) : (
                            <p className="text-sm">{comment.comment}</p>
                          )}
                        </div>

                        
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className="text-xs text-gray-500">
                            {formatDateTime(comment.date, comment.time)}
                          </span>
                          <div className="flex gap-2">
                            {/* Only show edit/delete for comment author */}
                            {isAuthor(comment.name) && (
                              <>
                                {editingComment === comment.id ? (
                                  <>
                                    <button
                                      onClick={() => handleSaveEdit(comment.id)}
                                      className="text-green-600 text-sm"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingComment(null)}
                                      className="text-red-500 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEdit(comment)}
                                      className="text-blue-500 text-sm"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(comment.id)}
                                      className="text-red-500 text-sm"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                            {/* Always show reply button */}
                            <button
                              onClick={() => setReplyingTo(comment.id)}
                              className="text-green-600 text-sm"
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {replyingTo === comment.id && (
                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              value={replyText[comment.id] || ""}
                              onChange={(e) =>
                                setReplyText((prev) => ({
                                  ...prev,
                                  [comment.id]: e.target.value,
                                }))
                              }
                              className="flex-1 p-2 border rounded"
                              placeholder="Write a reply..."
                            />
                            <button
                              onClick={() => handleReplySubmit(comment.id)}
                              className="bg-[#509c83] text-white px-3 rounded"
                            >
                              Reply
                            </button>
                          </div>
                        )}

                    {replies[comment.id]?.length > 0 && (
                          <div className="mt-3 pl-6 space-y-3">
                            {replies[comment.id].map((reply) => (
                              <div key={reply.id} className="flex gap-2">
                                <img
                                  src={avatar}
                                  alt="Reply Avatar"
                                  className="w-6 h-6 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="bg-white p-2 rounded-lg">
                                    <h4 className="text-sm font-medium">{reply.name}</h4>
                                    <p className="text-xs">{reply.content}</p>
                                    <div className="flex justify-between items-center mt-1 text-xs">
                                      <span className="text-gray-500">
                                        {formatDateTime(reply.date, reply.time)}
                                      </span>
                                      {/* Only show delete button for reply author */}
                                      {isAuthor(reply.name) && (
                                        <button
                                          onClick={() => handleDeleteReply(reply.id)}
                                          className="text-red-500"
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Comment Input */}
            <form onSubmit={handleSubmitComment} className="p-3 border-t mt-auto">
              <div className="flex gap-2">
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full min-h-[40px] p-1 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#77cdb1] text-white mb-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
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
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
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
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"].map((purok) => (
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

      <div className="relative z-10">
        <SAMenu />
      </div>
    </div>
  );
}
