import React, { memo } from "react";
import { FaEnvelope, FaPhone, FaHospital } from "react-icons/fa";
import { MdPerson } from "react-icons/md";

const PatientCard = memo(({ patient, handleSelect, searchTerm }) => {
  console.log(`Child Rendered: ${patient.name}`);

  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="highlight-text">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </span>
    );
  };

  return (
    <div className="patient-card">
      <div className="card-header">
        <div className="avatar-circle">
          <MdPerson />
        </div>
        <h3 className="patient-name">
          {getHighlightedText(patient.name, searchTerm)}
        </h3>
      </div>

      <div className="card-body">
        <p className="patient-detail">
          <FaEnvelope className="detail-icon" />
          {getHighlightedText(patient.email, searchTerm)}
        </p>
        <p className="patient-detail">
          <FaPhone className="detail-icon" />
          {patient.phone}
        </p>
        <p className="patient-detail">
          <FaHospital className="detail-icon" />
          {patient.company.name}
        </p>
      </div>

      {/* Notice we are passing the WHOLE 'patient' object here now! */}
      <button className="select-btn" onClick={() => handleSelect(patient)}>
        View Patient Record
      </button>
    </div>
  );
});

export default PatientCard;
