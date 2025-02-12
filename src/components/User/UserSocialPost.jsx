import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";

const UserSocialPost = () => {
  const [isHeart, setIsHeart] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
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
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Marc Gerasmio",
      content: "Bossing?! Musta ang buhay buhay",
      location: "Purok 6",
      images: [
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      ],
    },
  ]);
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [editingReply, setEditingReply] = useState({
    commentId: null,
    replyId: null,
  });
  const [editReplyText, setEditReplyText] = useState("");

  const modalRef = useRef(null);

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

  const handleReplySubmit = (commentId) => {
    if (!replyText[commentId]?.trim()) return;

    const newReply = {
      id: Date.now(),
      author: "You",
      content: replyText[commentId],
      timestamp: new Date().toLocaleString(),
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    };

    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: [...(prevReplies[commentId] || []), newReply],
    }));

    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    setReplyingTo(null);
  };

  const handleEditComment = (commentId, content) => {
    setEditingComment(commentId);
    setEditText(content);
  };

  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.content);
  };

  const handleSaveReplyEdit = (id) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, content: editText } : comment
      )
    );
    setEditingComment(null); // Exit edit mode
  };

  const handleUpdateReply = () => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [editingReply.commentId]: prevReplies[editingReply.commentId].map(
        (reply) =>
          reply.id === editingReply.replyId
            ? { ...reply, content: editReplyText }
            : reply
      ),
    }));
    setEditingReply({ commentId: null, replyId: null });
    setEditReplyText("");
  };

  const handleUpdateComment = (commentId) => {
    const updatedComments = post.comments.map((c) =>
      c.id === commentId ? { ...c, content: editText } : c
    );
    setPost({ ...post, comments: updatedComments });
    setEditingComment(null);
  };

  const handleDeleteComment = (id) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
  };

  const handleDeleteReply = (commentId, replyId) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: prevReplies[commentId].filter(
        (reply) => reply.id !== replyId
      ),
    }));
  };

  return (
    <>
      {posts.length > 0 ? (
        posts.map((post) => (
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
                <h2 className="font-medium">{post.author}</h2>
              </div>
              <span className="ml-auto text-sm text-white rounded-full p-1 bg-[#77cdb1] w-1/4 flex justify-center">
                {post.location}
              </span>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-2">
              <p className="mb-3">{post.content}</p>

              {/* Image Grid */}
              <div className="grid grid-cols-3 gap-1 mb-4">
                {post.images.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt="Post"
                    className="w-full h-28 object-cover rounded cursor-pointer"
                    onClick={() => setPreviewImage(image)}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
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
                onClick={() => setIsCommentsOpen(true)}
                className="flex items-center gap-1 text-gray-600 text-sm hover:text-gray-900"
              >
                <FaRegComment className="w-5 h-5" />
                <span className="text-sm">Comment</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-white">No post available</p>
      )}

      {/* Comments Modal */}
      {isCommentsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-10">
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

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.avatar || "/placeholder.svg"}
                        alt={`${comment.author}'s avatar`}
                        className="rounded-full w-8 h-8"
                      />
                      <div className="flex-1">
                        <div className="bg-white p-3 rounded-2xl">
                          <h3 className="font-medium">{comment.author}</h3>

                          {editingComment === comment.id ? (
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-1 border rounded"
                            />
                          ) : (
                            <p className="text-sm">{comment.content}</p>
                          )}
                        </div>

                        {/* Edit, Delete, and Reply Buttons */}
                        <div className="flex gap-2 mt-2 text-sm justify-between">
                          <span className="text-xs text-gray-500">
                            {comment.timestamp}
                          </span>
                          {editingComment === comment.id ? (
                            <div className="gap-3 flex">
                              <button
                                onClick={() => handleSaveReplyEdit(comment.id)}
                                className="text-green-800"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingComment(null)}
                                className="text-red-500"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(comment)}
                                className="text-blue-500"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-500"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setReplyingTo(comment.id)}
                                className="text-green-500"
                              >
                                Reply
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Reply Input Field */}
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
                              className="w-full p-1 border rounded"
                              placeholder="Write a reply..."
                            />
                            <button
                              onClick={() => handleReplySubmit(comment.id)}
                              className="bg-[#509c83] btn-sm btn text-white"
                            >
                              Reply
                            </button>
                          </div>
                        )}

                        {/* Display Replies */}
                        {replies[comment.id] &&
                          replies[comment.id].length > 0 && (
                            <div className="mt-3 pl-6 border-l">
                              {replies[comment.id].map((reply) => (
                                <div key={reply.id} className="flex gap-2">
                                  <img
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    alt="Reply Avatar"
                                    className="rounded-full w-8 h-8"
                                  />
                                  <div className="bg-white p-2 rounded-lg flex-1">
                                    <h4 className="text-sm font-medium">
                                      {reply.author}
                                    </h4>
                                    {editingReply.commentId === comment.id &&
                                    editingReply.replyId === reply.id ? (
                                      <input
                                        type="text"
                                        value={editReplyText}
                                        onChange={(e) =>
                                          setEditReplyText(e.target.value)
                                        }
                                        className="w-full p-1 border rounded"
                                      />
                                    ) : (
                                      <p className="text-xs">{reply.content}</p>
                                    )}

                                    {/* Edit & Delete Reply Buttons */}
                                    <div className="flex gap-2 text-sm justify-between mt-1">
                                      <span className="text-xs text-gray-500">
                                        {reply.timestamp}
                                      </span>
                                      {editingReply.commentId === comment.id &&
                                      editingReply.replyId === reply.id ? (
                                        <div className="gap-3 flex">
                                          <button
                                            onClick={handleUpdateReply}
                                            className="text-green-800"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={() =>
                                              setEditingReply({
                                                commentId: null,
                                                replyId: null,
                                              })
                                            }
                                            className="text-red-500"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex justify-end gap-2">
                                          <button
                                            onClick={() =>
                                              setEditingReply({
                                                commentId: comment.id,
                                                replyId: reply.id,
                                              })
                                            }
                                            className="text-blue-500"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteReply(
                                                comment.id,
                                                reply.id
                                              )
                                            }
                                            className="text-red-500"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No comments yet</p>
                )}
              </div>
            </div>

            {/* Comment Input */}
            <form
              onSubmit={handleSubmitComment}
              className="p-3 border-t mt-auto"
            >
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
                  className="bg-[#509c83] text-white mb-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </>
  );
};

export default UserSocialPost;
