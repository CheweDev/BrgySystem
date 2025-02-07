import React, { useState } from "react";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [postType, setPostType] = useState("social"); // Default: Social Post
  const [content, setContent] = useState("");
  const [socialPost, setSocialPost] = useState("");
  const [date, setDate] = useState(""); // Only for announcements

  const handleSubmit = () => {
    if (postType === "social") {
      console.log("Creating Social Media Post:", socialPost);
    } else {
      console.log("Creating Announcement:", { date, content });
    }
    onClose(); // Close modal after submission
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 p-3">
      <div className="bg-base-200 p-4 rounded-lg w-96 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-3xl size-8"
        >
          &times;
        </button>

        <div className="flex justify-start mb-3">
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="social">Social Post</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>

        {/* Conditional Fields */}
        {postType === "announcement" && (
          <>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />

            <textarea
              placeholder="Announcement description..."
              value={content}
              rows={5}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        {postType === "social" && (
          <>
            <textarea
              placeholder="Write your post..."
              value={socialPost}
              rows={7}
              onChange={(e) => setSocialPost(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <div className="space-y-2">
              <input type="file" />
              <input type="file" />
              <input type="file" />
            </div>
          </>
        )}

        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            className="px-10 py-2 bg-[#25596E] text-white rounded-full"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default CreatePostModal;
