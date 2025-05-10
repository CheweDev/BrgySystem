import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import SAMenu from "./SAMenu";

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      const { data, error } = await supabase.from("Certificates").select("*");
      if (error) {
        setError("Failed to load certificates");
        console.error("Fetch error:", error);
      } else {
        setCertificates(data);
      }
      setLoading(false);
    };

    fetchCertificates();
  }, []);

  const handlePriceChange = (id, newPrice) => {
    setCertificates((prev) =>
      prev.map((cert) => (cert.id === id ? { ...cert, price: newPrice } : cert))
    );
  };

  const savePrice = async (id, price) => {
    setSavingId(id);
    const { error } = await supabase
      .from("Certificates")
      .update({ price })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      alert("Failed to update price.");
    } else {
      alert("Price updated successfully.");
    }
    setSavingId(null);
  };
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <>
      <div
        style={{
          background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
        }}
        className="min-h-screen pb-14"
      >
        <div className="p-3 shadow rounded-lg max-w-2xl mx-auto">
          <p className="text-2xl font-bold text-white mb-5 mt-2">
            Manage Prices
          </p>
          <ul>
            {certificates.map((cert) => (
              <li
                key={cert.id}
                className="flex items-center justify-between border-b py-3"
              >
                <span className="font-medium text-white">{cert.label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={cert.price}
                    onChange={(e) =>
                      handlePriceChange(cert.id, parseFloat(e.target.value))
                    }
                    className="border border-gray-300 px-2 py-1 rounded w-24"
                  />
                  <button
                    onClick={() => savePrice(cert.id, cert.price)}
                    disabled={savingId === cert.id}
                    className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
                  >
                    {savingId === cert.id ? "Saving..." : "Save"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SAMenu />
    </>
  );
};

export default ManageCertificates;
