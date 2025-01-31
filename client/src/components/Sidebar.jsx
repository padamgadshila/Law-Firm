import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUser,
  faCalendarDays,
  faGears,
  faChartLine,
  faGear,
  faUpload,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { useAxios } from "../hook/fetch.hook";
import { getToken } from "../helper/getCookie";
import Footer from "./Footer";
let Sidebar = ({
  showSidebar,
  activeTab,
  setActiveTab,
  clientData,
  setClientData,
}) => {
  const role = localStorage.getItem("role");
  let [filteredTabs, setFilteredTabs] = useState([]);
  let tabs = [
    {
      name: "Dashboard",
      icon: faTachometerAlt,
      option: [],
      roles: ["Admin"],
    },
    {
      name: "Upload",
      icon: faUpload,
      option: [],
      roles: ["Admin", "Employee"],
    },
    {
      name: "Documents",
      icon: faFile,
      option: [],
      roles: ["Admin", "Employee"],
    },
    {
      name: "Client Info",
      icon: faUser,
      option: [{ name: "Add Client Info", link: "/addClient" }],
      roles: ["Admin", "Employee"],
    },
    {
      name: "Add Event",
      icon: faCalendarDays,
      option: [],
      roles: ["Admin"],
    },
    { name: "Statistics", icon: faChartLine, option: [], roles: ["Admin"] },
    { name: "Others", icon: faGears, option: ["Admin"] },
    {
      name: "Settings",
      icon: faGear,
      option: [{ name: "Add employee", link: "/addEmployee" }],
      roles: ["Admin"],
    },
  ];
  useEffect(() => {
    setFilteredTabs(tabs.filter((tab) => tab.roles?.includes(role)));
  }, []);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const { get } = useAxios();
  const token = getToken();
  // searchbar
  const [searchInput, setSearchInput] = useState("");
  const [filteredClients, setFilteredClients] = useState(clientData);
  let [showResult, setShowResult] = useState(false);
  const handleSearch = (e) => {
    const value = e.target.value;

    if (value !== "") {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
    setSearchInput(value.toLowerCase());
    let filtered = clientData.filter((client) => {
      return (
        client._id.toLowerCase().includes(value) ||
        client.fname.toLowerCase().includes(value) ||
        client.mname.toLowerCase().includes(value) ||
        client.lname.toLowerCase().includes(value)
      );
    });
    setFilteredClients(filtered);
  };

  useEffect(() => {
    setFilteredClients(clientData);
  }, [clientData]);

  const getClientData = async () => {
    try {
      const { data, status } = await get("/api/getClients", token);
      if (status === 200) {
        setClientData(data.clientData);
      }
    } catch (error) {
      console.log(error.response?.data?.error || "Error fetching data.");
    }
  };

  useEffect(() => {
    getClientData();
  }, []);

  return (
    <div
      className={`bg-[#2d3748] z-10 w-[270px] h-[calc(100vh-70px)] fixed p-2 transform transition-all duration-300 ease-in-out ${
        showSidebar ? "translate-x-0" : "translate-x-[-100%]"
      }`}
    >
      <div className="w-full px-2">
        <input
          type="text"
          placeholder="Client Name"
          value={searchInput}
          onChange={handleSearch}
          className="w-full h-[50px] rounded-md outline-none px-5 text-xl shadow-md"
        />
      </div>
      <div
        className={`w-[calc(100%-20px)] absolute top-16 left-1/2 -translate-x-1/2 h-full bg-white px-2 rounded-md ${
          showResult ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ul>
          {filteredClients.length > 0 ? (
            filteredClients.map((client, i) => (
              <li
                className="text-xl my-2 p-2 hover:bg-gray-300 rounded-md cursor-pointer"
                key={i}
              >
                {client.fname} {client.mname} {client.lname}
              </li>
            ))
          ) : (
            <li>No Clients Found</li>
          )}
        </ul>
      </div>
      <ul className="text-white">
        {filteredTabs.map((tab, i) => (
          <React.Fragment key={i}>
            <li
              key={i}
              className={`flex items-center my-2 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-700" ${
                activeTab === i ? "bg-gray-600" : " "
              }`}
              onClick={() => {
                setActiveTab(i);

                handleDropdownToggle(i);
              }}
            >
              <FontAwesomeIcon
                icon={tab.icon}
                className="text-[22px] w-[20px] h-[23px]"
              />
              <span className="inline-block ml-5 text-[23px]">{tab.name}</span>
            </li>
            {activeDropdown === i && tab.option.length > 0 && (
              <ul className="ml-10 border-l-4 border-gray-600">
                {tab.option.map((subTab, index) => (
                  <li
                    className="cursor-pointer text-xl px-6 hover:bg-gray-700 rounded-md"
                    key={index}
                  >
                    {subTab.link ? (
                      <Link to={subTab.link}>{subTab.name}</Link>
                    ) : (
                      <button onClick={subTab.click}>{subTab.name}</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default Sidebar;
