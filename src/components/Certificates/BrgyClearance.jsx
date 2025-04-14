import React, { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const BrgyClearanceForm = () => {
  const certificateRef = useRef();
  const today = new Date();
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    purok: "",
    age: "",
    day: today.getDate().toString(),
    month: today.toLocaleString("default", { month: "long" }),
    year: today.getFullYear().toString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadPDF = (e) => {
    e.preventDefault();
    const element = certificateRef.current;
    html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        unit: "in",
        format: "letter",
        orientation: "portrait",
      });
      const imgWidth = 8.5;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save("brgy_clearance_certificate.pdf");
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gradient-to-b from-[#89C6A7] to-[#25596E]">
      <h1 className="text-2xl font-bold text-center mt-5 text-white">
        Barangay Clearance Form
      </h1>
      <div className="divider"></div>
      <p className="italic text-white text-sm mb-5">*Please input all fields</p>
      <form onSubmit={handleDownloadPDF} className="space-y-4">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="text"
          name="purok"
          value={formData.purok}
          placeholder="Purok"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="number"
          name="age"
          value={formData.age}
          placeholder="Age"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <div className="fixed bottom-0 left-0 right-0 px-4 py-4 border-t">
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-[#23ab80] text-white py-3 px-4 rounded-full"
          >
            Download Certificate
          </button>
        </div>
      </form>

      {/* Hidden Certificate Template */}
      <div
        ref={certificateRef}
        className="absolute left-[-9999px] top-0 font-serif"
      >
        <div className="w-full max-w-[8.5in] mx-auto bg-white p-8 border border-gray-300">
          <div className="text-center mb-6 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="w-24 h-24">
                <img
                  src="gcash.png"
                  alt="Left Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-center px-4">
                <p className="text-sm font-semibold">
                  Republic of the Philippines
                </p>
                <p className="text-lg font-bold">
                  OFFICE OF THE PUNONG BARANGAY
                </p>
                <p className="text-sm font-semibold">Pagatpatan, Butuan City</p>
                <h1 className="text-2xl font-bold mt-2 underline">
                  BARANGAY CLEARANCE
                </h1>
              </div>
              <div className="w-24 h-24">
                <img
                  src="gcash.png"
                  alt="Right Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 text-left text-base">
            <p className="font-medium">TO Whom it may concern:</p>
            <p className="indent-8 leading-relaxed">
              This is to certify that{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.fullName}
              </span>
              , of legal age, {formData.gender}, is a bonafide resident of Purok{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.purok}
              </span>
              , Barangay Pagatpatan, Butuan City, Agusan del Norte.
            </p>
            <p className="indent-8 leading-relaxed">
              This certificate is issued for the purpose of requesting a
              Barangay Clearance for the aforementioned individual.
            </p>
            <p className="mt-12 leading-relaxed">
              Issued this{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.day}
              </span>{" "}
              day of{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.month}
              </span>{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.year}
              </span>
              , at Barangay Pagatpatan, Butuan City, Philippines.
            </p>
            <div className="mt-20 text-center w-64 ml-auto">
              <p className="font-bold">RONIELEN C. OLANDE</p>
              <p className="border-t border-black pt-1">Punong Barangay</p>
            </div>
            <div className="flex justify-start">
              <div className="mt-12 text-center italic text-green-600">
                <p>"Maayong Pagatpatan…, Ato Ini Kadyawon Ta..!"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrgyClearanceForm;
