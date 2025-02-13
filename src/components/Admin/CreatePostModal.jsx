import React, { useState } from "react";
import supabase from "../../supabaseClient";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [postType, setPostType] = useState("social"); // Default: Social Post
  const [content, setContent] = useState("");
  const [socialPost, setSocialPost] = useState("");
  const [date, setDate] = useState(""); // Only for announcements
  
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [files, setFiles] = useState({ image1: null, image2: null, image3: null });
  const purokno = sessionStorage.getItem("purokno");
  const name = sessionStorage.getItem("name");
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      const filePath = `${file.name}`;
      const { data, error } = await supabase.storage
        .from("Images")
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicURL, error: urlError } = supabase.storage
        .from("Images")
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      return publicURL.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image: " + error.message);
      return null;
    }
  };

  const handleSubmit = async () => {
    let uploadedImages = { image1: "", image2: "", image3: "" };
  
    // Upload images
    uploadedImages.image1 = await uploadImage(files.image1);
    uploadedImages.image2 = await uploadImage(files.image2);
    uploadedImages.image3 = await uploadImage(files.image3);
  

    setImage1(uploadedImages.image1);
    setImage2(uploadedImages.image2);
    setImage3(uploadedImages.image3);
  
    if (postType === "social") {
      const { data, error } = await supabase
        .from('Social')
        .insert([
          {
            name,
            text: socialPost,
            purokno,
            image1: uploadedImages.image1,
            image2: uploadedImages.image2,
            image3: uploadedImages.image3,
            date: formattedDate,
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
    } else {
      const { data, error } = await supabase
        .from('Announcement')
        .insert([
          {
            content,
            purokno,
            date,
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
    }
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
              <input type="file" onChange={(e) => setFiles({ ...files, image1: e.target.files[0] })} />
              <input type="file" onChange={(e) => setFiles({ ...files, image2: e.target.files[0] })} />
              <input type="file" onChange={(e) => setFiles({ ...files, image3: e.target.files[0] })} />
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
