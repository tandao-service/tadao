import { useState } from "react";
import Image from "next/image";
import axios from "axios";

interface AdProps {
  ad: {
    _id: string;
    data: {
      title: string;
      price: number;
      imageUrls: string[];
      description: string;
      make: string;
      model: string;
      year: string;
      condition: string;
      mileage: string;
      fuel: string;
      body: string;
      features: string[];
    };
    adstatus: string;
    views: string;
  };
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
}

const CardAd: React.FC<AdProps> = ({ ad, onDelete, onUpdateStatus }) => {
  const [status, setStatus] = useState(ad.adstatus);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this ad?")) {
      try {
        await axios.delete(`/api/ads/${ad._id}`);
        onDelete(ad._id);
      } catch (error) {
        console.error("Error deleting ad:", error);
      }
    }
  };

  const handleStatusChange = async () => {
    const newStatus = status === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`/api/ads/${ad._id}`, { adstatus: newStatus });
      setStatus(newStatus);
      onUpdateStatus(ad._id, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <h2 className="text-xl font-bold">{ad.data.title}</h2>
      <p className="text-gray-600">Price: <span className="font-semibold">Ksh {ad.data.price.toLocaleString()}</span></p>
      <div className="flex space-x-2 overflow-x-auto">
        {ad.data.imageUrls.map((url, index) => (
          <Image key={index} src={url} alt={ad.data.title} width={100} height={75} className="rounded-lg" />
        ))}
      </div>
      <p className="text-gray-700">{ad.data.description}</p>
      <p className="text-sm text-gray-500">Condition: {ad.data.condition} | Mileage: {ad.data.mileage} km</p>
      <p className="text-sm text-gray-500">Fuel: {ad.data.fuel} | Body Type: {ad.data.body}</p>
      <p className="text-sm text-gray-500">Features: {ad.data.features.join(", ")}</p>

      <div className="mt-4 flex justify-between">
        <span className={`px-3 py-1 text-sm rounded ${status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {status}
        </span>
        <div className="space-x-2">
          <button onClick={handleStatusChange} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">
            {status === "Active" ? "Deactivate" : "Activate"}
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardAd;
