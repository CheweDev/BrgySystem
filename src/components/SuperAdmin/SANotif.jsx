import SAMenu from "./SAMenu";
import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";

const SANotif = () => {
  const name = sessionStorage.getItem("name");
  const purokno = sessionStorage.getItem("purokno");
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const [docsResponse] = await Promise.all([
      supabase.from("Requests").select("*").eq("status", "Pending"),
    ]);

    const docs = docsResponse.data || [];

    const formattedDocs = docs.map((item) => ({
      id: item.id,
      type: "request",
      created_at: item.created_at,
      content: `${item.name} has requested document : ${item.document_type}`,
      isNew: item.isNew || false,
    }));


    const allNotifications = [...formattedDocs].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setNotifications(allNotifications);
  };

  const filteredNotifications = notifications.filter(
    (notif) =>
      notif.content.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
      className="min-h-screen flex flex-col"
    >
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-3xl font-bold text-white mb-2 mt-5">Notification</p>
        <label className="input input-bordered flex items-center gap-2 mb-3">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        {/* Scrollable Notifications List */}
        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-md flex-1 overflow-y-auto max-h-[80vh]">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div key={item.id} className="p-4 border-b border-white/40 flex items-start">
              {item.isNew && <span className="text-red-500 text-lg mr-2">🔴</span>}
              <div>
                <h3 className="text-white font-semibold">
                  {item.type === "announcement"
                    ? "Announcement!"
                    : item.type === "social"
                    ? "Social Post"
                    : "Request Update"}
                </h3>
                <p className="text-white">{item.content}</p>
                <p className="text-white/80 text-sm">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center p-4">No notifications yet.</p>
        )}
        </div>
      </div>

      {/* Fixed Menu at Bottom */}
      <div className="sticky bottom-0 w-full">
        <SAMenu />
      </div>
    </div>
  );
};

export default SANotif;
