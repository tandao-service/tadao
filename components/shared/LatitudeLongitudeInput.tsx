import { useState } from "react";

const LatitudeLongitudeInput = ({
    selected,
    name,
    onChange,
    onSave,
  }: {
    selected: any;
    name: string;
    onChange: (field: string, value: any) => void;
    onSave: () => void;
  }) => {
  const [latitude, setLatitude] = useState<string>( selected ? selected.latitude:"");
  const [longitude, setLongitude] = useState<string>(selected ? selected.longitude:"");
  const [error, setError] = useState<string>("");

  const handleSave = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setError("Latitude and Longitude must be numbers.");
      return;
    }

    if (lat < -90 || lat > 90) {
      setError("Latitude must be between -90 and 90.");
      return;
    }

    if (lon < -180 || lon > 180) {
      setError("Longitude must be between -180 and 180.");
      return;
    }

    setError("");
    onChange(name, { latitude: lat, longitude: lon }); // Pass it to the parent
    onSave();
    console.log("Saved Coordinates:", { latitude: lat, longitude: lon });

    // You can replace the console log with an API call or state update
  };

  return (
    <div className="p-4 dark:bg-[#2D3236] dark:text-gray-100 bg-white shadow-md rounded-lg w-full">
      <h2 className="text-lg font-semibold mb-2">Enter Property Coordinates</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <input
        type="text"
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        className="w-full dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded mb-2"
      />

      <input
        type="text"
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        className="w-full dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded mb-2"
      />

      <button
        onClick={handleSave}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
      >
        Save
      </button>
    </div>
  );
};

export default LatitudeLongitudeInput;
