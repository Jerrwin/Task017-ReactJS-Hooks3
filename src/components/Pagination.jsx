import React, { memo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Requirement 2B: useCallback passed to children
// This component receives handlePageChange as a stable useCallback reference from Dashboard.
// Because of memo + stable prop, this component won't re-render unless page/totalPages actually changes.
const Pagination = memo(({ currentPage, totalPages, handlePageChange }) => {
  console.log("Pagination Rendered");

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`page-btn ${currentPage === page ? "active" : ""}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
});

export default Pagination;
