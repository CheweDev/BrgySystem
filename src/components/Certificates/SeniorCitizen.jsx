import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useNavigate } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import { IoArrowBackCircle } from "react-icons/io5";
import supabase from "../../supabaseClient";

const SeniorCitizen = () => {
  const certificateRef = useRef();
  const today = new Date();
  const navigate = useNavigate();
  const back = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    purok: "",
    seniorName: "",
    requestPurpose: "",
    day: today.getDate().toString(),
    month: today.toLocaleString("default", { month: "long" }),
    year: today.getFullYear().toString().slice(-1),
  });
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    const purokno = sessionStorage.getItem("purokno");

    if (name || purokno) {
      setFormData((prev) => ({
        ...prev,
        name: name || "",
        purok: purokno || "",
      }));
    }

    const fetchAdminName = async () => {
      const { data, error } = await supabase
        .from("Users")
        .select("name")
        .eq("role", "Admin")
        .limit(1);

      if (error) {
        console.error("Error fetching admin:", error);
        return;
      }

      if (data && data.length > 0) {
        setAdminName(data[0].name);
      }
    };

    fetchAdminName();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadPDF = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    const element = certificateRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 15000,
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

    if (Capacitor.getPlatform() === "web") {
      pdf.save("senior_citizen_certificate.pdf");
      setIsGenerating(false);
    } else {
      const base64Data = pdf.output("datauristring").split(",")[1];
      await Filesystem.writeFile({
        path: "senior_citizen_certificate.pdf",
        data: base64Data,
        directory: Directory.Documents,
      });
      setIsGenerating(false);
      alert("PDF saved to Documents folder");
      navigate("/user-profile");
    }
  };

  const goBack = () => {
    back("/user-profile");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gradient-to-b from-[#89C6A7] to-[#25596E]">
      <IoArrowBackCircle className="text-white" onClick={goBack} size={40} />
      <h1 className="text-2xl font-bold text-center mt-3 text-white">
        Senior Citizen Certificate Form
      </h1>
      <div className="divider"></div>
      <p className="italic text-white text-sm mb-5">
        *Please fill out all fields
      </p>

      <form onSubmit={handleDownloadPDF} className="space-y-5">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Resident's Full Name"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="age"
            value={formData.age}
            placeholder="Age"
            onChange={handleChange}
            className="w-1/3 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="purok"
            value={formData.purok}
            placeholder="Purok"
            onChange={handleChange}
            className="w-2/3 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <input
          type="text"
          name="seniorName"
          value={formData.seniorName}
          placeholder="Senior Citizen Name"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="requestPurpose"
          value={formData.requestPurpose}
          placeholder="Purpose of Request"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
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
            placeholder="Year (last digit)"
            onChange={handleChange}
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

      {/* Hidden certificate template */}
      <div
        ref={certificateRef}
        className="absolute left-[-9999px] top-0 font-serif"
      >
        <div
          className="w-full bg-white p-8 mx-auto overflow-hidden"
          style={{ width: "210mm", maxWidth: "210mm", border: "none" }}
        >
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
              ,{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.age}
              </span>{" "}
              years old, married and bonafide resident of Purok{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.purok}
              </span>
              , Barangay Pagatpatan Butuan City.
            </p>

            <p className="indent-8 leading-relaxed">
              This certifies further that{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.seniorName}
              </span>{" "}
              is a Senior Citizen Member in the barangay, and has been living in
              the Barangay for the past six (6) months.
            </p>

            <p className="indent-8 leading-relaxed">
              This certification is being issued upon request{" "}
              <span className="font-medium border-b border-black px-1">
                {formData.requestPurpose}
              </span>{" "}
              for Senior Membership and I.D renewal and to whatever legal
              purpose it may serve her best.
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
              202
              <span className="font-medium border-b border-black px-1">
                {formData.year}
              </span>
              , Barangay Pagatpatan, Butuan City, Philippines.
            </p>

            <div className="mt-20 text-center w-64 ml-auto">
              <p className="font-bold">{adminName || "_________"}</p>
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

export default SeniorCitizen;
