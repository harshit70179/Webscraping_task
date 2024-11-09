import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  // Function to generate an array of page numbers with ellipses
  const generatePageNumbers = () => {
    const maxVisiblePages = 5; // Maximum number of visible page numbers
    const pages = [];
    
    // If total pages are less than or equal to the maximum visible pages, show all pages
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Otherwise, calculate the start and end pages to display
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // If the start page is near the end, adjust it
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = endPage - maxVisiblePages + 1;
      }
      
      // If the start page is not 1, add ellipsis
      if (startPage !== 1) {
        pages.push(1);
        if (startPage !== 2) {
          pages.push('...');
        }
      }
      
      // Add visible page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // If the end page is not the last page, add ellipsis
      if (endPage !== totalPages) {
        if (endPage !== totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <nav aria-label="Page navigation example " className="mt-3 ml-auto d-flex">
      <ul className="pagination ml-auto">
        {/* Previous page button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            aria-label="Previous"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((number, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === number ? 'active' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next page button */}
        <li
          className={`page-item ${
            currentPage === totalPages ? 'disabled' : ''
          }`}
        >
          <button
            className="page-link"
            aria-label="Next"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
