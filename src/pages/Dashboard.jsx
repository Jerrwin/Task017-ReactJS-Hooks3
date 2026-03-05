import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import PatientCard from "../components/PatientCard";
import Pagination from "../components/Pagination";
import "../style.css";
import { ThemeContext } from "../context/ThemeContext";
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
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { Row, Col } from "react-bootstrap";

const PATIENTS_PER_PAGE = 3;

function Dashboard() {
  // Grab the theme and the toggle function from the global context
  const { theme, toggleTheme } = useContext(ThemeContext);

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

  // Tracks renders without causing infinite loops
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

  // BAD PERFORMANCE EXAMPLE: Fetching data without useEffect causes an infinite loop of re-renders!
  //fetchPatients();

  // 1. Runs ONCE on mount: fetch data & auto-focus search
  useEffect(() => {
    fetchPatients();
    // Requirement 1A: Auto-focus
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // 2. Tracks the previous search term whenever 'search' changes
  useEffect(() => {
    if (prevSearchRef.current !== search) {
      setLastSearch(prevSearchRef.current);
    }
    prevSearchRef.current = search;
  }, [search]);

  // 3. Reset to page 1 whenever search or sort order changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOrder]);

  // --- NORMAL FUNCTIONS (Attached to standard HTML buttons, no hooks needed) ---
  const refreshPatients = () => {
    fetchPatients();
  };

  const handleClearSearch = () => {
    setSearch("");
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const scrollToTop = () => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // --- MEMOIZED FUNCTIONS (Protects React.memo children) ---

  // useCallback caches this function to prevent <PatientCard /> from re-rendering
  const handleSelect = useCallback((patient) => {
    setSelectedPatient(patient);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // BAD PERFORMANCE EXAMPLE: Without useCallback here, typing in the search
  // bar forces the pagination buttons to redraw uselessly!
  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  //   if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  // };

  // useCallback caches this function to prevent <Pagination /> from re-rendering
  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
    },
    [], // no dependencies — setCurrentPage and topRef are both stable
  );

  // BAD PERFORMANCE EXAMPLE: Filtering/Sorting without useMemo runs on
  // EVERY keystroke, slowing down the app with large datasets.
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

  // useMemo caches heavy filtering/sorting. Only re-runs if dependencies change.
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

  // useMemo caches array slicing for the current page
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * PATIENTS_PER_PAGE;
    return filteredPatients.slice(start, start + PATIENTS_PER_PAGE);
  }, [filteredPatients, currentPage]);

  // --- NORMAL VARIABLES (Basic math is instant, useMemo overhead is wasted here) ---
  const totalPages = Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE);
  const totalPatients = filteredPatients.length;

  return (
    <div className="dashboard-container" ref={topRef}>
      {/* 1. Header Section */}
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
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title="Toggle Dark Mode"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>

          <div className="render-counter" title="Total component renders">
            <span className="label">Render Count:</span>
            <span className="value">{renderCountRef.current}</span>
          </div>
        </div>
      </header>

      {/* 2. Controls Section */}
      <div className="controls-section">
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

        <div className="controls-row-actions">
          {lastSearch && (
            <p className="previous-search">
              Previous Search: <strong>{lastSearch}</strong>
            </p>
          )}
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

      {/* 3. Selected Patient Banner */}
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

      {/* 4. Stats Section */}
      <div className="stats-section">
        <h3>
          Patient Directory <span className="badge">{totalPatients}</span>
        </h3>
        <p className="page-info">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* 5. Patient Grid (Using Bootstrap) */}
      <Row className="g-4 mb-5">
        {paginatedPatients.map((patient) => (
          <Col key={patient.id} xs={12} md={6} lg={4}>
            <PatientCard
              patient={patient}
              handleSelect={handleSelect}
              searchTerm={search}
            />
          </Col>
        ))}
        {filteredPatients.length === 0 && (
          <Col xs={12}>
            <div className="no-results">
              No patients found matching your search.
            </div>
          </Col>
        )}
      </Row>

      {/* 6. Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}

      {/* Scroll to top */}
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
