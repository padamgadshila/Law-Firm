// PreviewClient.jsx
import React, { useEffect, useState } from "react";

const PreviewClient = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // Fetch data from localStorage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("uploadedData")) || [];
    setData(storedData);
  }, []);

  // Handle search and filter
  const filteredData = data.filter((entry) => {
    if (filter && entry[filter]) {
      return entry[filter]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
    return Object.values(entry).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Edit entry (redirect to another page)
  const handleEdit = (index) => {
    const entry = data[index];
    localStorage.setItem("editEntry", JSON.stringify(entry));
    window.location.href = "/upload"; // Update with your upload page route
  };

  // Delete a single entry
  const handleDelete = (index) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete the entry for Client ID: ${data[index].clientId}?`
    );
    if (confirmation) {
      const updatedData = [...data];
      updatedData.splice(index, 1);
      setData(updatedData);
      localStorage.setItem("uploadedData", JSON.stringify(updatedData));
    }
  };

  // Delete selected entries
  const handleDeleteSelected = () => {
    const selectedIndices = data
      .map((_, index) => document.getElementById(`checkbox-${index}`).checked)
      .map((isChecked, index) => (isChecked ? index : -1))
      .filter((index) => index !== -1);

    if (selectedIndices.length > 0) {
      const confirmation = window.confirm(
        "Are you sure you want to delete the selected entries?"
      );
      if (confirmation) {
        const updatedData = data.filter(
          (_, index) => !selectedIndices.includes(index)
        );
        setData(updatedData);
        localStorage.setItem("uploadedData", JSON.stringify(updatedData));
      }
    } else {
      alert("No entries selected for deletion.");
    }
  };

  // Toggle "Select All" checkboxes
  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    data.forEach((_, index) => {
      document.getElementById(`checkbox-${index}`).checked = e.target.checked;
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Saved Documents</h2>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
          onClick={handleDeleteSelected}
        >
          Delete Selected
        </button>
        <div>
          <input
            type="checkbox"
            id="select-all"
            checked={selectAll}
            onChange={handleSelectAll}
            className="mr-2"
          />
          <label htmlFor="select-all" className="text-gray-700">
            Select All
          </label>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
        >
          <option value="">Select Filter</option>
          <option value="clientId">Client ID</option>
          <option value="gatNo">Gat No.</option>
          <option value="typeDoc">Type of Document</option>
          <option value="docNo">Document No.</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-white shadow rounded-md overflow-hidden">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="p-4 text-left">Select</th>
            <th className="p-4 text-left">Client ID</th>
            <th className="p-4 text-left">Village Name</th>
            <th className="p-4 text-left">Gat No.</th>
            <th className="p-4 text-left">Type of Document</th>
            <th className="p-4 text-left">Document No.</th>
            <th className="p-4 text-left">Year</th>
            <th className="p-4 text-left">Additional Option</th>
            <th className="p-4 text-left">Uploaded Documents</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="10" className="p-4 text-center text-gray-500">
                No matching data found.
              </td>
            </tr>
          ) : (
            filteredData.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    className="cursor-pointer"
                  />
                </td>
                <td className="p-4">{entry.clientId}</td>
                <td className="p-4">{entry.villageName}</td>
                <td className="p-4">{entry.gatNo}</td>
                <td className="p-4">{entry.typeDoc}</td>
                <td className="p-4">{entry.docNo}</td>
                <td className="p-4">{entry.year}</td>
                <td className="p-4">{entry.additionalOption}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {entry.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt="Document"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewClient;
