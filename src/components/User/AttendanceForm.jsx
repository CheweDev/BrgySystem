import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Menu from "../../Menu";
import supabase from "../../supabaseClient";
import { RiCompassDiscoverFill } from "react-icons/ri";

const AttendanceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    status: "Present",
    timeIn: "",
    timeOut: "",
    what: "",
  });
  const [hoursRendered, setHoursRendered] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState({ image: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedName = sessionStorage.getItem("name");
    if (storedName) {
      setFormData((prevData) => ({ ...prevData, name: storedName }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "timeIn" || name === "timeOut") {
      calculateHours(value, name);
    }
  };

  const calculateHours = (value, name) => {
    const { timeIn, timeOut } = formData;
    let startTime = name === "timeIn" ? value : timeIn;
    let endTime = name === "timeOut" ? value : timeOut;
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const diff = (end - start) / (1000 * 60 * 60);
      setHoursRendered(diff > 0 ? diff.toFixed(2) : null);
    } else {
      setHoursRendered(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const purokno = sessionStorage.getItem("purokno");
    let proofImageUrl = null;

    try {
      if (files.image) {
        const fileExt = files.image.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("Images")
          .upload(fileName, files.image);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("Images")
          .getPublicUrl(fileName);

        proofImageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("Attendance").insert([
        {
          purokno,
          name: formData.name,
          date: formData.date,
          what: formData.what,
          status: formData.status,
          time_in: formData.timeIn,
          time_out: formData.timeOut,
          total: hoursRendered || 0,
          proof: proofImageUrl,
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({
        name: sessionStorage.getItem("name") || "",
        date: "",
        status: "Present",
        timeIn: "",
        timeOut: "",
        what: "",
      });
      setHoursRendered(null);
      setFiles({ image: null });
    } catch (error) {
      console.error("Error submitting attendance:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#89C6A7] to-[#25596E] px-2 py-6 sm:px-2 pb-20">
      <p className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
        Attendance Form
      </p>

      <hr className="border-t border-white mb-3" />

      <div className="w-full max-w-lg mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md h-auto">
        <div className="flex flex-col flex-grow overflow-y-auto overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly
                className="w-full border rounded-lg p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label htmlFor="what" className="block text-sm font-medium mb-1">
                What
              </label>
              <input
                type="text"
                id="what"
                name="what"
                value={formData.what}
                onChange={handleInputChange}
                placeholder="Enter details"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time In</label>
              <input
                type="time"
                name="timeIn"
                value={formData.timeIn}
                onChange={handleInputChange}
                disabled={formData.status !== "Present"}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time Out</label>
              <input
                type="time"
                name="timeOut"
                value={formData.timeOut}
                onChange={handleInputChange}
                disabled={formData.status !== "Present"}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <h2 className="text-sm font-medium mb-1">Proof of Attendance:</h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFiles({ ...files, image: e.target.files[0] })
                }
                className="w-full"
              />
            </div>

            {hoursRendered !== null && formData.status === "Present" && (
              <p className="text-sm font-medium text-gray-600">
                Hours Rendered: {hoursRendered} hrs
              </p>
            )}

            <div className="divider" />

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-full flex gap-1 justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0116 0H4z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <RiCompassDiscoverFill className="mt-1" size={17} />
                  Submit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Success Modal */}
        {isSubmitted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-2">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Success!</h2>
                <button onClick={() => setIsSubmitted(false)}>
                  <IoClose className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-700">
                Attendance has been successfully submitted.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 w-full bg-[#77cdb1] text-white py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <Menu />
    </div>
  );
};

export default AttendanceForm;
