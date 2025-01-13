import React from "react";

let Admin = () => {
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
        setFilterClientDetails={setFilterClientDetails}
        Crud={Crud}
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
              filterClientDetails={filterClientDetails}
              setFilterClientDetails={setFilterClientDetails}
              setCrud={setCrud}
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
          {activeTab === 3 && <AdminEmployee toast={toast} />}
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
        setFilterClientDetails={setFilterClientDetails}
        removeSelectedRecords={removeSelectedRecords}
        removeClient={removeClient}
      />
    </div>
  );
};

export default Admin;
