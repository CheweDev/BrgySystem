import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import SAMenu from "./SAMenu";
import supabase from "../../supabaseClient";

const SAProcess = () => {
  const avatar = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("Requests")
      .select("*")
      .eq("status", 'Pending');
    
    setRequests(data || []);
  };




  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const updateStatus = async (newStatus) => {
    if (selectedRequest) {
      // Update in Supabase
      const { error } = await supabase
        .from("Requests") // Replace with your actual table name
        .update({ status: newStatus })
        .eq("id", selectedRequest.id);
  
      if (error) {
        console.error("Error updating status:", error);
        return;
      }
  
      // Update local state if Supabase update is successful
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === selectedRequest.id
            ? { ...request, status: newStatus }
            : request
        )
      );
  
      window.location.reload();
    }
  };
  
  const filteredRequests = requests.filter(
    (request) =>
      request.name.toLowerCase().includes(search.toLowerCase()) ||
      request.document_type.toLowerCase().includes(search.toLowerCase()) ||
      request.status.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
      className="min-h-screen"
    >
     <header className="p-4 space-y-3">
        <p className="text-3xl font-bold text-white mb-2 mt-5">Requests</p>
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search name, requests, status.."
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
        <hr className="border-t border-white" />
      </header>

      {/* Request List */}
      <div className="p-4 space-y-3">
      {filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => openModal(request)}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img
                src={avatar || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">{request.name}</p>
              <p className="font-medium text-gray-800">{request.document_type}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                request.status === "Ongoing"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {request.status}
            </span>
          </div>
        ))
      ) : (
        <p className="text-white text-center p-4">No requests found.</p>
      )}
      </div>

     {/* Modal */}
     {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-4 w-full relative shadow-2xl scale-95">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-800 transition-colors"
            >
              <IoClose />
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {selectedRequest.document_type}
            </h2>
            <div
              className="relative group w-full h-64"
              onClick={() => setIsOpen(true)}
            >
              {/* Image */}
              <img
                src={
                  selectedRequest.image ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt="Proof of Payment"
                className="w-full h-full object-cover rounded-lg cursor-pointer"
              />

              {/* Clickable Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-50 pointer-events-none">
                <span className="text-white text-lg font-semibold group-hover:opacity-80 opacity-100 transition-opacity duration-300">
                  Click image to view
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2 w-full max-w-xs border border-gray-300 p-2 rounded-md bg-gray-100">
                Name:
                <input
                  type="text"
                  placeholder={selectedRequest.name}
                  className="w-full p-1 bg-transparent text-black outline-none cursor-not-allowed"
                  disabled
                />
              </label>

              <label className="flex items-center gap-2 w-full max-w-xs border border-gray-300 p-2 rounded-md bg-gray-100">
                Purok:
                <input
                  type="text"
                  placeholder={selectedRequest.purokno}
                  className="w-full p-1 bg-transparent text-black outline-none cursor-not-allowed"
                  disabled
                />
              </label>

                  
              <label className="flex items-center gap-2 w-full max-w-xs border border-gray-300 p-2 rounded-md bg-gray-100">
                Purpose:
                <input
                  type="text"
                  placeholder={selectedRequest.reason}
                  className="w-full p-1 bg-transparent text-black outline-none cursor-not-allowed"
                  disabled
                />
              </label>
              <label className="flex items-center gap-2 w-full max-w-xs  p-2 rounded-md">
              Additional Details:
              </label>
              <textarea
                placeholder={selectedRequest.description}
                className="w-full max-w-xs p-2 border border-gray-300 rounded-md bg-gray-100 text-black cursor-not-allowed"
                disabled
              ></textarea>

              <div className="flex flex-col sm:flex-row mt-5 gap-2 sm:justify-between">
                <button
                  onClick={() => updateStatus("Approved")}
                  className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-green-600 transition-colors shadow-md focus:outline-none"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus("Rejected")}
                  className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md focus:outline-none"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal (only visible when isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-md w-full">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-3xl text-black hover:text-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <IoClose />
            </button>

            {/* Enlarged Image */}
            <img
              src={
                selectedRequest.image ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="Enlarged Proof of Payment"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
      <SAMenu />
    </div>
  );
};

export default SAProcess;
