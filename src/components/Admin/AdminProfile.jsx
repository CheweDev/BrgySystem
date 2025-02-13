import { useState, useEffect} from "react";
import Menu from "../../Menu";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";

const AdminProfile = () => {
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

  const [docs, setDocs] = useState([]);
  const name = sessionStorage.getItem("name");
  const purokno = sessionStorage.getItem("purokno");
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  }

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const { data } = await supabase
      .from("Requests")
      .select("*")
      .eq("name", name);
    
    setDocs(data || []);
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
              <h2 className="text-lg font-semibold">{name}</h2>
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
              Purok {purokno}
            </div>
          </div>

          <hr className="border-t my-4" />

          <button className="w-full rounded-full bg-error text-white font-bold py-2"
          onClick={logout}>
            Logout
          </button>
        </div>
      </div>
  {/* Waitlisted Requests */}
    <div
      className="rounded-tl-[40px] rounded-tr-[40px] p-4 mt-5"
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
    >
      <h3 className="text-white mb-4 font-bold mt-2">Waitlisted Requests:</h3>
      <div className="space-y-3 mb-20">
        {docs.length > 0 ? (
          docs.map((doc, index) => {
            const submissionDate = new Date(doc.created_at); 
            const day = submissionDate.getDate();
            const month = submissionDate.toLocaleString("default", { month: "short" });

            return (
              <div key={index} className="bg-white rounded-2xl p-4 flex items-center">
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
                      : doc.status === "Accepted"
                      ? "bg-[#23ab80]"
                      : "bg-error"
                  }`}
                >
                  {doc.status}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-white text-center">No waitlisted requests found.</p>
        )}
      </div>
    </div>

      <Menu />
    </div>
  );
};

export default AdminProfile;
