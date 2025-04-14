import React, { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const ResidencyCertificate = () => {
  const certificateRef = useRef();
  const today = new Date();
  const [formData, setFormData] = useState({
    completeName: "",
    gender: "",
    address: "",
    civilStatus: "",
    dateOfBirth: "",
    age: "",
    purpose: "",
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
      pdf.save("residency_certificate.pdf");
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gradient-to-b from-[#89C6A7] to-[#25596E]">
      <h1 className="text-2xl font-bold text-center mt-5 text-white">
        Certificate of Residency Form
      </h1>
      <div className="divider"></div>
      <p className="italic text-white text-sm mb-5">
        *Please fill out all fields
      </p>

      <form onSubmit={handleDownloadPDF} className="space-y-4 pb-28">
        {[
          { name: "completeName", placeholder: "Complete Name" },
          { name: "gender", placeholder: "Gender" },
          { name: "address", placeholder: "Address" },
          { name: "civilStatus", placeholder: "Civil Status" },
          { name: "dateOfBirth", placeholder: "Date of Birth", type: "date" },
          { name: "age", placeholder: "Age" },
          { name: "purpose", placeholder: "Purpose" },
        ].map((field) => (
          <input
            key={field.name}
            type={field.type || "text"}
            name={field.name}
            value={formData[field.name]}
            placeholder={field.placeholder}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            name="day"
            value={formData.day}
            placeholder="Day"
            onChange={handleChange}
            className="w-1/3 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="month"
            value={formData.month}
            placeholder="Month"
            onChange={handleChange}
            className="w-1/3 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="year"
            value={formData.year}
            placeholder="Year"
            onChange={handleChange}
            className="w-1/3 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 px-4 py-4 border-t">
          <button
            type="submit"
            className="w-full bg-[#23ab80] text-white py-3 px-4 rounded-full"
          >
            Download Certificate
          </button>
        </div>
      </form>

      {/* Hidden certificate layout */}
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
                  CERTIFICATE OF RESIDENCY
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
            <p className="font-medium">TO WHOM IT MAY CONCERN:</p>
            <p className="indent-8 leading-relaxed">
              This is to certify that the person whose name, picture, and
              signature appears herein is a bonafide resident of this barangay:
            </p>

            {[
              ["Complete Name", formData.completeName],
              ["Gender", formData.gender],
              ["Address", formData.address],
              ["Civil Status", formData.civilStatus],
              ["Date of Birth", formData.dateOfBirth],
              ["Age", formData.age],
              ["Purpose", formData.purpose],
            ].map(([label, value]) => (
              <p key={label} className="ml-8">
                {label}:{" "}
                <span className="font-medium border-b border-black px-1">
                  {value}
                </span>
              </p>
            ))}

            <p className="mt-10 leading-relaxed">
              Issued this{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.day}
              </span>
              <sup>th</sup> day of{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.month}
              </span>{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.year}
              </span>
              , Barangay Pagatpatan, Butuan City, Philippines.
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

export default ResidencyCertificate;
