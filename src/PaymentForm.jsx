import { useState, useEffect } from "react";
import supabase from "./supabaseClient";
import { IoClose } from "react-icons/io5";
import { FiSend } from "react-icons/fi";

const PaymentForm = ({ onClose }) => {
  const [gcashName, setGcashName] = useState("");
  const [gcashNumber, setGcashNumber] = useState("");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState({ image: null });
  const name = sessionStorage.getItem("name");
  const purokno = sessionStorage.getItem("purokno");
  const description = sessionStorage.getItem("activityDescription");
  const document_type = sessionStorage.getItem("selectedClearance");
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      const filePath = `${file.name}`;
      const { data, error } = await supabase.storage
        .from("Images")
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicURL, error: urlError } = supabase.storage
        .from("Images")
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      return publicURL.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image: " + error.message);
      return null;
    }
  };

  useEffect(() => {
    fetchGcash();
  }, []);

  const fetchGcash = async () => {
    const { data } = await supabase.from("Number").select("*").eq("id", "1");

    setGcashName(data[0].name || []);
    setGcashNumber(data[0].number || []);
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!files.image) {
        alert("Please upload all three images before submitting.");
        setIsLoading(false);
        return;
      }

      let uploadedImages = { image: "" };
      uploadedImages.image = await uploadImage(files.image);

      if (!uploadedImages.image) {
        alert("Failed to upload one or more images. Please try again.");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("Requests")
        .insert([
          {
            name,
            purokno,
            image: uploadedImages.image,
            reason,
            document_type,
            status: "Pending",
            description,
          },
        ])
        .select();

      if (error) {
        console.error("Error inserting data:", error);
        alert("Error inserting data");
        setIsError(true);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModals = () => {
    setIsSubmitted(false);
    setIsError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 p-2">
      <div className="relative bg-base-100 p-4 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-5">
          <div className="mb-5 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-600 font-semibold flex gap-1">
                Payment
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <IoClose className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-2 border rounded-lg bg-blue-50 border-blue-500 flex justify-between">
            <img src="gcash.png" alt="" width={70} height={50} />
            <div>
              <p className="text-sm text-gray-700">Send payment to:</p>
              <p className="text-lg font-semibold text-blue-600">
                {gcashNumber}
              </p>
              <p className="text-lg font-semibold text-blue-600">{gcashName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <div className="space-y-3">
              <textarea
                name="reason"
                placeholder="Reason for Requesting..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="6"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300 resize-none"
                required
              />
              <h2 className="text-md font-medium">Proof of Payment:</h2>
              <input
                type="file"
                onChange={(e) =>
                  setFiles({ ...files, image: e.target.files[0] })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-700 text-white font-medium py-2 rounded-full transition-colors flex gap-2 justify-center items-center disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                ></path>
              </svg>
            ) : (
              <>
                <FiSend className="mt-1" />
                Submit
              </>
            )}
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
