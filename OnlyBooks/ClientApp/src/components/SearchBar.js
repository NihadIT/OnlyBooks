import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const searchResultsRef = useRef(null); // Создаем ref для области результатов

    const handleSearch = async (value) => {
        try {
            const response = await axios.get(`/api/search/SearchBooks?searchTerm=${value}`);
            setSearchResults(response.data);
            setShowResults(true);
        } catch (error) {
            console.error('Ошибка при выполнении поиска:', error);
        }
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        handleSearch(value);
    };

    // Добавляем обработчик клика на всю страницу
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <form className="form-search" onSubmit={(e) => { e.preventDefault(); handleSearch(searchTerm); }}>
            <input
                type="text"
                placeholder="Поиск книги"
                aria-label="Поиск книги"
                value={searchTerm}
                onChange={handleChange}
            />
            <button type="submit">
                <img src="/images/icons/lupa.png" alt="Поиск" className="icon-search" />
                Искать
            </button>

            {showResults && (
                <div className="search-results" ref={searchResultsRef}>
                    <ul>
                        {searchResults.map((book) => (
                            <li key={book.bookId}>
                                <a href={`/book/${book.bookId}`}><img src={book.coverImage} alt={book.title} /></a>
                                <div className="book-info">
                                    <a href={`/book/${book.bookId}`} className="book-title">{book.title}</a>
                                    <span className="result-price">{book.priceWithDiscount}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            )}
        </form>
    );
}

export default SearchBar;
