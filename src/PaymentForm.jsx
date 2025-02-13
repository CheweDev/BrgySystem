import { useState, useEffect } from "react";
import supabase from "./supabaseClient";

const PaymentForm = ({ onClose }) => {
  const [gcashName, setGcashName] = useState("");
  const [gcashNumber, setGcashNumber] = useState("");
    const [age, setAge] = useState('');
    const [reason, setReason] = useState('');
    const [files, setFiles] = useState({ image: null });
    const name = sessionStorage.getItem("name");
    const purokno = sessionStorage.getItem("purokno");
    const description  = sessionStorage.getItem("activityDescription")
    const document_type = sessionStorage.getItem("selectedClearance");


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
      const { data } = await supabase
        .from("Number")
        .select("*")
        .eq("id", "1")
      
      setGcashName(data[0].name || []);
      setGcashNumber(data[0].number || []);
    };
  
  


  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [isError, setIsError] = useState(false); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.image) {
      alert("Please upload all three images before submitting.");
      return;
    }
  
    let uploadedImages = { image: "" };
  

    uploadedImages.image = await uploadImage(files.image);

  

    if (!uploadedImages.image) {
      alert("Failed to upload one or more images. Please try again.");
      return;
    }
      const { data, error } = await supabase
        .from('Requests')
        .insert([
          {
            name,
            purokno,
            image: uploadedImages.image,
            reason,
            document_type,
            status : 'Pending',
            description,
          },
        ])
        .select();
  
      if (error) {
        console.error("Error inserting data:", error);
        alert("Error inserting data");
      } else {
        console.log("Data inserted successfully:", data);
        window.location.reload();
      }
  }

  const closeModals = () => {
    setIsSubmitted(false);
    setIsError(false);
    onClose(); 
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
              <p className="text-lg font-semibold text-blue-600">
                {gcashName}
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
                value={name}
              disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                required
              />
              <input
                type="text"
                name="purok"
                placeholder="Purok"
                value={`Purok ${purokno}`}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                required
              />
              <textarea
                name="reason"
                placeholder="Reason for Requesting"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300 resize-none"
                required
              />
              <h2 className="text-md font-medium">Proof of Payment:</h2>
              <input type="file" onChange={(e) => setFiles({ ...files, image: e.target.files[0] })} />
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
