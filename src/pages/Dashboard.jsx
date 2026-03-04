import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import PatientCard from "../components/PatientCard";
import Pagination from "../components/Pagination";
import "../style.css";
import {
  FaArrowUp,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaHospital,
  FaUserMd,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";

const PATIENTS_PER_PAGE = 3;

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [lastSearch, setLastSearch] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState(
    new Date().toLocaleTimeString(),
  );
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const searchInputRef = useRef(null);
  const prevSearchRef = useRef("");
  const renderCountRef = useRef(0);
  //const [renderCountRef, setRenderCount] = useState(0);
  const topRef = useRef(null);

  // Incrementing the ref - Requirement 1B
  renderCountRef.current = renderCountRef.current + 1;
  //setRenderCount((prev) => prev + 1);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users",
      );
      setPatients(response.data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    // Requirement 1A: Auto-focus
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (prevSearchRef.current !== search) {
      setLastSearch(prevSearchRef.current);
    }

    prevSearchRef.current = search;
  }, [search]);

  // Reset to page 1 whenever search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOrder]);

  // Requirement 2A: useCallback
  const refreshPatients = useCallback(() => {
    fetchPatients();
  }, []);

  // Requirement 2B: useCallback passed to children
  const handleSelect = useCallback((patient) => {
    setSelectedPatient(patient);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Without useCallback — new function created every render
  // const handleSelect = (patient) => {
  //   setSelectedPatient(patient);
  //   if (topRef.current) {
  //     topRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  // Requirement 2B: useCallback — clears search input and refocuses it
  const handleClearSearch = useCallback(() => {
    setSearch("");
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // Requirement 2B: useCallback passed to Pagination child
  // Without useCallback, a new function reference would be created on every Dashboard render,
  // causing the memoized <Pagination /> to re-render unnecessarily even if page/totalPages didn't change.
  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
    },
    [], // no dependencies — setCurrentPage and topRef are both stable
  );

  // This is how it would look without useMemo
  // Note: This will run on every render, which can be inefficient with large datasets
  // const filteredPatients = (() => {
  //   console.log("(Without useMemo)Filtering + Sorting running...");
  //   const filtered = patients.filter(
  //     (p) =>
  //       p.name.toLowerCase().includes(search.toLowerCase()) ||
  //       p.email.toLowerCase().includes(search.toLowerCase()),
  //   );
  //   return [...filtered].sort((a, b) =>
  //     sortOrder === "asc"
  //       ? a.name.localeCompare(b.name)
  //       : b.name.localeCompare(a.name),
  //   );
  // })();

  // Requirement 3A: useMemo for filtering
  const filteredPatients = useMemo(() => {
    console.log("Filtering + Sorting running...");
    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()),
    );

    return [...filtered].sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
  }, [patients, search, sortOrder]);

  // useMemo: total pages derived from filtered list
  const totalPages = useMemo(
    () => Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE),
    [filteredPatients],
  );

  // useMemo: only the 3 cards for the current page
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * PATIENTS_PER_PAGE;
    return filteredPatients.slice(start, start + PATIENTS_PER_PAGE);
  }, [filteredPatients, currentPage]);

  // Requirement 3B: useMemo for calculations
  const totalPatients = useMemo(
    () => filteredPatients.length,
    [filteredPatients],
  );

  // Requirement 1C: scrollToTop
  const scrollToTop = () => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="dashboard-container" ref={topRef}>
      {/* 1. Enhanced Header Section */}
      <header className="main-header">
        <div className="header-left">
          <div className="logo-icon">
            <FaUserMd />
          </div>
          <div className="title-area">
            <h1>Healthcare Records</h1>
            <div className="status-indicator">
              <span className="dot"></span>
              <p>System Live • Last Sync: {lastRefreshed}</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="render-counter" title="Total component renders">
            <span className="label">Render Count:</span>
            <span className="value">{renderCountRef.current}</span>
          </div>
        </div>
      </header>

      {/* 2. Controls */}
      <div className="controls-section">
        {/* Row 1: Full-width search bar */}
        <div className="controls-row-search">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* Clear button — useCallback keeps reference stable across renders */}
            {search && (
              <button
                className="search-clear-btn"
                onClick={handleClearSearch}
                title="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Previous search tag + sort + refresh */}
        <div className="controls-row-actions">
          {lastSearch && (
            <p className="previous-search">
              Previous Search: <strong>{lastSearch}</strong>
            </p>
          )}
          {/* Sort Button */}
          <button
            className="btn-sort"
            onClick={toggleSort}
            title="Toggle sort order"
          >
            {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
            <span>{sortOrder === "asc" ? "A → Z" : "Z → A"}</span>
          </button>
          <button className="btn-primary" onClick={refreshPatients}>
            <FaSyncAlt /> Refresh Data
          </button>
        </div>
      </div>

      {/* 3. Selected Patient Hero Banner */}
      {selectedPatient && (
        <div className="selected-patient-banner">
          <div className="banner-header">
            <h2>Active Patient File</h2>
            <button
              className="close-btn"
              onClick={() => setSelectedPatient(null)}
            >
              <FaTimes /> Close
            </button>
          </div>
          <div className="banner-content">
            <h3 className="banner-name">{selectedPatient.name}</h3>
            <div className="banner-details">
              <span>
                <FaEnvelope className="detail-icon" /> {selectedPatient.email}
              </span>
              <span>
                <FaPhone className="detail-icon" /> {selectedPatient.phone}
              </span>
              <span>
                <FaHospital className="detail-icon" />{" "}
                {selectedPatient.company.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Stats & Grid */}
      <div className="stats-section">
        <h3>
          Patient Directory <span className="badge">{totalPatients}</span>
        </h3>
        <p className="page-info">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="patients-grid">
        {paginatedPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            handleSelect={handleSelect}
            searchTerm={search}
          />
        ))}
        {filteredPatients.length === 0 && (
          <div className="no-results">
            No patients found matching your search.
          </div>
        )}
      </div>

      {/* 6. Pagination Controls — extracted into its own memoized component.
           handlePageChange is wrapped in useCallback so Pagination only re-renders
           when currentPage or totalPages actually changes, not on every Dashboard render. */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}

      <button
        className="scroll-top-btn"
        onClick={scrollToTop}
        title="Scroll To Top"
      >
        <FaArrowUp />
      </button>
    </div>
  );
}

export default Dashboard;
