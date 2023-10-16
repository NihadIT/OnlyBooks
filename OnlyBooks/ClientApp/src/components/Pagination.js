import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxButtons = 7; // Максимальное количество кнопок пагинации

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = () => {
        if (totalPages <= maxButtons) {
            // Если общее количество страниц меньше или равно максимальному количеству кнопок, отображаем все
            return pageNumbers.map((pageNumber) => (
                <li
                    key={pageNumber}
                    className={pageNumber === currentPage ? 'active' : ''}
                >
                    <button onClick={() => onPageChange(pageNumber)}>
                        {pageNumber}
                    </button>
                </li>
            ));
        } else {
            // Иначе, отображаем текущую страницу, троеточие, и последнюю страницу слева
            let start, middle, end;
            const ellipsis = <li key="ellipsis">...</li>;

            if (currentPage <= maxButtons - 2) {
                // Если текущая страница ближе к началу
                start = pageNumbers.slice(0, maxButtons - 2);
                middle = ellipsis;
                end = pageNumbers.slice(-1);
            } else if (currentPage >= totalPages - (maxButtons - 2)) {
                // Если текущая страница ближе к концу
                start = pageNumbers.slice(0, 1);
                middle = ellipsis;
                end = pageNumbers.slice(-(maxButtons - 2));
            } else {
                // В остальных случаях
                start = pageNumbers.slice(0, 1);
                middle = ellipsis;
                end = pageNumbers.slice(currentPage - 2, currentPage + 1);
            }

            return [
                start.map((pageNumber) => (
                    <li
                        key={pageNumber}
                        className={pageNumber === currentPage ? 'active' : ''}
                    >
                        <button onClick={() => onPageChange(pageNumber)}>
                            {pageNumber}
                        </button>
                    </li>
                )),
                middle,
                end.map((pageNumber) => (
                    <li
                        key={pageNumber}
                        className={pageNumber === currentPage ? 'active' : ''}
                    >
                        <button onClick={() => onPageChange(pageNumber)}>
                            {pageNumber}
                        </button>
                    </li>
                )),
            ];
        }
    };

    return (
        <div className="pagination-container">
            <ul className="pagination">{renderPageNumbers()}</ul>
        </div>
    );
};

export default Pagination;
