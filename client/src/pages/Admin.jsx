import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  useActiveTab,
  useAddDocument,
  useClientStore,
  useEditor,
  useEvent,
  useFilter,
  useFilteredData,
  useInput,
  useOperation,
  useProfile,
  useSelectRecords,
  useShowProfile,
  useSidebar,
} from "../store/store";
import Profile from "../components/Profile";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Client from "../components/Client";
import Employee from "../components/Employee";
import Documents from "../components/Documents";
import Editor from "../components/Editor";
import AddEvent from "../components/AddEvent";

let Admin = () => {
  // import all the states
  const navigate = useNavigate();
  const activeTab = useActiveTab((state) => state.activeTab);
  const setActiveTab = useActiveTab((state) => state.setActiveTab);

  const showProfile = useShowProfile((state) => state.showProfile);
  const setShowProfile = useShowProfile((state) => state.setShowProfile);

  const profile = useProfile((state) => state.profile);
  const setProfile = useProfile((state) => state.setProfile);

  const showSidebar = useSidebar((state) => state.showSidebar);
  const inputSearch = useInput((state) => state.inputSearch);

  const setInputSearch = useInput((state) => state.setInputSearch);
  const setShowSidebar = useSidebar((state) => state.setShowSidebar);

  const selectedFilter = useFilter((state) => state.selectedFilter);
  const setSelectedFilter = useFilter((state) => state.setSelectedFilter);

  const showAddDocument = useAddDocument((state) => state.showAddDocument);
  const setShowAddDocument = useAddDocument(
    (state) => state.setShowAddDocument
  );

  let clientData = useClientStore((state) => state.clientData);
  let setClientData = useClientStore((state) => state.setClientData);
  let removeClient = useClientStore((state) => state.removeClient);

  let filteredData = useFilteredData((state) => state.filteredData);
  let setFilteredData = useFilteredData((state) => state.setFilteredData);

  let events = useEvent((state) => state.events);
  let setEvents = useEvent((state) => state.setEvents);

  let operation = useOperation((state) => state.operation);
  let setOperation = useOperation((state) => state.setOperation);

  let selectedRecords = useSelectRecords((state) => state.selectedRecords);
  let setSelectedRecords = useSelectRecords(
    (state) => state.setSelectedRecords
  );
  let removeSelectedRecords = useSelectRecords(
    (state) => state.removeSelectedRecords
  );

  let showEditor = useEditor((state) => state.showEditor);
  let setShowEditor = useEditor((state) => state.setShowEditor);

  // set all the data

  // TABS DATA
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    const storedCid = localStorage.getItem("cid");
    if (storedTab !== null) {
      setActiveTab(Number(storedTab));
    }
    if (storedCid !== null) {
      localStorage.removeItem("cid");
    }
  }, [setActiveTab]);

  // Function to show add document page
  let handleAddDocumentDisplay = () =>
    showAddDocument ? setShowAddDocument(false) : setShowAddDocument(true);
  // Filters
  let filters = [
    { name: "", value: "Select Filter" },
    { name: "All", value: "All" },
    { name: "", value: "Document Type" },
    { name: "Notary", value: "Notary" },
    { name: "Subreg", value: "Subreg" },
    { name: "Only Type", value: "Only Type" },
    { name: "", value: "Select Status" },
    { name: "Active", value: "Active" },
    { name: "Pending", value: "Pending" },
    { name: "Completed", value: "Completed" },
    { name: "", value: "Clients Type" },
    { name: "Hidden Clients", value: "Hidden Clients" },
    { name: "Visible Clients", value: "Visible Clients" },
  ];
  useEffect(() => {
    setSelectedFilter("Visible Clients");
  }, [clientData, setSelectedFilter]);

  // function to show editor page
  let handleShowEditor = () =>
    showEditor ? setShowEditor(false) : setShowEditor(true);

  return (
    <div className="w-full h-screen relative">
      <Toaster />
      {/* profile */}

      <div
        className={`absolute border w-[350px] h-[380px] rounded-3xl bg-white z-10 shadow-lg overflow-hidden right-5 transition-all ${
          showProfile
            ? "top-[70px] opacity-[1] visible"
            : "top-[120px] opacity-0 invisible"
        }`}
      >
        <Profile
          toast={toast}
          Link={Link}
          profile={profile}
          setProfile={setProfile}
          navigate={navigate}
        />
      </div>

      {/* Navigation bar */}
      <Navigation
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        profile={profile}
        activeTab={activeTab}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        filters={filters}
        inputSearch={inputSearch}
        setInputSearch={setInputSearch}
        setFilterClientDetails={setFilteredData}
        operation={operation}
        selectedRecords={selectedRecords}
        removeSelectedRecords={removeSelectedRecords}
        handleShowEditor={handleShowEditor}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        clientData={clientData}
        setClientData={setClientData}
      />
      {/* Main Page */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          showSidebar={showSidebar}
          handleAddDocumentDisplay={handleAddDocumentDisplay}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          clientData={clientData}
          setClientData={setClientData}
        />
        {/* Content Area */}
        <div
          className={`relative overflow-y-scroll  h-[calc(100vh-70px)]  border-gray-300 transition-all duration-300 ease-in-out transform ${
            showSidebar ? "w-[calc(100%-270px)] translate-x-[270px]" : "w-full"
          }`}
        >
          {activeTab === 0 && (
            <Dashboard events={events} setEvents={setEvents} toast={toast} />
          )}

          {activeTab === 1 && (
            <Client
              toast={toast}
              clientData={clientData}
              filteredData={filteredData}
              setFilteredData={setFilteredData}
              setOperation={setOperation}
              selectedRecords={selectedRecords}
              setSelectedRecords={setSelectedRecords}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              removeClient={removeClient}
              setClientData={setClientData}
            />
          )}
          {/* Add Event */}
          {activeTab === 2 && (
            <AddEvent toast={toast} events={events} setEvents={setEvents} />
          )}
          {activeTab === 3 && <div>Statics</div>}
          {activeTab === 4 && <div>Others</div>}
          {activeTab === 5 && <Employee toast={toast} />}
        </div>
      </div>

      {/* Add Documents */}

      <Documents
        showAddDocument={showAddDocument}
        handleAddDocumentDisplay={handleAddDocumentDisplay}
        clientData={clientData}
      />

      {/* Editor */}
      <Editor
        showEditor={showEditor}
        handleShowEditor={handleShowEditor}
        selectedRecords={selectedRecords}
        setFilteredData={setFilteredData}
        removeSelectedRecords={removeSelectedRecords}
        removeClient={removeClient}
      />
    </div>
  );
};

export default Admin;
