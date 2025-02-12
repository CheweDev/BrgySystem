import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";

const AdminSocialPost = () => {
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
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [currentPost, setCurrentPost] = useState({
    id: null,
    author: "",
    content: "",
    location: "",
    images: [], // <-- This will hold new images
  });
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState({});
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

  const handleSaveEdit = () => {
    setPosts((prev) =>
      prev.map((item) =>
        item.id === currentPost.id
          ? {
              ...item,
              content: currentPost.content,
              location: currentPost.location,
              images: currentPost.images,
            }
          : item
      )
    );
    setEditModal(false);
  };

  const handleEditReply = (reply) => {
    setEditingReplyId(reply.id);
    setEditReplyText(reply.content);
  };

  const handleSaveEditReply = (commentId, replyId) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: prevReplies[commentId].map((reply) =>
        reply.id === replyId ? { ...reply, content: editReplyText } : reply
      ),
    }));
    setEditingReplyId(null);
    setEditReplyText("");
  };

  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditReplyText("");
  };

  const handleDeleteReply = (commentId, replyId) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: prevReplies[commentId].filter(
        (reply) => reply.id !== replyId
      ),
    }));
  };

  const handleDeletePost = () => {
    setPosts((prev) => prev.filter((post) => post.id !== postToDelete));
    setDeleteModal(false);
  };

  // Handle starting the edit
  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.content);
  };

  // Handle saving the edit
  const handleSaveReplyEdit = (id) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, content: editText } : comment
      )
    );
    setEditingComment(null);
  };

  // Handle deleting a comment
  const handleDelete = (id) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
  };

  // Handle replying to a comment
  const handleReply = (id) => {
    setCommentToDelete(id);
  };

  // Handle saving a reply
  const handleSaveReply = (id) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(), // Unique ID for reply
      author: "You", // Later, replace this with the logged-in user's name
      content: replyText, // Reply text
      timestamp: new Date().toLocaleString(), // Current time
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp", // Replace with user's avatar later
    };

    setReplies((prevReplies) => ({
      ...prevReplies,
      [id]: [...(prevReplies[id] || []), newReply], // Add new reply to the comment
    }));

    setReplyText(""); // Clear input field
    setCommentToDelete(null); // Hide reply input field
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
                  <div
                    key={i}
                    className="aspect-square relative"
                    onClick={() => setPreviewImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Image ${i + 1}`}
                      className="object-cover w-full h-full rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 px-4 pb-3">
              <div className="flex gap-3">
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
                  Comments
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCurrentPost(post);
                    setEditModal(true);
                  }}
                  className="text-blue-500 text-xl"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setPostToDelete(post.id);
                    setDeleteModal(true);
                  }}
                  className="text-red-500 text-xl"
                >
                  <IoTrash />
                </button>
              </div>
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
                                onClick={() => handleDelete(comment.id)}
                                className="text-red-500"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => handleReply(comment.id)}
                                className="text-green-500"
                              >
                                Reply
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Show Replies */}
                        {replies[comment.id] &&
                          replies[comment.id].map((reply) => (
                            <div
                              key={reply.id}
                              className="ml-5 mt-2 flex gap-3 p-2 bg-white rounded-2xl"
                            >
                              <img
                                src={reply.avatar}
                                alt={`${reply.author}'s avatar`}
                                className="rounded-full w-8 h-8"
                              />

                              <div className="flex-1">
                                <h3 className="font-medium">{reply.author}</h3>

                                {editingReplyId === reply.id ? (
                                  <input
                                    type="text"
                                    value={editReplyText}
                                    onChange={(e) =>
                                      setEditReplyText(e.target.value)
                                    }
                                    className="w-full p-1 border rounded"
                                  />
                                ) : (
                                  <p className="text-sm">{reply.content}</p>
                                )}

                                <div className="flex justify-between mt-1 text-sm">
                                  <span className="text-xs text-gray-500">
                                    {reply.timestamp}
                                  </span>

                                  {editingReplyId === reply.id ? (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleSaveEditReply(
                                            comment.id,
                                            reply.id
                                          )
                                        }
                                        className="text-green-500"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={handleCancelEditReply}
                                        className="text-red-500"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleEditReply(reply)}
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

                        {/* Reply Input */}
                        {commentToDelete === comment.id ? (
                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              className="w-full p-1 border rounded"
                            />
                            <button
                              onClick={() => handleSaveReply(comment.id)}
                              className="bg-[#509c83] btn btn-sm text-white"
                            >
                              Reply
                            </button>
                          </div>
                        ) : null}
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
                  className="bg-[#77cdb1] text-white mb-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
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

      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3">Edit Post</h2>
            <textarea
              value={currentPost.content}
              onChange={(e) =>
                setCurrentPost({ ...currentPost, content: e.target.value })
              }
              className="w-full p-2 border rounded resize-none h-24"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files).map(
                  (file) => URL.createObjectURL(file) // Create preview URLs for selected images
                );
                setCurrentPost({ ...currentPost, images: files });
              }}
              className="w-full p-2 border rounded mb-2"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {currentPost.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Selected ${index}`}
                    className="w-full h-20 rounded object-cover"
                  />
                  <button
                    onClick={() =>
                      setCurrentPost({
                        ...currentPost,
                        images: currentPost.images.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
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
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSocialPost;
