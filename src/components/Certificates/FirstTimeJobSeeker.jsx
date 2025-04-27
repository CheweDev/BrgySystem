import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";

const FirstTimeJobseekerCertificate = () => {
  const certificateRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const today = new Date();
  const defaultYear = today.getFullYear().toString().substr(2);
  const [formData, setFormData] = useState({
    fullName: "",
    purok: "",
    firstName: "",
    requestorName: "",
    day: today.getDate().toString(),
    month: today.toLocaleString("default", { month: "long" }),
    year: defaultYear,
  });

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    const purokno = sessionStorage.getItem("purokno");

    if (name || purokno) {
      setFormData((prev) => ({
        ...prev,
        fullName: name || "",
        purok: purokno || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const preloadImages = async (element) => {
    const imgs = element.querySelectorAll("img");
    await Promise.all(
      Array.from(imgs).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = img.onerror = resolve;
        });
      })
    );
  };

  const handleDownloadPDF = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const element = certificateRef.current;
      await preloadImages(element);

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pdfWidth - 2 * margin;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "JPEG",
        margin,
        margin,
        contentWidth,
        contentHeight
      );

      const isMobile = Capacitor.isNativePlatform();

      if (isMobile) {
        const pdfBase64 = pdf.output("datauristring").split(",")[1];
        const fileName = `first_time_jobseeker_${Date.now()}.pdf`;

        await Filesystem.writeFile({
          path: fileName,
          data: pdfBase64,
          directory: Directory.Documents,
        });
        setIsGenerating(false);
        alert(`PDF saved to your documents as ${fileName}`);
        navigate("/user-profile");
      } else {
        pdf.save("first_time_jobseeker_certificate.pdf");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gradient-to-b from-[#89C6A7] to-[#25596E]">
      <h1 className="text-2xl font-bold text-center mt-5 text-white">
        First Time Jobseeker Certificate
      </h1>
      <div className="divider"></div>
      <p className="italic text-sm text-white mb-5">
        *Please fill out all fields
      </p>

      <form onSubmit={handleDownloadPDF} className="space-y-5">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
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
          type="text"
          name="firstName"
          value={formData.firstName}
          placeholder="First Name (repeated in paragraph)"
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

        {/* Date Inputs */}
        <div className="flex space-x-2">
          <input
            type="text"
            name="day"
            value={formData.day}
            onChange={handleChange}
            placeholder="Day"
            className="w-1/3 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="month"
            value={formData.month}
            onChange={handleChange}
            placeholder="Month"
            className="w-1/3 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            className="w-1/3 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="divider"></div>
        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full py-3 px-4 rounded-full text-white flex justify-center gap-1 ${
            isGenerating ? "bg-gray-400" : "bg-[#23ab80]"
          }`}
        >
          <FaFileDownload className="mt-1" />
          {isGenerating ? "Generating..." : "Download"}
        </button>
      </form>

      {/* Hidden Certificate for PDF - Updated to match A4 proportions */}
      <div
        ref={certificateRef}
        className="absolute left-[-9999px] top-0 font-serif"
      >
        <div
          className="w-full bg-white p-8 mx-auto overflow-hidden"
          style={{ width: "210mm", maxWidth: "210mm", border: "none" }}
        >
          <div className="text-center mb-10">
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
                <h1 className="text-3xl font-bold mt-10 underline">
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

          <p className="text-left font-bold mb-5 mt-5">
            TO WHOM IT MAY CONCERN:
          </p>

          <div className="text-justify space-y-5 text-base">
            <p>
              This is to certify that{" "}
              <span className="font-medium underline px-1">
                {formData.fullName}
              </span>
              , of legal age, single and bonafide resident of Purok{" "}
              <span className="font-medium underline px-1">
                {formData.purok}
              </span>
              , Barangay Pagatpatan, Butuan City.
            </p>

            <p>
              This certifies further that{" "}
              <span className="font-medium underline px-1">
                {formData.firstName}
              </span>{" "}
              is a First time Job seeker, as per Republic Act 11261 First Time
              Job Seeker Act of 2019.
            </p>

            <p>
              This certification is being issued upon request of{" "}
              <span className="font-medium underline px-1">
                {formData.requestorName}
              </span>{" "}
              to whatever legal purpose it may serve her best.
            </p>

            <p>
              Issued this{" "}
              <span className="font-medium underline px-1">{formData.day}</span>{" "}
              day of{" "}
              <span className="font-medium underline px-1">
                {formData.month}
              </span>{" "}
              202
              <span className="font-medium underline px-1">
                {formData.year}
              </span>
              , Barangay Pagatpatan, Butuan City, Philippines.
            </p>
          </div>

          <div className="mt-16 flex justify-end mr-4">
            <div className="text-center">
              <p className="font-bold">RONIELEN C. OLANDE</p>
              <p>Punong Barangay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeJobseekerCertificate;
