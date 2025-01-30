import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import avatar from "../images/profile.png";
import { useUniversalSearch } from "../store/store";
import { useAxios } from "../hook/fetch.hook";
import { Link } from "react-router-dom";
let Navigation = ({
  showSidebar,
  setShowSidebar,
  profile,
  activeTab,
  showProfile,
  setShowProfile,
  filters,
  inputSearch,
  setInputSearch,
  setFilterClientDetails,
  selectedFilter,
  setSelectedFilter,
  clientData,
  setShowSearch,
  globalData,
  setGlobalFData,
}) => {
  const { post, get } = useAxios();

  const handleOnChange = (e) => {
    const value = e.target.value;
    setInputSearch(value.toLowerCase());
    let filtered = clientData.filter((client) => {
      return (
        (client.clientId?.toLowerCase() || "").includes(value) ||
        (client.docNo?.toLowerCase() || "").includes(value) ||
        (client.fname?.toLowerCase() || "").includes(value) ||
        (client.mname?.toLowerCase() || "").includes(value) ||
        (client.lname?.toLowerCase() || "").includes(value) ||
        (client.email?.toLowerCase() || "").includes(value) ||
        (client.mobile?.toLowerCase() || "").includes(value) ||
        (client.caseType?.toLowerCase() || "").includes(value) ||
        (client.docType?.toLowerCase() || "").includes(value) ||
        (client.gender?.toLowerCase() || "").includes(value) ||
        (client.dob?.toLowerCase() || "").includes(value) ||
        (client.address?.state?.toLowerCase() || "").includes(value) ||
        (client.address?.city?.toLowerCase() || "").includes(value) ||
        (client.address?.village?.toLowerCase() || "").includes(value) ||
        (client.address?.pincode?.toLowerCase() || "").includes(value) ||
        (client.status?.toLowerCase() || "").includes(value) ||
        (client.fileUploaded?.toLowerCase() || "").includes(value)
      );
    });
    setFilterClientDetails(filtered);
    setSelectedFilter("All");
  };

  const handleFilter = (e) => {
    setSelectedFilter(e.target.value);
  };

  // universal search
  let search = useUniversalSearch((state) => state.search);
  let setSearch = useUniversalSearch((state) => state.setSearch);

  let handleSearch = (e) => {
    let value = e.target.value.toLowerCase();
    setSearch(value);
    let filtered = globalData.filter((client) => {
      return (
        (client.infoRecords?.[0]?._id?.toLowerCase() || "").includes(value) ||
        (client.infoRecords?.[0]?.documentNo?.toLowerCase() || "").includes(
          value
        ) ||
        (client.fname?.toLowerCase() || "").includes(value) ||
        (client.mname?.toLowerCase() || "").includes(value) ||
        (client.lname?.toLowerCase() || "").includes(value) ||
        (client.email?.toLowerCase() || "").includes(value) ||
        (client.mobile?.toLowerCase() || "").includes(value) ||
        (client.caseType?.toLowerCase() || "").includes(value) ||
        (client.infoRecords?.[0]?.gatNo?.toLowerCase() || "").includes(value) ||
        (client.infoRecords?.[0]?.year?.toLowerCase() || "").includes(value) ||
        (client.infoRecords?.[0]?.docType?.toLowerCase() || "").includes(
          value
        ) ||
        (client.dob?.toLowerCase() || "").includes(value) ||
        (client.address?.state?.toLowerCase() || "").includes(value) ||
        (client.address?.city?.toLowerCase() || "").includes(value) ||
        (client.address?.village?.toLowerCase() || "").includes(value) ||
        (client.address?.pincode?.toLowerCase() || "").includes(value) ||
        (client.status?.toLowerCase() || "").includes(value)
      );
    });
    setGlobalFData(filtered);

    if (value !== "") {
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-lg flex items-center justify-between w-full mx-auto h-[70px]">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={showSidebar ? faClose : faBars}
          className="text-2xl ml-7 cursor-pointer"
          onClick={() => {
            showSidebar ? setShowSidebar(false) : setShowSidebar(true);
          }}
        />
        <h1 className="ml-6 font-bold text-2xl">
          {profile.username || "Admin"}
        </h1>
        <Link
          className="text-3xl ml-3 cursor-pointer hover:text-green-600"
          to={`https://wa.me/9156824141?text=Hello%20there!`}
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </Link>
      </div>
      {/* universal search */}
      {activeTab === 0 && (
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearch}
            name="search"
            className="bg-white text-black w-[600px] h-[60px] rounded-xl outline-none pl-3 text-xl"
          />
        </div>
      )}

      {activeTab === 3 && (
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Search"
            value={inputSearch}
            onChange={handleOnChange}
            name="search"
            className="bg-white text-black w-[250px] h-[50px] rounded-l-xl outline-none pl-3 text-xl"
          />
          <select
            value={selectedFilter}
            onChange={handleFilter}
            name="filter"
            className="bg-white font-bold text-black cursor-pointer w-[200px] h-[50px] outline-none appearance-none px-2 text-[22px] rounded-r-xl text-center"
          >
            {filters.map((o, i) => (
              <option
                value={o.name}
                disabled={o.name === "" ? true : false}
                key={i}
              >
                {o.value}
              </option>
            ))}
          </select>
        </div>
      )}
      <img
        src={profile.profilePic || avatar}
        alt="profile pic"
        className="w-[50px] h-[50px] rounded-full mr-6 cursor-pointer"
        onClick={() => {
          showProfile ? setShowProfile(false) : setShowProfile(true);
        }}
      />
    </div>
  );
};

export default Navigation;
