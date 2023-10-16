import React, { useEffect, useRef, useState } from 'react';
import { fetchDiscounts } from '../utils/api.js';
import Flickity from 'flickity';
import 'flickity/css/flickity.css';
import axios from 'axios';
import "./Carousel.css";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQuantity } from '../redux/cartReducer';
import { addToFavorite } from '../redux/favoriteReducer';

// Динамическая пагинация карусели
const DynamicCarousel = ({ carouselId, filter }) => {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [fetching, setFetching] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const flickityInstanceRef = useRef(null);
    const [discounts, setDiscounts] = useState([]);
    const [showFavoriteNotification, setShowFavoriteNotification] = useState(false);

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const favorite = useSelector((state) => state.favorite.favorite);


    useEffect(() => {
        const fetchData = async () => {
            if (fetching) {
                try {
                    let filterParams = '';

                    if (/[<>]/.test(filter)) {
                        filterParams = filter;
                        filter = null;
                    }

                    const response = await axios.get(`api/books/GetBooksPagination?_limit=10&_page=${currentPage}&${filter}`);
                    let newBooks = response.data;

                    const booksWithDiscounts = await fetchDiscounts();
                    setDiscounts(booksWithDiscounts);

                    if (filterParams != '') {
                        const filterFunction = new Function('book', `return ${filterParams};`);
                        newBooks = newBooks.filter(book => filterFunction(book));
                    }
                  
                    setBooks(prevBooks => [...prevBooks, ...newBooks]);
                    setCurrentPage(prevState => prevState + 1);
                } catch (error) {
                    console.error('Ошибка загрузки данных: ', error);
                } finally {
                    setFetching(false);
                }
            }
        };

        fetchData();
    }, [fetching, currentPage, filter]);

    useEffect(() => {
        if (books.length > 0) {
            if (!flickityInstanceRef.current) {
                flickityInstanceRef.current = new Flickity(`#${carouselId}`, {
                    prevNextButtons: false,
                    pageDots: false,
                    contain: true,
                    groupCells: 4,
                    pauseAutoPlayOnHover: false,
                    draggable: false,
                    freeScroll: true,
                    cellAlign: 'left',
                    selectedAttraction: 0.02,
                    friction: 0.15,
                });
            }

            // Находит новые книги которых нет в карусели
            const newBooksToAdd = books.filter(newBook =>
                !Array.from(flickityInstanceRef.current?.getCellElements() || []).some(
                    cellElement => cellElement.dataset.bookId === newBook.bookId.toString()
                )
            );
            /* const filteredNewBooksToAdd = newBooksToAdd.filter(filterFunction);*/

            // Добавление новых книг
            if (newBooksToAdd.length > 0) {
                const newCells = newBooksToAdd.map(newBook => makeCell(newBook));
                flickityInstanceRef.current.append(newCells);
            }
        }
    }, [books]);

    useEffect(() => {
        const fetchData = async () => {
            const booksWithDiscounts = await fetchDiscounts();
            setDiscounts(booksWithDiscounts);
        };
        fetchData(); 

    }, []);

    // Добавление в корзину
    const addToCartHandler = (book) => {
        const discountPercentage = (book.discounts && book.discounts.length > 0)
            ? book.discounts[0].discountPercentage
            : 0;

        const newItem = {
            id: book.bookId,
            image: book.coverImage,
            title: book.title,
            price: book.price,
            discountPrice: Math.floor(book.price * (1 - discountPercentage / 100)),
        };

        // Проверка дублирования
        const existingItem = cart.find((item) => item.id === newItem.id);
        if (existingItem) {
            // Если товар уже есть, увеличиваем его количество на 1
            dispatch(increaseQuantity(existingItem.id));
        } else {
            // Если товара нет в корзине, добавляем его
            dispatch(addToCart(newItem));
        }
    };


    const addToFavoriteHandler = (book) => {
        const discountPercentage = (book.discounts && book.discounts.length > 0)
            ? book.discounts[0].discountPercentage
            : 0;

        const newItem = {
            id: book.bookId,
            image: book.coverImage,
            title: book.title,
            price: book.price,
            discountPrice: Math.floor(book.price * (1 - discountPercentage / 100)),
        };
        console.log("Добавлено в избранное");
        // Проверка дублирования
        const existingItem = favorite.find((item) => item.id === newItem.id);
        if (existingItem) {
            return;
        } else {
            dispatch(addToFavorite(newItem));
            setShowFavoriteNotification(true);
            setTimeout(() => setShowFavoriteNotification(false), 2000);
        }
    };

    function getDaysDeclension(days) {
        const lastDigit = days % 10;
        const secondToLastDigit = Math.floor(days / 10) % 10;

        if (secondToLastDigit === 1) {
            return 'дней';
        }

        if (lastDigit === 1) {
            return 'день';
        }

        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'дня';
        }

        return 'дней';
    }

     // Добавление новых ячеек в карусель
     function makeCell(book) {
        const cell = document.createElement('div');
        cell.className = 'gallery-cell';
        cell.dataset.bookId = book.bookId;

        const bookInfo = document.createElement('div');
        bookInfo.className = 'book-info';

        const priceContainer = document.createElement('span');
        priceContainer.className = 'price-container';

        const bookDiscountInfo = discounts.find((discount) => discount.bookId === book.bookId);

        if (bookDiscountInfo) {
        const discountedPrice = book.price * (1 - bookDiscountInfo.discountPercentage / 100);

        const price = document.createElement('span');
        price.className = 'book-price';
        price.textContent = `${discountedPrice.toFixed(0)} `;

        const originalPrice = document.createElement('s');
        originalPrice.className = 'original-price';
        originalPrice.textContent = (typeof book.price === 'number' && book.price > 999 ?
            `${String(book.price).slice(0, -3)} ${String(book.price).slice(-3)}` :
            book.price);;

        const discountInfo = document.createElement('div');
        discountInfo.className = 'discount-info'; 

        const discountPercent = document.createElement('span');
        discountPercent.className = 'discount-label';
        discountPercent.innerHTML = bookDiscountInfo.discountPercentage + "%";

        const daysLeft = document.createElement('span');
        daysLeft.className = 'days-left-label';
        const endDate = new Date(bookDiscountInfo.endDate);
        const currentDate = new Date();

        // Вычисляем разницу в миллисекундах между датами
        const timeDiff = endDate.getTime() - currentDate.getTime();
        // Переводим миллисекунды в дни
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const declension = getDaysDeclension(daysDiff);
        daysLeft.textContent = `Еще: ${daysDiff} ${declension}`;

        // Если срок не указан, либо больше нуля
        discountInfo.appendChild(discountPercent) 
        if (daysDiff > 0 || endDate == null) {

            discountInfo.appendChild(daysLeft)
        }
        priceContainer.appendChild(price);
        priceContainer.appendChild(originalPrice);
        priceContainer.appendChild(discountInfo);

    } else {
        const price = document.createElement('span');
        price.className = 'book-price';
        price.textContent = (typeof book.price === 'number' && book.price > 999 ?
            `${String(book.price).slice(0, -3)} ${String(book.price).slice(-3)}` :
            book.price);
        priceContainer.appendChild(price);
    }

         const ref = document.createElement('a');
         ref.href = `book/${book.bookId}`;

        // Картинка книги
        const img = document.createElement('img');
        img.src = book.coverImage;
        img.alt = book.title;
        img.className = 'image-link';

         ref.appendChild(img);

        const titleLink = document.createElement('a');
        titleLink.href = `book/${book.bookId}`;
        titleLink.className = 'product-title';
        titleLink.textContent = book.title;

        // Блок для кнопок
        const productBuy = document.createElement('div');
        productBuy.className = 'product-buy';

        // Кнопка корзины
        const basketBtn = document.createElement('button');
        basketBtn.className = 'basket-button';
         basketBtn.innerHTML = 'В КОРЗИНУ';
         basketBtn.addEventListener('click', () => addToCartHandler(book));

        // Кнопка отложить
        const postponeBtnContainer = document.createElement('div'); 
        postponeBtnContainer.className = 'postpone-button-container';

        const postponeBtn = document.createElement('button');
        postponeBtn.className = 'postpone-button';
        postponeBtn.addEventListener('click', () => addToFavoriteHandler(book))

        const postponeImg = document.createElement('img');
        postponeImg.src = "/images/icons/icon-like.png" 
        postponeImg.alt = 'Отложить';
        postponeBtn.title = 'Отложить'; 
        postponeBtn.appendChild(postponeImg);

        postponeBtnContainer.appendChild(postponeBtn);
        productBuy.appendChild(basketBtn);
        productBuy.appendChild(postponeBtn);

        bookInfo.appendChild(ref);
        bookInfo.appendChild(priceContainer);
        bookInfo.appendChild(titleLink);
        bookInfo.appendChild(productBuy);
        cell.appendChild(bookInfo);

        return cell;
    }

    useEffect(() => {
        if (!fetching) {
            setLoadingMore(false);
        }
    }, [fetching]);

    const handlePrevClick = () => {
        if (currentPage > 1) {
            flickityInstanceRef.current.previous();
        }
    };

    // Загрузка книг при скролле
    const handleNextClick = async () => {
        if (flickityInstanceRef.current && !loadingMore) {
            const currentSlideIndex = flickityInstanceRef.current.selectedIndex;
            const totalSlides = flickityInstanceRef.current.slides.length;

            if (currentSlideIndex === totalSlides - 2) {
                setLoadingMore(true);
                setFetching(true);
            }

            setTimeout(() => {
                flickityInstanceRef.current.next();
            }, 100); // Задержка прокрутки
        }
    };

    return (
        <div className="dynamic-carousel">
            <div className="controls">
                <button onClick={handlePrevClick}><img src="/images/icons/icon-left.png" alt="влево" /></button>
                <button onClick={handleNextClick}><img src="/images/icons/icon-right.png" alt="вправо" /></button>
            </div>
                <div id={carouselId} className="gallery"></div>
        </div>
    );
};

export default DynamicCarousel;