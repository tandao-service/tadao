import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";

interface MenuListProps {
  logo: string;
  href: string;
  title: string;
  keyword: string;
}

export default function MenuList({
  logo,
  href,
  title,
  keyword,
}: MenuListProps) {
  return (
    <>
      <div className="ml-0 md:ml-64 p-4">
        <h2 className="text-2xl font-bold mb-4">Items List</h2>
        <div className="h-screen overflow-y-auto p-2 border rounded">
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="p-4 bg-gray-200 my-2 rounded shadow">
              Item {i + 1}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
