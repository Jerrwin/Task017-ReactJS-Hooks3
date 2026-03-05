import styled from "styled-components";

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 10px 0 60px;
`;

export const PageButton = styled.button`
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  
  /* DYNAMIC CSS: Changes if the button is the "active" page */
  border: 1.5px solid ${(props) => (props.$active ? "var(--primary)" : "var(--border)")};
  background-color: ${(props) => (props.$active ? "var(--primary)" : "var(--card-bg)")};
  color: ${(props) => (props.$active ? "white" : "var(--text-muted)")};
  box-shadow: ${(props) => (props.$active ? "0 2px 8px rgba(14, 165, 233, 0.35)" : "none")};
  
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
    background-color: var(--primary-light);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;