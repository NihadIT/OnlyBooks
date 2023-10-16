import "./Home.css";
import React, { useEffect, useState } from 'react';
import { fetchBooksAndDiscounts } from "../utils/api.js";
import Carousel from "./Carousel";
import DynamicCarousel from "./DynamicCarousel";
import { Fade } from "react-awesome-reveal";
export function Home() {
    const [books, setBooks] = useState([]);

    // Удаление из локальной памяти
    localStorage.removeItem('selectedSort');
    localStorage.removeItem('currentPage');

    useEffect(() => {
        const fetchData = async () => {
            const booksWithDiscounts = await fetchBooksAndDiscounts();
            setBooks(booksWithDiscounts);
        };

        fetchData();
    }, []);

    return (
        <div className="wrapper">
            <Fade>
            <div className="top-content">
                <div className="main-banners-wrapper">
                    <div className="discount-books">
                        <Carousel items={books.filter((book) => book.discount > 0).slice(0, 10)} carouselId="discount-books" autoPlay={true} />
                    </div>
                 <div className="right-banner">
                    <div className="best-books">
                            <h4>Лучшие книги по рейтингу</h4>
                        <Carousel items={books.filter((book) => book.rate > 7).slice(0, 30)} carouselId="best-books" />
                        </div>
                        <div className="more_books">
                            <a href="#">Больше книг по скидкам</a>
                        </div>
                    </div>
                 </div>
                </div>
                </Fade>
            <div className="main-content">
                <div className="hits">
                    <Fade>
                        <div className="bestseller-block">
                        <h2>Хиты продаж. Распродажа</h2>
                            <DynamicCarousel carouselId="bestseller" filter="book.rate >= 7" />
                        </div>
                        <div className="english-course-block">
                        <h2>Английские учебные курсы. Распродажа</h2>
                            <DynamicCarousel carouselId="english-course" filter="categoryId=50" />
                        </div>
                        <div className="school-books-block">
                            <h2>Книги для школы</h2>
                            <DynamicCarousel carouselId="school-books" filter="categoryId=52" />
                        </div>
                        <div className="manga-comics-block">
                            <h2>Манга и комиксы</h2>
                            <DynamicCarousel carouselId="manga-comics" filter="categoryId=47" />
                        </div>
                        <div className="new-books-block">
                            <h2>Книги: новинки 2023</h2>
                            <DynamicCarousel carouselId="new-books" filter="year=2023" />
                        </div>
                    </Fade>
                </div>
                </div>
        </div>
    );
}
