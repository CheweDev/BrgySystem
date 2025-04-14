import React, { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { useNavigate } from "react-router-dom";

const IndigentCertificate = () => {
  const certificateRef = useRef();
  const today = new Date();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    indigentName: "",
    requestorName: "",
    purpose: "",
    day: today.getDate().toString(),
    month: today.toLocaleString("default", { month: "long" }),
    year: today.getFullYear().toString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDownloadPDF = async (e) => {
    e.preventDefault();
    const element = certificateRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF({
      unit: "in",
      format: "letter",
      orientation: "portrait",
    });
    const imgWidth = 8.5;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

    if (window.Capacitor?.isNativePlatform()) {
      const pdfOutput = pdf.output("datauristring");
      const base64Data = pdfOutput.split(",")[1];

      await Filesystem.writeFile({
        path: `indigent_certificate_${Date.now()}.pdf`,
        data: base64Data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      alert("PDF saved to your device's Documents folder.");
      navigate("/user-profile");
    } else {
      pdf.save("indigent_certificate.pdf");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gradient-to-b from-[#89C6A7] to-[#25596E]">
      <h1 className="text-2xl font-bold text-center mt-5 text-white">
        Indigency Certificate Form
      </h1>
      <div className="divider"></div>
      <p className="italic text-white text-sm mb-5">*Please fill all fields</p>
      <form onSubmit={handleDownloadPDF} className="space-y-5">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="text"
          name="indigentName"
          value={formData.indigentName}
          placeholder="Indigent's Name"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="text"
          name="requestorName"
          value={formData.requestorName}
          placeholder="Requestor's Name"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          placeholder="Purpose"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#23ab80] text-white py-3 px-4 rounded-full"
        >
          Download Certificate
        </button>
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
                  src="logo2.png"
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
                  CERTIFICATION
                </h1>
              </div>
              <div className="w-24 h-24">
                <img
                  src="logo1.png"
                  alt="Right Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 text-left text-base">
            <p className="font-medium">TO WHOM IT MAY CONCERN:</p>
            <p className="indent-8 leading-relaxed">
              This is to certify that{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.name}
              </span>
              , 58 years old, and a bonafide resident of Purok 5 Platinum,
              Barangay Pagatpatan Butuan City.
            </p>
            <p className="indent-8 leading-relaxed">
              This certifies further that{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.indigentName}
              </span>{" "}
              is an identified indigent as per barangay record shows.
            </p>
            <p className="indent-8 leading-relaxed">
              This certification is being issued upon request of{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.requestorName}
              </span>{" "}
              for{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.purpose}
              </span>{" "}
              requirement and to whatever legal purpose it may serve her best.
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

export default IndigentCertificate;
