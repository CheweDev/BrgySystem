import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Menu from "../../Menu";

const AttendanceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    status: "Present",
    timeIn: "",
    timeOut: "",
    what: "", // Added new state for "What"
  });
  const [hoursRendered, setHoursRendered] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Automatically calculate hours rendered if timeIn and timeOut are provided
    if (name === "timeIn" || name === "timeOut") {
      calculateHours(value, name);
    }
  };

  // Calculate hours rendered
  const calculateHours = (value, name) => {
    const { timeIn, timeOut } = formData;
    let startTime = name === "timeIn" ? value : timeIn;
    let endTime = name === "timeOut" ? value : timeOut;

    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const diff = (end - start) / (1000 * 60 * 60); // Convert ms to hours

      if (diff > 0) {
        setHoursRendered(diff.toFixed(2));
      } else {
        setHoursRendered(null);
      }
    } else {
      setHoursRendered(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(
      "Attendance submitted:",
      formData,
      `Hours Rendered: ${hoursRendered || 0}`
    );
    setIsSubmitted(true);

    // Reset form
    setFormData({
      name: "",
      date: "",
      status: "Present",
      timeIn: "",
      timeOut: "",
      what: "", // Reset "What" field
    });
    setHoursRendered(null);
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
      }}
      className="min-h-screen"
    >
      <div className="p-3">
        <p className="text-3xl font-bold text-white mb-2 mt-5 flex justify-center">
          Attendance Form
        </p>
        <hr className="border-t border-white my-4" />
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your name"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
              />
            </div>

            {/* Date Input */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
              />
            </div>

            {/* What Input Field */}
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

            {/* Status Dropdown */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            {/* Time In Input */}
            <div>
              <label
                htmlFor="timeIn"
                className="block text-sm font-medium mb-1"
              >
                Time In
              </label>
              <input
                type="time"
                id="timeIn"
                name="timeIn"
                value={formData.timeIn}
                onChange={handleInputChange}
                disabled={formData.status !== "Present"}
                className={`w-full border rounded-lg p-2 focus:outline-none ${
                  formData.status !== "Present"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "focus:ring-2 focus:ring-[#77cdb1]"
                }`}
              />
            </div>

            {/* Time Out Input */}
            <div>
              <label
                htmlFor="timeOut"
                className="block text-sm font-medium mb-1"
              >
                Time Out
              </label>
              <input
                type="time"
                id="timeOut"
                name="timeOut"
                value={formData.timeOut}
                onChange={handleInputChange}
                disabled={formData.status !== "Present"}
                className={`w-full border rounded-lg p-2 focus:outline-none ${
                  formData.status !== "Present"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "focus:ring-2 focus:ring-[#77cdb1]"
                }`}
              />
            </div>

            {/* Hours Rendered */}
            {hoursRendered !== null && formData.status === "Present" && (
              <p className="text-sm font-medium text-gray-600">
                Hours Rendered: {hoursRendered} hrs
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#77cdb1] text-white py-2 rounded-lg font-medium hover:bg-[#66bca0] focus:outline-none focus:ring-2 focus:ring-[#77cdb1]"
            >
              Submit Attendance
            </button>
          </form>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default AttendanceForm;
