import React, { memo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { PaginationContainer, PageButton } from "./Pagination.styles";

const Pagination = memo(({ currentPage, totalPages, handlePageChange }) => {
  console.log("Pagination Rendered");

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </PageButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PageButton
          key={page}
          /* Pass the dynamic prop to the CSS! */
          $active={currentPage === page}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </PageButton>
      ))}

      <PageButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </PageButton>
    </PaginationContainer>
  );
});

export default Pagination;
