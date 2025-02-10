import { useState } from "react";
import Menu from "../../Menu";

const AdminProfile = () => {
  const [profileImage, setProfileImage] = useState(
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  );

  const waitlistedRequests = [
    // {
    //   id: 1,
    //   date: { day: 23, month: "Jan" },
    //   title: "Barangay Clearance",
    //   submitted: "02/30/21",
    //   status: "Pending",
    //   statusColor: "bg-warning",
    // },
    // {
    //   id: 2,
    //   date: { day: 23, month: "Jan" },
    //   title: "Barangay Clearance",
    //   submitted: "02/30/21",
    //   status: "Accepted",
    //   statusColor: "bg-[#23ab80]",
    // },
    // {
    //   id: 3,
    //   date: { day: 23, month: "Jan" },
    //   title: "Barangay Clearance",
    //   submitted: "02/30/21",
    //   status: "Rejected",
    //   statusColor: "bg-error",
    // },
    // {
    //   id: 4,
    //   date: { day: 29, month: "Aug" },
    //   title: "Attendance",
    //   submitted: "03/18/21",
    //   status: "Accepted",
    //   statusColor: "bg-[#23ab80]",
    // },
  ];

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
                <span className="text-gray-600">Admin</span>
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

          <div className="mt-4 border-t pt-4">
            <div className="text-gray-600">Admin Address</div>
          </div>

          <div className="mt-4">
            <div className="bg-[#E8F5F1] text-center py-2 rounded-full">
              Purok 8, Brgy. Lumbocan
            </div>
          </div>

          <hr className="border-t my-4" />

          <button className="w-full rounded-full bg-error text-white font-bold py-2">
            Logout
          </button>
        </div>
      </div>

      {/* Volunteer Hours */}
      <div className="px-2 mt-4">
        <div className="bg-[#25596E] rounded-2xl p-4 text-white flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#2A7B62] text-2xl font-bold">34</span>
          </div>
          <div className="text-lg">volunteer hours +</div>
        </div>
      </div>

      {/* Waitlisted Requests */}
      <div
        className="rounded-tl-[40px] rounded-tr-[40px] p-4 mt-5 min-h-screen"
        style={{
          background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
        }}
      >
        <h3 className="text-white mb-4 font-bold mt-2">Waitlisted Requests:</h3>

        {waitlistedRequests.length > 0 ? (
          <div className="space-y-3 mb-20">
            {waitlistedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl p-4 flex items-center"
              >
                <div className="text-center mr-4">
                  <div className="text-2xl font-bold">{request.date.day}</div>
                  <div className="text-sm text-gray-500">
                    {request.date.month}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{request.title}</h4>
                  <p className="text-sm text-gray-500">
                    submitted {request.submitted}
                  </p>
                </div>
                <button
                  className={`${request.statusColor} text-white text-sm px-3 py-1 rounded-full`}
                >
                  {request.status}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300">
            No waitlisted requests available
          </p>
        )}
      </div>

      <Menu />
    </div>
  );
};

export default AdminProfile;
