import React, { useState } from "react";

function PreviewClient() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [villageName, setVillageName] = useState("");
  const [gatNo, setGatNo] = useState("");
  const [typeDoc, setTypeDoc] = useState("1");
  const [notaryType, setNotaryType] = useState("");
  const [docNo, setDocNo] = useState("");
  const [docYear, setDocYear] = useState("");

  const MAX_FILES = 10;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedFiles.length > MAX_FILES) {
      alert(`You can upload a maximum of ${MAX_FILES} documents.`);
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDeleteImage = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleFinalClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEditClick = () => {
    document.getElementById("file-upload").click();
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl text-center mb-6">Upload Tab</h2>
        <form>
          {/* Client ID */}
          <div className="mb-4">
            <label htmlFor="client-id" className="block font-bold mb-2">
              Client ID
            </label>
            <input
              type="text"
              id="client-id"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>

          {/* Village Name */}
          <div className="mb-4">
            <label htmlFor="village-name" className="block font-bold mb-2">
              Village Name
            </label>
            <input
              type="text"
              id="village-name"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter Village Name"
              value={villageName}
              onChange={(e) => setVillageName(e.target.value)}
            />
          </div>

          {/* Gat No. */}
          <div className="mb-4">
            <label htmlFor="gat-no" className="block font-bold mb-2">
              Gat No.
            </label>
            <input
              type="text"
              id="gat-no"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter Gat No."
              value={gatNo}
              onChange={(e) => setGatNo(e.target.value)}
            />
          </div>

          {/* Type of Document */}
          <div className="mb-4">
            <label htmlFor="type-doc" className="block font-bold mb-2">
              Type of Document
            </label>
            <select
              id="type-doc"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={typeDoc}
              onChange={(e) => setTypeDoc(e.target.value)}
            >
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>

          {/* Notary / Sub-Registrar / Only Type */}
          <div className="mb-4">
            <label className="block font-bold mb-2">
              Notary / Sub-Registrar / Only Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notary-type"
                  value="notary"
                  checked={notaryType === "notary"}
                  onChange={(e) => setNotaryType(e.target.value)}
                />
                <span className="ml-2">Notary</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notary-type"
                  value="subreg"
                  checked={notaryType === "subreg"}
                  onChange={(e) => setNotaryType(e.target.value)}
                />
                <span className="ml-2">Sub-Registrar</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notary-type"
                  value="only"
                  checked={notaryType === "only"}
                  onChange={(e) => setNotaryType(e.target.value)}
                />
                <span className="ml-2">Only Type</span>
              </label>
            </div>
          </div>

          {/* Document No. and Year */}
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="doc-no" className="block font-bold mb-2">
                Document No.
              </label>
              <input
                type="text"
                id="doc-no"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Document No."
                value={docNo}
                onChange={(e) => setDocNo(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="doc-year" className="block font-bold mb-2">
                Year
              </label>
              <select
                id="doc-year"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={docYear}
                onChange={(e) => setDocYear(e.target.value)}
              >
                <option value="">Select Year</option>
                {[...Array(2025 - 1940)].map((_, index) => (
                  <option key={index} value={2025 - index}>
                    {2025 - index}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-md mt-6">
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="bg-purple-600 text-white py-2 px-4 rounded-md cursor-pointer"
            >
              + Upload Files
            </label>
          </div>

          {/* Preview */}
          <div className="grid grid-cols-4 gap-4 mt-6" id="preview">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-md border border-gray-300"
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {/* Actions */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-green-500 text-white py-2 px-4 rounded-md"
              onClick={handleFinalClick}
            >
              Final
            </button>
            <button
              type="button"
              className="bg-orange-500 text-white py-2 px-4 rounded-md"
              onClick={handleEditClick}
            >
              Add img
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Upload
            </button>
          </div>
        </form>
      </div>

      {/* Modal for Document Preview */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 text-center"
            >
              &times;
            </button>
            <h3 className="text-xl text-center mb-4">
              Uploaded Document Preview
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {selectedFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt="modal preview"
                  className="w-full h-24 object-cover rounded-md border border-gray-300"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewClient;
