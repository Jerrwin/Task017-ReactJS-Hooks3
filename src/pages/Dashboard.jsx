import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import PatientCard from "../components/PatientCard";
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
} from "react-icons/fa";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(
    new Date().toLocaleTimeString(),
  );

  const searchInputRef = useRef(null);
  const renderCountRef = useRef(0);
  const topRef = useRef(null);

  // Incrementing the ref - Requirement 1B
  renderCountRef.current = renderCountRef.current + 1;

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

  // Requirement 3A: useMemo for filtering
  const filteredPatients = useMemo(() => {
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [patients, search]);

  // Requirement 3B: useMemo for calculations
  const totalPatients = useMemo(
    () => filteredPatients.length,
    [filteredPatients],
  );

  // Requirement 1C: scrollToTop
  const scrollToTop = () => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
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
        </div>
        <button className="btn-primary" onClick={refreshPatients}>
          <FaSyncAlt /> Refresh Data
        </button>
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
      </div>

      <div className="patients-grid">
        {filteredPatients.map((patient) => (
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
