import { useState, useEffect } from "react";
import Menu from "../../Menu";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { ImExit } from "react-icons/im";

const UserProfile = () => {
  const [profileImage, setProfileImage] = useState(
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  );

  const [docs, setDocs] = useState([]);
  const name = sessionStorage.getItem("name");
  const purokno = sessionStorage.getItem("purokno");
  const navigate = useNavigate();
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchHours();
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const { data } = await supabase
      .from("Requests")
      .select("*")
      .eq("name", name);

    setDocs(data || []);
  };

  const fetchHours = async () => {
    const { data, error } = await supabase
      .from("Attendance")
      .select("total")
      .eq("name", name);

    if (error) {
      console.error("Error fetching hours:", error);
      return;
    }

    // Parse hours and minutes separately
    let totalMinutes = data.reduce((acc, entry) => {
      const [hours, minutes] = entry.total.split(".");
      return acc + parseInt(hours) * 60 + parseInt(minutes);
    }, 0);

    // Convert total minutes to hours and minutes
    let finalHours = Math.floor(totalMinutes / 60);
    let finalMinutes = Math.round(totalMinutes % 60);

    // If minutes reach 60, adjust hours
    if (finalMinutes === 60) {
      finalHours += 1;
      finalMinutes = 0;
    }

    setHours(finalHours);
    setMinutes(finalMinutes);

    console.log(`Total Hours Rendered: ${finalHours}.${finalMinutes}m`);
  };

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

  const routes = {
    "baranggay clearance": "/brgy",
    "certificate of low income": "/low",
    "death certificate": "/death",
    "certificate of indigency": "/indigent",
    "oness certificate": "/oness",
    "certificate of onees": "/oness",
    "senior citizen": "/senior",
    "certificate for senior": "/senior",
    "certificate of residency": "/residency",
    "oath of undertaking": "/Oath",
    "first time job seeker certificate": "/jobseeker",
  };

  const handleRedirect = (type) => {
    const path = routes[type.toLowerCase().trim()];
    if (path) {
      navigate(path);
    } else {
      console.warn("No matching route for document type:", type);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
      className="min-h-screen"
    >
      <div className="px-2 pt-3">
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{name}</h2>

              <div className="text-gray-600">Purok:{purokno}</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Resident</span>
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  verified
                </span>
              </div>
            </div>
            <div className="relative w-16 h-16">
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

          <hr className="border-t my-4" />

          <button
            className="w-full flex justify-center gap-1 rounded-full bg-error text-base-200 font-bold py-2"
            onClick={logout}
          >
            <ImExit className="mt-1" />
            SignOut
          </button>
        </div>
      </div>

      {/* Volunteer Hours */}
      <div className="px-2 mt-4">
        <div className="bg-[#25596E] rounded-2xl p-4 text-white flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#2A7B62] text-1xl font-bold">
              {hours}.{minutes}
            </span>
          </div>
          <div className="text-lg">volunteer hours +</div>
        </div>
      </div>

      {/* Waitlisted Requests */}
      <div
        className="rounded-tl-[40px] rounded-tr-[40px] p-3 mt-5"
        style={{
          background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
        }}
      >
        <div className="space-y-3 pb-14 mt-3">
          {docs.length > 0 ? (
            docs.map((doc, index) => {
              const submissionDate = new Date(doc.created_at);
              const day = submissionDate.getDate();
              const month = submissionDate.toLocaleString("default", {
                month: "short",
              });

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 flex items-center"
                >
                  <div className="text-center mr-4">
                    <div className="text-2xl font-bold">{day}</div>
                    <div className="text-sm text-gray-500">{month}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{doc.document_type}</h4>
                    <p className="text-sm text-gray-500">
                      submitted {submissionDate.toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className={`text-white text-sm px-3 py-1 rounded-full ${
                      doc.status === "Pending"
                        ? "bg-warning"
                        : doc.status === "Approved"
                        ? "bg-info"
                        : "bg-error"
                    }`}
                    onClick={() => {
                      if (doc.status === "Approved") {
                        handleRedirect(doc.document_type);
                      }
                    }}
                  >
                    {doc.status === "Approved" ? "Download" : doc.status}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-white text-center">
              No waitlisted requests found.
            </p>
          )}
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default UserProfile;
