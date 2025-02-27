import { create } from "zustand";

// stores
export const useClientStore = create((set) => ({
  clientData: [],
  setClientData: (data) => set({ clientData: data }),
  removeClient: (cid) =>
    set((state) => ({
      clientData: state.clientData.filter((client) => client._id !== cid),
    })),
}));

export let useClientDocumentsStore = create((set) => ({
  clientDocs: {
    userId: null,
    document: [],
    info: null,
  },
  setClientDocs: (data) => set({ clientDocs: data }),
}));

export let useEmployeeStore = create((set) => ({
  employeeData: [],
  setEmployeeData: (data) => set({ employeeData: data }),
  removeEmployee: (eid) =>
    set((state) => ({
      employeeData: state.employeeData.filter(
        (employee) => employee._id !== eid
      ),
    })),
}));

export let useUploads = create((set) => ({
  uploadedData: [],
  setUploadedData: (data) => set({ uploadedData: data }),
  removeUploadedData: (id) =>
    set((state) => ({
      uploadedData: state.uploadedData.filter((upload) => upload._id !== id),
    })),
}));

export let useGlobal = create((set) => ({
  globalData: [],
  setGlobalData: (data) => set({ globalData: data }),
  removeGlobalData: (id) =>
    set((state) => ({
      globalData: state.globalData.filter((upload) => upload._id !== id),
    })),
}));
export let useGlobalFilter = create((set) => ({
  globalFData: [],
  setGlobalFData: (data) => set({ globalFData: data }),
  removeGlobalFData: (id) =>
    set((state) => ({
      globalFData: state.globalFData.filter((upload) => upload._id !== id),
    })),
}));

export let useEvent = create((set) => ({
  events: [],
  setEvents: (data) => set({ events: data }),
  removeEvents: (id) =>
    set((state) => ({ events: state.events.filter((t) => t._id !== id) })),
}));

export let useSelectRecords = create((set) => ({
  selectedRecords: [],
  setSelectedRecords: (data) => set({ selectedRecords: data }),
  removeSelectedRecords: (id) =>
    set((state) => ({
      selectedRecords: state.selectedRecords.filter((t) => t !== id),
    })),
}));

const role = localStorage.getItem("role");
// states
export let useActiveTab = create((set) => ({
  activeTab:
    role === "Admin"
      ? parseInt(localStorage.getItem("activeTab")) || 0
      : parseInt(localStorage.getItem("activeTabE")) || 0,
  setActiveTab: (data) => set({ activeTab: data }),
}));

export let useAddDocument = create((set) => ({
  showAddDocument: false,
  setShowAddDocument: (data) => set({ showAddDocument: data }),
}));

export let useShowProfile = create((set) => ({
  showProfile: false,
  setShowProfile: (data) => set({ showProfile: data }),
}));

export let useSidebar = create((set) => ({
  showSidebar: false,
  setShowSidebar: (data) => set({ showSidebar: data }),
}));

export let useFilteredData = create((set) => ({
  filteredData: [],
  setFilteredData: (data) => set({ filteredData: data }),
}));

export let useProfile = create((set) => ({
  profile: [],
  setProfile: (data) => set({ profile: data }),
}));

export let useEditor = create((set) => ({
  showEditor: false,
  setShowEditor: (data) => set({ showEditor: data }),
}));

export let useInput = create((set) => ({
  inputSearch: "",
  setInputSearch: (data) => set({ inputSearch: data }),
}));

export let useUniversalSearch = create((set) => ({
  search: "",
  setSearch: (data) => set({ search: data }),
}));

export let useShowSearchResults = create((set) => ({
  showSearch: false,
  setShowSearch: (data) => set({ showSearch: data }),
}));
export let useFilter = create((set) => ({
  selectedFilter: "Visible Clients",
  setSelectedFilter: (data) => set({ selectedFilter: data }),
}));

export let useOperation = create((set) => ({
  operation: false,
  setOperation: (data) => set({ operation: data }),
}));
