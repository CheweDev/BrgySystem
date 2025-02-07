import { useState } from "react";

const PaymentForm = ({ onClose }) => {
  const gcashNumber = "09123456789"; // Static GCash number

  const [formData, setFormData] = useState({
    firstname: "",
    age: "",
    purok: "",
    reason: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false); // Control success modal
  const [isError, setIsError] = useState(false); // Control error modal

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulating success or error response
    const isSuccess = Math.random() > 0.3; // 70% chance of success

    if (isSuccess) {
      setIsSubmitted(true);
      setIsError(false);
    } else {
      setIsError(true);
      setIsSubmitted(false);
    }
  };

  const closeModals = () => {
    setIsSubmitted(false);
    setIsError(false);
    onClose(); // Close main modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 p-4">
      {/* Main Modal */}
      <div className="relative bg-base-200 p-5 rounded-lg shadow-lg w-full max-w-md">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✖
        </button>

        {/* Payment Method */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3 text-gray-700">
            Payment Method
          </h2>
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-500 flex justify-between">
            <img src="gcash.png" alt="" width={50} height={50} />
            <div>
              <p className="text-sm text-gray-700">Send payment to:</p>
              <p className="text-lg font-semibold text-blue-600">
                {gcashNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Fill Out The Form</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="firstname"
                placeholder="Name"
                value={formData.firstname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                required
              />
              <input
                type="text"
                name="purok"
                placeholder="Purok"
                value={formData.purok}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                required
              />
              <textarea
                name="reason"
                placeholder="Reason for Requesting"
                value={formData.reason}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300 resize-none"
                required
              />
              <h2 className="text-md font-medium">Proof of Payment:</h2>
              <input type="file" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-700 text-white font-medium py-3 rounded-full transition-colors"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold text-green-600">Success!</h2>
            <p className="text-gray-700 mt-2">
              Your submission was successful.
            </p>
            <button
              onClick={closeModals}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {isError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold text-red-600">Error!</h2>
            <p className="text-gray-700 mt-2">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={closeModals}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
