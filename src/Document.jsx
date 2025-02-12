import Menu from "./Menu";
import { useState } from "react";
import PaymentForm from "./PaymentForm";

const clearanceOptions = [
  {
    label: "Death Certificate",
    image: "death.jpg",
    price: "50 pesos",
  },
  {
    label: "First Time Job Seeker Certificate",
    image: "jobseeker.jpg",
    price: "50 pesos",
  },
  {
    label: "Certificate of Indigency",
    image: "indigency.jpg",
    price: "50 pesos",
  },
  {
    label: "Certificate for Senior Citizen",
    image: "senior.jpg",
    price: "50 pesos",
  },
  {
    label: "Certificate of Low Income",
    image: "lowincome.jpg",
    price: "50 pesos",
  },
  {
    label: "Certificate of Residency",
    image: "residency.jpg",
    price: "50 pesos",
  },
  {
    label: "Purok Clearance",
    image: "purokclearance.jpg",
    price: "50 pesos",
  },
  {
    label: "Baranggay Clearance",
    image: "brgyclearance.jpg",
    price: "50 pesos",
  },
];

const Document = () => {
  const [description, setDescription] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClearance, setSelectedClearance] = useState(
    clearanceOptions[0]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        style={{
          background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
        }}
        className="min-h-screen"
      >
        <div className="p-3">
          {/* Header */}
          <header className="flex justify-between items-center mt-5 mb-5">
            <h1 className="text-3xl font-semibold text-white">Documents</h1>
            <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
              View Clearance
            </button>
          </header>

          {/* Main Form Card */}
          <div className="p-4 bg-gray-50 rounded-3xl shadow-sm mb-20">
            {/* Date Input */}
            <div className="mb-4">
              <input
                type="date"
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-700"
              />
            </div>

            {/* Activity Description */}
            <div className="mb-4">
              <textarea
                placeholder="Provide a detailed description for the volunteer activity you completed (Who, what, when, where, & why)"
                value={description}
                rows={7}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 min-h-[100px] resize-none"
              />
            </div>

            {/* Dropdown */}
            <div className="mb-4 relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-700 flex justify-between items-center"
              >
                <span>{selectedClearance.label}</span>
                <span>▼</span>
              </button>

              {isDropdownOpen && (
                <ul className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                  {clearanceOptions.map((option) => (
                    <li
                      key={option.label}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedClearance(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Document Preview */}
            <div className="mb-4 relative w-full h-48 bg-gray-50 rounded-lg overflow-hidden">
              {/* Price Label at Top Right */}
              <div className="absolute top-2 right-2 bg-slate-500 text-white text-xs px-2 py-1 rounded">
                50 PHP
              </div>

              {/* Document Image */}
              <img
                src={selectedClearance.image}
                alt={`${selectedClearance.label} Preview`}
                className="object-contain w-full h-full"
              />
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                className="w-full py-3 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition-colors"
                onClick={() => setIsModalOpen(true)} // Open modal when clicked
              >
                Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <PaymentForm onClose={() => setIsModalOpen(false)} />}

      <Menu />
    </>
  );
};

export default Document;
