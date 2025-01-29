import React, { useState } from "react";

const Right = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  // Handle right-click
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent default browser menu

    setMenuPosition({ x: e.pageX, y: e.pageY }); // Set menu position
    setMenuVisible(true);
  };

  // Hide menu on click anywhere
  const handleClick = () => {
    setMenuVisible(false);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      className="h-screen w-screen flex justify-center items-center bg-gray-100"
    >
      <h1 className="text-2xl font-bold">Right-click anywhere!</h1>

      {menuVisible && (
        <ul
          className="absolute bg-white shadow-lg rounded-md w-40 py-2 border"
          style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
        >
          <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
            Option 1
          </li>
          <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
            Option 2
          </li>
          <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
            Option 3
          </li>
        </ul>
      )}
    </div>
  );
};

export default Right;
