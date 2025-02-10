import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";

const AdminSocialPost = () => {
  const [isHeart, setIsHeart] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [comments, setComments] = useState([
    // {
    //   id: 1,
    //   author: "Neneng",
    //   content: "Hoy tangina asa ni dapit?",
    //   timestamp: "06/06/21 8:00pm",
    //   avatar:
    //     "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    // },
    // ...Array(5)
    //   .fill(null)
    //   .map((_, i) => ({
    //     id: i + 2,
    //     author: `User ${i + 2}`,
    //     content: "Makit'an tika boss ibtan tikag ngipon! 👍",
    //     timestamp: "06/06/21 8:00pm",
    //     avatar:
    //       "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    //   })),
  ]);
  const [posts, setPosts] = useState([
    // {
    //   id: 1,
    //   author: "Marc Gerasmio",
    //   content: "Bossing?! Musta ang buhay buhay",
    //   location: "Purok 6",
    //   images: [
    //     "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    //     "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    //     "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    //   ],
    // },
  ]);
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
                Comments
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-white">No post available</p>
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
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {comment.timestamp}
                        </span>
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
    </>
  );
};

export default AdminSocialPost;
