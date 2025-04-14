import React, { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { useNavigate } from "react-router-dom";

const LowIncomeCertificateForm = () => {
  const certificateRef = useRef();
  const today = new Date();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    occupation: "",
    monthlyIncome: "",
    dailyIncome: "",
    workingDays: "",
    day: today.getDate().toString(),
    month: today.toLocaleString("default", { month: "long" }),
    year: today.getFullYear().toString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const pdfOutput = pdf.output("datauristring");
    const base64Data = pdfOutput.split(",")[1];

    const fileName = "certificate_low_income.pdf";

    if (window.Capacitor) {
      try {
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });
        alert("PDF saved successfully to device.");
        navigate("/user-profile");
      } catch (err) {
        console.error("Failed to save PDF on device:", err);
        alert("Failed to save PDF. Please try again.");
      }
    } else {
      pdf.save(fileName);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white min-h-screen bg-gradient-to-b from-[#89C6A7] to-[#25596E]">
      <h1 className="text-2xl font-bold text-center mt-5 text-white">
        Certificate of Low Income
      </h1>
      <div className="divider"></div>
      <p className="italic text-white text-sm mb-5">*Please input all fields</p>
      <form onSubmit={handleDownloadPDF} className="space-y-5">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="text"
          name="occupation"
          value={formData.occupation}
          placeholder="Occupation"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="number"
          name="monthlyIncome"
          value={formData.monthlyIncome}
          placeholder="Monthly Income"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="number"
          name="dailyIncome"
          value={formData.dailyIncome}
          placeholder="Daily Income"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="number"
          name="workingDays"
          min="1"
          max="7"
          value={formData.workingDays}
          placeholder="Working Days per Week"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <button
          onClick={handleDownloadPDF}
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
                  BARANGAY CLEARANCE
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
            <p className="font-medium">TO Whom it may concern:</p>
            <p className="indent-8 leading-relaxed">
              This is to certify that{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.fullName}
              </span>
              , of legal age, male, is a bonafide resident of Purok 2
              Mabungahon, Barangay Pagatpatan, Butuan City, Agusan del Norte.
            </p>
            <p className="indent-8 leading-relaxed">
              Furthermore, it is certified that he/she is an{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.occupation}
              </span>{" "}
              and with an average monthly income of Php{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.monthlyIncome}
              </span>{" "}
              or a daily income of Php{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.dailyIncome}
              </span>
              , working a maximum of{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.workingDays}
              </span>{" "}
              days a week.
            </p>
            <p className="indent-8 leading-relaxed">
              Given the provided income and the impact of rising inflation, this
              amount is insufficient to cover essential needs such as food,
              shelter, utilities, and other necessities.
            </p>
            <p className="indent-8 leading-relaxed">
              This certification is issued upon the request of the
              aforementioned individual as one of the prerequisites for the
              Ayuda sa Kapos ang Kita Program (AKAP) of the Department of Social
              Welfare and Development for Medical Assistance.
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

export default LowIncomeCertificateForm;
