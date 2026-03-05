import React, { memo } from "react";
import { FaEnvelope, FaPhone, FaHospital } from "react-icons/fa";
import { MdPerson } from "react-icons/md";

import {
  CardWrapper,
  CardHeader,
  Avatar,
  PatientName,
  CardBody,
  DetailRow,
  SelectButton,
} from "./PatientCard.styles";

const PatientCard = memo(({ patient, handleSelect, searchTerm }) => {
  console.log(`Child Rendered: ${patient.name}`);

  // Helper function to highlight text
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
    <CardWrapper>
      <CardHeader>
        <Avatar>
          <MdPerson />
        </Avatar>
        <PatientName>
          {getHighlightedText(patient.name, searchTerm)}
        </PatientName>
      </CardHeader>

      <CardBody>
        <DetailRow>
          <FaEnvelope />
          {getHighlightedText(patient.email, searchTerm)}
        </DetailRow>
        <DetailRow>
          <FaPhone />
          {patient.phone}
        </DetailRow>
        <DetailRow>
          <FaHospital />
          {patient.company.name}
        </DetailRow>
      </CardBody>

      <SelectButton onClick={() => handleSelect(patient)}>
        View Patient Record
      </SelectButton>
    </CardWrapper>
  );
});

export default PatientCard;
