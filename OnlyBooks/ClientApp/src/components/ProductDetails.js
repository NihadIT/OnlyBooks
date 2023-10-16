import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookDetails, fetchBooksCategory } from '../utils/api';
import "./ProductDetails.css";
import RatingArea from './RatingArea.js';
import Carousel from "./Carousel";
import AddToCartButton from './details/AddToCartButton';
import AddToFavoriteButton from './details/AddToFavoriteButton';

function ProductDetails()  {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [books, setBooks] = useState([]);
    const bookId = parseInt(id, 10);

    useEffect(() => {
        async function fetchDetails() {
            const bookDetails = await fetchBookDetails(id);
            setBook(bookDetails); 
            const booksWithCategory = await fetchBooksCategory(bookDetails.category[1].key);
            setBooks(booksWithCategory);
        }

        fetchDetails();
    }, [id]);

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div className="wrapper">
            <div className="product-info">
                <p className="product-category">
                    {book.category.map((category, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && ' > '}
                        {category}
                    </React.Fragment>))}</p>
                <h1 className="product-title">{book.title}</h1>
                <div className="product-details">
                    <div className="product-details-cover">
                <img src={book.coverImage} alt={book.title} />
                    </div>
                    <div className="product-details-left">
                        <p className="product-author">Автор: {book.author}</p>
                        <p className="product-publisher">Издательство: {book.publisher}, {book.publicationYear}</p>
                        <p className="product-category">Раздел: {book.category[1]}</p>
                        {book.genre.length > 0 ?
                            <p>Жанр:&nbsp;
                                {book.genre.map((genre, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && ', '}
                                        {genre}
                                    </React.Fragment>))}</p> : ''}
                        <div className="buying">
                            <div className="buying-price">
                                <span>Цена: </span>
                                {book.discount > 0 ?
                                    <div className='buying-discount'>
                                        <span className='origin-price'>{book.price}</span>
                                        <span className='discount-price'>{Math.floor(book.price * (1 - book.discount / 100))}</span>
                                        <span className='percent-price'>-{book.discount}%</span>
                                    </div>
                                    :
                                    <span className='origin-price' style={{ display: 'inline-block' }}> {book.price}</span>
                                }
                            </div>
                            <div className='product-button'>
                                <AddToCartButton book={book} />
                            </div>
                            <div className='product-icons'>
                                <div href='#' className='fave'>
                                    <AddToFavoriteButton book={book} />
                                </div>
                            </div>
                        </div>
                        <div className="articul">ID товара: {book.bookId}</div>
                        <div className="isbn">ISBN: {book.isbn}</div>
                        <div className="pages2">Страниц: {book.pageCount}</div>
                    </div>
                    <div className="product-details-right">
                        <div className='product-rating'>
                            <div className='product-rating-body'>
                                <div className='left'>
                                    Рейтинг
                                    <div className='rate'>
                                        {book.rate.toFixed(2)}
                                    </div>
                                </div>
                                <div className='right'>
                                    <RatingArea />
                                </div>
                            </div>
                        </div>
                        <div className='product-description'></div>
                        <p className='product-description-title'>Аннотация к книге {book.title}</p>
                        <p className="product-description-text">{book.description}</p>
                    </div>
                </div>
            </div>
            <div className='products'>
                {books.length > 1 ? (
                    <div className='products-similar'>
                        <h3> Похожие товары</h3>
                        <Carousel items={books.filter((book) => book.bookId !== bookId).slice(0, 10)} carouselId="similar-books" />
                    </div>) : <span></span>}
            </div>
            </div>
    );
}

export default ProductDetails;
