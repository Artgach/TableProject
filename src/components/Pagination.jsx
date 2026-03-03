import React from 'react';

function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.ceil(total / limit);

  const getPageNumbers = () => {
    let from = Math.max(1, page - 2);
    let to = Math.min(totalPages, page + 2);

    if (to - from + 1 < 5) {
      if (from === 1) {
        to = Math.min(totalPages, from + 4);
      }
      if (to === totalPages) {
        from = Math.max(1, to - 4);
      }
    }

    const arr = [];
    for (let i = from; i <= to; ++i) arr.push(i);
    return arr;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center align-items-center my-3">
      <button
        className="btn btn-outline-primary btn-sm mx-1"
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
      >
        « Назад
      </button>
      {getPageNumbers().map(n => (
        <button
          key={n}
          className={`btn mx-1 btn-sm ${n === page ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onPageChange(n)}
        >
          {n}
        </button>
      ))}
      <button
        className="btn btn-outline-primary btn-sm mx-1"
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Вперёд »
      </button>
    </div>
  );
}

export default Pagination;