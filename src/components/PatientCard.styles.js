// src/components/PatientCard.styles.js
import styled from "styled-components";

export const CardWrapper = styled.div`
  background: ${(props) => props.theme.cardBg};
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => props.theme.primaryLight};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 15px;
`;

export const Avatar = styled.div`
  width: 45px;
  height: 45px;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
`;

export const PatientName = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  color: var(--text-main);
`;

export const CardBody = styled.div`
  flex-grow: 1;
`;

export const DetailRow = styled.p`
  margin: 0 0 12px 0;
  color: var(--text-muted);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #94a3b8;
  }
`;

export const SelectButton = styled.button`
  margin-top: 20px;
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: var(--primary);
    color: white;
  }
`;