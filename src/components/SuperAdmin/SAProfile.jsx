import { useState } from "react";
import SAMenu from "./SAMenu";

const SAProfile = () => {
  const [profileImage, setProfileImage] = useState(
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
      className="min-h-screen"
    >
      {/* Profile Card */}
      <div className="px-2 pt-5">
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Mang Kanor</h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Super Admin</span>
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  verified
                </span>
              </div>
            </div>
            <div className="relative w-16 h-16">
              {/* Image Input and Preview */}
              <label className="cursor-pointer">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-full object-cover w-full h-full"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0"
                />
              </label>
            </div>
          </div>

          <hr className="border-t my-5" />

          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <ul className="mt-2 text-gray-600">
              <li>Email: mangkanor@example.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Website: www.mangkanor.com</li>
            </ul>
          </div>

          <hr className="border-t my-5" />

          <div className="mt-4">
            <div className="bg-error text-white font-bold text-center py-2 rounded-full">
              Logout
            </div>
          </div>
        </div>
      </div>

      {/* <div className="px-2">
        <div className="bg-white rounded-lg p-4 shadow-sm mt-5">
          <h3 className="text-lg font-semibold">About Mang Kanor</h3>
          <p className="text-gray-600 mt-2">
            Mang Kanor is a passionate individual committed to serving the
            community. With years of experience in local governance, he works
            hard to ensure the welfare of his fellow citizens. He believes in
            transparency and is dedicated to making the local environment a
            better place.
          </p>
        </div>
      </div> */}

      <SAMenu />
    </div>
  );
};

export default SAProfile;
