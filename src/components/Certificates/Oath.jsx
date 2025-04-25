import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { useNavigate } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";

const Oath = () => {
  const certificateRef = useRef();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    purok: "",
    parentName: "",
    parentAge: "",
    childName: "",
    parentAddress: "",
    residencyYears: "",
    residencyType: "",
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

  const handleDownloadPDF = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    const element = certificateRef.current;

    // Generate canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Create the PDF
    const pdf = new jsPDF({
      unit: "in",
      format: "letter",
      orientation: "portrait",
    });

    const imgWidth = 8.5;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

    // Convert to base64 data
    const pdfOutput = pdf.output("datauristring");
    const base64Data = pdfOutput.split(",")[1];

    const fileName = "Oath_of_Undertaking_certificate.pdf";

    // Check if Capacitor is available (for mobile)
    if (window.Capacitor) {
      try {
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });
        setIsGenerating(false);
        alert("PDF saved successfully to device.");
        navigate("/user-profile");
      } catch (err) {
        console.error("Failed to save PDF on device:", err);
        alert("Failed to save PDF. Please try again.");
      }
    } else {
      // For web, just download the file as before
      pdf.save(fileName);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen bg-gradient-to-b from-[#89C6A7] to-[#25596E]">
      <h1 className="text-2xl font-bold text-center mt-5 text-white">
        Oath of Undertaking
      </h1>
      <div className="divider"></div>
      <p className="italic text-white text-sm mb-5">*Please input all fields</p>
      <form onSubmit={handleDownloadPDF} className="space-y-4 mt-6">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="purok"
          placeholder="Purok"
          value={formData.purok}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="parentName"
          placeholder="Parent/Guardian Name"
          value={formData.parentName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="parentAge"
          placeholder="Parent/Guardian Age"
          value={formData.parentAge}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="childName"
          placeholder="Child's Name"
          value={formData.childName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="parentAddress"
          placeholder="Parent's Address"
          value={formData.parentAddress}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="residencyYears"
          placeholder="Years of Residency"
          value={formData.residencyYears}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="residencyType"
          placeholder="Type (e.g. years/months)"
          value={formData.residencyType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

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

      {/* HIDDEN Certificate */}
      <div
        ref={certificateRef}
        className="absolute left-[-9999px] top-0 w-[8.5in] bg-white p-8 font-serif"
      >
        <div className="text-sm text-right mb-10">
          Revised as of 16 June 2021
        </div>
        <h1 className="text-center text-xl font-bold">OATH OF UNDERTAKING</h1>
        <h2 className="text-center font-bold mb-4">
          Republic Act 11261 - First Time Jobseekers Assistance Act
        </h2>

        <p className="text-justify leading-relaxed mb-4">
          I, <strong>{formData.fullName}</strong>,{" "}
          <strong>{formData.age}</strong> years old, resident of Purok{" "}
          <strong>{formData.purok}</strong>, Barangay Pagatpatan, Butuan City,
          otherwise known as the First Time Jobseekers Act of 2019, do hereby
          declare, agree and undertake to abide and be bounded by the following:
        </p>

        <ol className="list-decimal pl-6 text-justify space-y-2 text-sm">
          <li>
            That this is the first time that I will actively look for a job, and
            therefore requesting that a Barangay Certification be issued in my
            favor to avail the benefits of the law;
          </li>
          <li>
            That I am aware that the benefit and privilege/s under the said law
            shall be valid only for one (1) year from the date that the Barangay
            Certification is issued;
          </li>
          <li>That I can avail the benefits of the law only once;</li>
          <li>
            That I understand that my personal information shall be included in
            the Roster/List of First Time Jobseekers and will not be used for
            any unlawful purpose;
          </li>
          <li>
            That I will inform and/or report to the Barangay personally, through
            text or other means, or through my family/relatives once I get
            employed;
          </li>
          <li>
            That I am not a beneficiary of the Job start Program under R.A No.
            10869 and other laws that give similar exemptions for the documents
            or transactions exempted under R.A 11261;
          </li>
          <li>
            That if issued the requested Certification, I will not use the same
            in any fraud, neither falsify nor help and/or assist in the
            fabrication of the said certification;
          </li>
          <li>
            That this undertaking is made solely for the purpose of obtaining a
            Barangay Certification consistent with the objective of R.A No.
            11261 and not for any other purpose; and
          </li>
          <li>
            That I consent to the use of my personal information pursuant to the
            Data Privacy Act and other applicable laws, rules, and regulations.
          </li>
        </ol>

        <div className="mt-12 flex justify-between">
          <div className="text-center w-1/2">
            <div className="border-t border-black mt-12 mx-4"></div>
            <p className="text-sm">First Time Jobseeker</p>
          </div>
          <div className="text-center w-1/2">
            <p className="font-bold">RONIELEN C. OLANDE</p>
            <p className="text-sm">Punong Barangay</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="mt-12 text-sm text-justify">
          <h3 className="font-bold mb-2">
            For applicants at least 15 to less than 18 years old:
          </h3>
          <p>
            I, <strong>{formData.parentName}</strong>,{" "}
            <strong>{formData.parentAge}</strong> years of age, parent/guardian
            of <strong>{formData.childName}</strong>, and a resident of{" "}
            <strong>{formData.parentAddress}</strong> for{" "}
            <strong>
              {formData.residencyYears} {formData.residencyType}
            </strong>
            , do hereby give my consent for my child to avail the benefits of
            Republic Act 11261 and be bound by the conditions.
          </p>

          <div className="mt-8">
            <p>Signed:</p>
            <div className="border-t border-black mt-12 w-64"></div>
            <p className="text-sm">Parent/Guardian</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oath;
