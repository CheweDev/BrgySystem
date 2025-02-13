import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import supabase from "../../supabaseClient";

const UserSocialPost = () => {
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const purokno = sessionStorage.getItem("purokno");
  const name = sessionStorage.getItem("name");
  const [posts, setPosts] = useState([]);
  const [isHeart, setIsHeart] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replies, setReplies] = useState({});
  const modalRef = useRef(null);

  const isAuthor = (authorName) => {
    return name === authorName;
  };
  
  const avatar = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("Social")
      .select("*")
      .eq("purokno", purokno)
      .order("created_at", { ascending: false });
    
    setPosts(data || []);
  };

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

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const post_id = sessionStorage.getItem("id");
    const { error } = await supabase
      .from('Comments')
      .insert([{
        name,
        comment: commentText,
        post_id,
        date: formattedDate,
        time: getCurrentTime(),
      }]);
  
    if (error) {
      console.error("Error posting comment:", error);
      alert("Error posting comment");
    } else {
      setCommentText("");
      fetchComments(post_id);
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

  const openComment = (post) => {
    sessionStorage.setItem("id", post.id);
    fetchComments(post.id);
    setIsCommentsOpen(true);
  };

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

  // Rest of your render code remains the same, but update the comments section to include edit/delete/reply functionality:
  return (
    <>
      {/* Posts rendering remains the same */}
      {posts.length === 0 ? (
        <p className="text-white text-center">No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="max-w-lg mx-auto bg-white rounded-xl shadow-sm mb-4">
            {/* Your existing post header and content code */}
            <div className="flex items-center gap-3 p-4">
              <img
                src={post.profile_image || avatar}
                alt="Profile"
                className="rounded-full w-10 h-10"
              />
              <div>
                <h2 className="font-medium">{post.name}</h2>
              </div>
              <span className="ml-auto text-sm text-white rounded-full p-1 bg-[#77cdb1] w-1/4 flex justify-center">
                Purok {post.purokno}
              </span>
            </div>

            <div className="px-4 pb-2">
              <p className="mb-3">{post.text}</p>
              <div className="grid grid-cols-3 gap-1 mb-4">
                {[post.image1, post.image2, post.image3]
                  .filter((img) => img)
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

            <div className="flex justify-end gap-4 px-4 pb-3">
              <button
                onClick={() => setIsHeart(!isHeart)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                {isHeart ? (
                  <FaHeart className="w-5 h-5 text-red-500" />
                ) : (
                  <FaRegHeart className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => openComment(post)}
                className="flex items-center gap-1 text-gray-600 text-sm hover:text-gray-900"
              >
                <FaRegComment className="w-5 h-5" />
                Comments
              </button>
            </div>
          </div>
        ))
      )}

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

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20"
          onClick={() => setPreviewImage(null)}
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
    </>
  );
};

export default UserSocialPost;