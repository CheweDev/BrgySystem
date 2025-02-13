import { useState, useEffect } from "react";
import Menu from "./Menu";
import PaymentForm from "./PaymentForm";

const clearanceOptions = [
  {
    label: "Select Document Type",
    image: "https://placehold.co/600x400?text=Sample",
    details: "Provide a detailed personal details for the requested document."
  },
  {
    label: "Death Certificate",
    image: "death.jpg",
    price: "50 pesos",
    details: "Provide the following : Complete Name, Date and Time of Death, Place of Death."
  },
  {
    label: "First Time Job Seeker Certificate",
    image: "jobseeker.jpg",
    price: "50 pesos",
    details: "Provide the following : Full Name, Civil Status."
  },
  {
    label: "Certificate of Indigency",
    image: "indigency.jpg",
    price: "50 pesos",
    details: "Provide the following : Full Name."
  },
  {
    label: "Certificate of ONEES",
    image: "oness.jpg",
    price: "50 pesos",
    details: "Provide the following : Full Name. And present one valid ID for confirmation to barangay."
  },
  {
    label: "Certificate of Low Income",
    image: "income.jpg",
    price: "50 pesos",
    details: "Provide the following : Full Name, Gender, Monthly Income."
  },
  {
    label: "Certificate of Residency",
    image: "residency.jpg",
    price: "50 pesos",
    details: "Provide the following : Full Name, Gender, Civil Status, Date of Birth."
  },
  {
    label: "Certificate for Senior",
    image: "senior.jpg",
    price: "50 pesos",
    details: "Provide the following : Full Name, Civil Status."
  },
  {
    label: "Baranggay Clearance",
    image: "brgyclearance.jpg",
    price: "50 pesos",
    details: "Provide the following : Full Name, Civil Status."
  },
];

const Document = () => {
  const [description, setDescription] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClearance, setSelectedClearance] = useState(clearanceOptions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descriptionPlaceholder, setDescriptionPlaceholder] = useState(
    "Provide a detailed personal details for the requested document."
  );

  const getFormattedDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const yyyy = today.getFullYear();
    
    return `${yyyy}-${mm}-${dd}`; // Format for input type="date"
  };

  const handleSelectClearance = (option) => {
    setSelectedClearance(option);
    sessionStorage.setItem("selectedClearance", option.label);
    setIsDropdownOpen(false);
    setDescriptionPlaceholder(`${option.details}`);
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    sessionStorage.setItem("activityDescription", newDescription); // Store in sessionStorage
  };
  

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

          </header>

          {/* Main Form Card */}
          <div className="p-4 bg-gray-50 rounded-3xl shadow-sm mb-20">
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
                      onClick={() => handleSelectClearance(option)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date Input */}
            <div className="mb-4">
            <input
              type="date"
              value={getFormattedDate()}
              disabled
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-gray-100 cursor-not-allowed"
            />
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
               {/* Activity Description */}
               <div className="mb-4">
               <textarea
                placeholder={descriptionPlaceholder}
                value={description}
                rows={7}
                onChange={handleDescriptionChange}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 min-h-[100px] resize-none"
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
