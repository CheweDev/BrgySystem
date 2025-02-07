import { useState } from "react";
import { IoClose } from "react-icons/io5";
import SAMenu from "./SAMenu";

const SAProcess = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Justin",
      type: "Barangay Clearance",
      status: "Ongoing",
      address: "Purok 5",
      reason: "For business permit",
      imageUrl:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      proofOfPayment:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    {
      id: 2,
      name: "Justin",
      type: "Purok Clearance",
      status: "Lacking",
      address: "Purok 6",
      reason: "For school enrollment",
      imageUrl:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      proofOfPayment:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    {
      id: 3,
      name: "Dadong",
      type: "Barangay Clearance",
      status: "Ongoing",
      address: "Purok 7",
      reason: "For travel purposes",
      imageUrl:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      proofOfPayment:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
  ]);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const updateStatus = (newStatus) => {
    if (selectedRequest) {
      // Update the status of the selected request
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === selectedRequest.id
            ? { ...request, status: newStatus }
            : request
        )
      );
      closeModal();
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
      className="min-h-screen"
    >
      {/* Header */}
      <header className="p-4 space-y-3">
        <p className="text-3xl font-bold text-white mb-2 mt-5">Requests</p>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
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
      </header>

      <hr className="border-t border-white my-4" />

      {/* Request List */}
      <div className="p-4 space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => openModal(request)}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img
                src={request.imageUrl || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">{request.name}</p>
              <p className="font-medium text-gray-800">{request.type}</p>
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
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-4 w-full max-w-lg relative shadow-2xl transform transition-all duration-300 ease-out scale-95 hover:scale-100">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-800 transition-colors"
            >
              <IoClose />
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {selectedRequest.type}
            </h2>
            <img
              src={
                selectedRequest.proofOfPayment ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="Proof of Payment"
              className="w-full object-cover rounded-lg mb-6"
            />
            <div className="flex flex-col gap-4">
              <p className="text-gray-700">
                <strong>Name:</strong> {selectedRequest.name}
              </p>
              <p className="text-gray-700">
                <strong>Purok:</strong> {selectedRequest.address}
              </p>
              <p className="text-gray-700">
                <strong>Reason:</strong> {selectedRequest.reason}
              </p>
              <div className="flex mt-6 justify-between">
                <button
                  onClick={() => updateStatus("Ongoing")}
                  className="px-10 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md focus:outline-none"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus("Lacking")}
                  className="px-10 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md focus:outline-none"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SAMenu />
    </div>
  );
};

export default SAProcess;
