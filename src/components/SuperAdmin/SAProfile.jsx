import { useState, useEffect} from "react";
import SAMenu from "./SAMenu";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { FaEdit } from "react-icons/fa";

const SAProfile = () => {
  const name = sessionStorage.getItem("name");
  const [gcashName, setGcashName] = useState("");
  const [gcashNumber, setGcashNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newGcashName, setNewGcashName] = useState("");
  const [newGcashNumber, setNewGcashNumber] = useState("");
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  );

  useEffect(() => {
    fetchGcash();
  }, []);

  const fetchGcash = async () => {
    const { data } = await supabase
      .from("Number")
      .select("*")
      .eq("id", "1")
    
    setGcashName(data[0].name || []);
    setGcashNumber(data[0].number || []);
  };

  const handleEdit = () => {
    setNewGcashName(gcashName);
    setNewGcashNumber(gcashNumber);
    setIsEditing(true);
  };

  const handleSave = async () => {
    await supabase.from("Number").update({ name: newGcashName, number: newGcashNumber }).eq("id", "1");
    setGcashName(newGcashName);
    setGcashNumber(newGcashNumber);
    setIsEditing(false);
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  }


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
              </label>
            </div>
          </div>

          <hr className="border-t my-5" />

          <div className="flex gap-2 mb-2">
            <img src="gcash.png" alt="" width={50} height={50} />
            <h3 className="text-xl mt-2 font-semibold text-primary">
              Gcash Number
            </h3>
          </div>
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-500 flex justify-between">
            <div>
              <p className="text-gray-600 font-bold">{gcashName}</p>
              <p className="text-gray-600">{gcashNumber}</p>
            </div>
            <button
              onClick={handleEdit}
              className="btn btn-primary text-white text-xl btn-outline"
            >
              <FaEdit />
            </button>
          </div>

          <hr className="border-t my-5" />

          <div className="mt-4">
            <div className="bg-error text-white font-bold text-center py-2 rounded-full"
            onClick={logout}>
              Logout
            </div>
          </div>
        </div>
      </div>

   

      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Edit Gcash Info</h3>
            <input type="text" value={newGcashName} onChange={(e) => setNewGcashName(e.target.value)} className="border p-2 w-full mt-2" />
            <input type="text" value={newGcashNumber} onChange={(e) => setNewGcashNumber(e.target.value)} className="border p-2 w-full mt-2" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded-lg">Cancel</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      <SAMenu />
    </div>
  );
};

export default SAProfile;
