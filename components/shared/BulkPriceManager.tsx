import React, { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useMediaQuery } from "react-responsive";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

type BulkPrice = {
  quantity: number;
  pricePerPiece: number;
  unit: string; // e.g., 'piece', 'sqm', 'sqft'
};

export const BulkPriceManager = ({
  selected,
  name,
  onChange,
  handleClosePopupBulk,
}: {
  selected: BulkPrice[];
  name: string;
  handleClosePopupBulk: () => void;
  onChange: (field: string, value: BulkPrice[]) => void;
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [pricePerPiece, setPricePerPiece] = useState<number>(0);
  const [unit, setUnit] = useState<string>("piece");
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { toast } = useToast();

  const formatToCurrency = (value: string | number) => {
    if (!value) return "0";
    const numberValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  const parseCurrencyToNumber = (value: string): number => {
    return Number(value.replace(/,/g, ""));
  };

  const handleAdd = () => {
    if (quantity > 0 && pricePerPiece > 0) {
      const updatedPrices = [...selected, { quantity, pricePerPiece, unit }];
      onChange(name, updatedPrices);
      setQuantity(0);
      setPricePerPiece(0);
      setUnit("piece");
    } else {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Please enter valid quantity and price.",
        duration: 5000,
      });
    }
  };
  

  const handleEdit = (index: number) => {
    const item = selected[index];
    setQuantity(item.quantity);
    setPricePerPiece(item.pricePerPiece);
    handleDelete(index);
  };

  const handleDelete = (index: number) => {
    const updatedPrices = selected.filter((_, i) => i !== index);
    onChange(name, updatedPrices);
  };

  const quantityOptions = [
    "",
    "2", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "50+",
  ];

  const renderSelect = (
    value: number,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  ) => (
    <select
      value={value}
      onChange={onChange}
      className="px-4 w-full py-2 border border-gray-800 rounded-md dark:bg-[#2D3236] dark:text-gray-100"
    >
      {quantityOptions.map((opt) => (
        <option key={opt} value={opt}>
          {opt && `${opt}`}
        </option>
      ))}
    </select>
  );

  return (
    <>
      {isMobile ? (
        <div className="fixed inset-0 z-10 bg-gray-200 dark:bg-[#2D3236] dark:text-gray-100 p-1 lg:p-4 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2">
            <p className="text-lg lg:text-2xl font-bold text-center">
              Bulk Price Manager
            </p>
            <Button variant="outline" onClick={handleClosePopupBulk}>
              <CloseOutlinedIcon />
            </Button>
          </div>

          <div className="w-full p-6 bg-white dark:bg-[#2D3236] dark:text-gray-100">
            <div className="flex flex-col lg:flex-row gap-1 items-center w-full">
              <div className="flex flex-col w-full">
                <label className="font-medium mb-1">Quantity:</label>
                {renderSelect(quantity, (e) =>
                  setQuantity(parseInt(e.target.value, 10))
                )}
              </div>
              <div className="flex flex-col w-full">
  <label className="font-medium mb-1">Unit:</label>
  <select
    value={unit}
    onChange={(e) => setUnit(e.target.value)}
    className="px-4 py-2 border border-gray-800 rounded-md dark:bg-[#131B1E] dark:text-gray-100"
  >
    <option value="piece">Price / Piece</option>
    <option value="sqm">Per Square Metre</option>
    <option value="sqft">Per Square Foot</option>
  </select>
</div>

              <div className="flex flex-col w-full">
             
                <input
                  type="text"
                  value={formatToCurrency(pricePerPiece ?? 0)}
                  onChange={(e) =>
                    setPricePerPiece(parseCurrencyToNumber(e.target.value))
                  }
                  placeholder="Enter price per piece"
                  className="px-4 py-2 w-full border border-gray-800 rounded-md dark:bg-[#131B1E] dark:text-gray-100"
                />
              </div>

              <button
                onClick={handleAdd}
                className="bg-black w-full mt-6 hover:bg-gray-600 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-[#F1F3F3] p-2 rounded-xl"
              >
                <AddOutlinedIcon /> Add
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Bulk Prices</h3>
              {selected.length > 0 ? (
                <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 space-y-0">
                  {selected.map((item, index) => (
                    <li
                      key={index}
                      className="flex text-xs items-center justify-between p-4 dark:bg-[#131B1E] text-black dark:text-gray-300 bg-gray-100 rounded-md shadow-sm"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <div>Quantity:</div>
                          <div className="font-bold">{item.quantity}</div>
                        </div>
                        <div className="flex gap-1">
  <div>Price:</div>
  <div className="font-bold">
    Ksh {item.pricePerPiece.toFixed(2)}{" "}
    {item.unit === "piece"
      ? "/piece"
      : item.unit === "sqm"
      ? "/sqm"
      : "/sqft"}
  </div>
</div>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="bg-black hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-[#F1F3F3] p-2 rounded-xl"
                        >
                          <EditOutlinedIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="bg-black hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-[#F1F3F3] p-2 rounded-xl"
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No bulk prices added yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-white p-1 lg:p-6 w-full lg:max-w-3xl rounded-md shadow-md relative">
            <div className="flex justify-end items-center mb-1">
              <Button onClick={handleClosePopupBulk} variant="outline">
                <CloseOutlinedIcon />
              </Button>
            </div>
            <div className="w-full p-6 bg-white border border-gray-200 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 rounded-sm shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">
                Bulk Price Manager
              </h2>

              <div className="flex gap-1 items-center">
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Quantity:</label>
                  {renderSelect(quantity, (e) =>
                    setQuantity(parseInt(e.target.value, 10))
                  )}
                </div>
                <div className="flex flex-col w-full">
  <label className="font-medium mb-1">Unit:</label>
  <select
    value={unit}
    onChange={(e) => setUnit(e.target.value)}
    className="px-4 py-2 border border-gray-800 rounded-md dark:bg-[#131B1E] dark:text-gray-100"
  >
    <option value="piece">Price / Piece</option>
    <option value="sqm">Per Square Metre</option>
    <option value="sqft">Per Square Foot</option>
  </select>
</div>

                <button
                  onClick={handleAdd}
                  className="bg-black mt-6 hover:bg-gray-600 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-[#F1F3F3] p-2 rounded-xl"
                >
                  <AddOutlinedIcon />
                </button>
              </div>

              <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Bulk Prices</h3>
              {selected.length > 0 ? (
                <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 space-y-0">
                  {selected.map((item, index) => (
                    <li
                      key={index}
                      className="flex text-xs items-center justify-between p-4 dark:bg-[#131B1E] text-black dark:text-gray-300 bg-gray-100 rounded-md shadow-sm"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <div>Quantity:</div>
                          <div className="font-bold">{item.quantity}</div>
                        </div>
                        <div className="flex gap-1">
  <div>Price:</div>
  <div className="font-bold">
    Ksh {item.pricePerPiece.toFixed(2)}{" "}
    {item.unit === "piece"
      ? "/piece"
      : item.unit === "sqm"
      ? "/sqm"
      : "/sqft"}
  </div>
</div>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="bg-black hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-[#F1F3F3] p-2 rounded-xl"
                        >
                          <EditOutlinedIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="bg-black hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-[#F1F3F3] p-2 rounded-xl"
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No bulk prices added yet.</p>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
