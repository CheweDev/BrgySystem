import { useState, useEffect } from "react";
import Menu from "./Menu";
import PaymentForm from "./PaymentForm";
import { FiSend } from "react-icons/fi";
import supabase from "./supabaseClient";

const Document = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clearanceOptions, setClearanceOptions] = useState([]);
  const [selectedClearance, setSelectedClearance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getImageFileName = (label) => {
    return (
      label
        .toLowerCase()
        .replace(/certificate\s+of\s+/gi, "")
        .replace(/[^a-z0-9]/gi, "") + ".jpg"
    );
  };

  useEffect(() => {
    const fetchClearanceOptions = async () => {
      const { data, error } = await supabase.from("Certificates").select("*");

      if (error) {
        console.error("Error fetching certificates:", error);
        return;
      }

      const optionsWithImages = data.map((item) => ({
        ...item,
        image: `/${getImageFileName(item.label)}`,
      }));

      setClearanceOptions(optionsWithImages);
      setSelectedClearance(optionsWithImages[0]);
    };

    fetchClearanceOptions();
  }, []);

  const getFormattedDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSelectClearance = (option) => {
    setSelectedClearance(option);
    sessionStorage.setItem("selectedClearance", option.label);
    setIsDropdownOpen(false);
  };

  if (!selectedClearance)
    return (
      <div className="flex justify-center items-center content-center p-10">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );

  return (
    <>
      <div
        style={{
          background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
        }}
        className="min-h-screen"
      >
        <div className="p-2">
          <h1 className="text-2xl font-semibold text-white flex justify-center mt-5 mb-5">
            Request Document
          </h1>
          <hr className="border-t border-white mb-4" />
          <div className="flex flex-col flex-grow overflow-y-auto overflow-hidden bg-white p-3 rounded-lg">
            <div className="mb-3 relative">
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

            <div className="mb-4">
              <input
                type="date"
                value={getFormattedDate()}
                disabled
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="mb-4 relative w-full h-80 bg-gray-50 rounded-lg overflow-hidden">
              {selectedClearance && (
                <div className="absolute top-2 right-2 bg-slate-500 text-white text-xs px-2 py-1 rounded">
                  {selectedClearance.price} PHP
                </div>
              )}

              <img
                src={selectedClearance.image}
                alt={`${selectedClearance.label} Preview`}
                className="object-contain w-full h-full"
              />
            </div>

            <button
              className="w-full py-2 flex justify-center gap-1 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <FiSend className="mt-1" />
              Request
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <PaymentForm onClose={() => setIsModalOpen(false)} />}

      <Menu />
    </>
  );
};

export default Document;
