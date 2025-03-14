import MenuList from "./menu-list";

export default function Menu() {
  return (
    <div className="top-0 left-0 w-full md:w-60 h-full bg-gray-800 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Menu</h2>
      <ul className="space-y-2">
        <li className="hover:bg-gray-700 p-2 rounded">Home</li>
        <li className="hover:bg-gray-700 p-2 rounded">Categories</li>
        <li className="hover:bg-gray-700 p-2 rounded">About</li>
        <li className="hover:bg-gray-700 p-2 rounded">Contact</li>
      </ul>
    </div>
  );
}
