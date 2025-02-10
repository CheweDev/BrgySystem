import { useState } from "react";
import Menu from "../../Menu";

const AdminNotification = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const notifications = [
    {
      id: 1,
      title: "Barangay Clearance",
      message: "submitted 02/30/21",
      isNew: true,
    },
    {
      id: 2,
      title: "Cleaning",
      message: "date 02/30/21",
      isNew: false,
    },
    {
      id: 3,
      title: "Announcement",
      message: "date 02/30/21",
      isNew: false,
    },
  ];

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
      className="min-h-screen"
    >
      <div className="p-3">
        <p className="text-3xl font-bold text-white mb-2 mt-5">Notification</p>

        {/* Search Input */}
        <label className="input input-bordered flex items-center gap-2 mb-3">
          <input
            type="text"
            className="grow"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>

        {/* Notifications List */}
        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-md">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className="p-4 border-b border-white/40 flex items-start"
              >
                {item.isNew && (
                  <span className="text-red-500 text-lg mr-2">🔴</span>
                )}
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300 py-4">
              No notifications found
            </p>
          )}
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default AdminNotification;
