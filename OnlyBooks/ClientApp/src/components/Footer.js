import React from 'react';
import './Footer.css';
import {
    MDBFooter,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBBtn
} from 'mdb-react-ui-kit';

export default function Footer() {
    return (
        <MDBFooter className='text-center' bgColor='black'>
            <MDBContainer className='p-3'>
                    <img src="/images/logo_small.png" />
                <section className='mb-4 info'>
                    <p>
                        Открой мир слов и историй с OnlyBooks – вашим надежным проводником в мире знаний.
                        У нас вы найдете лучшие книги на любой вкус и предпочтение. Разнообразие жанров,
                        качественный сервис и удобная доставка – вот что делает нас вашим идеальным партнером
                        в путешествии по страницам книг. Присоединяйтесь к нам и погрузитесь в море удовольствия от чтения!
                    </p>
                </section>
                <section className=''>
                    <MDBRow>
                        <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
                            <h5 className='text-uppercase'>Каталог</h5>

                            <ul className='list-unstyled mb-0'>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Все книги
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Школа
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Журналы
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Учебные курсы
                                    </a>
                                </li>
                            </ul>
                        </MDBCol>

                        <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
                            <h5 className='text-uppercase'>Важно</h5>

                            <ul className='list-unstyled mb-0'>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Акции
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Главные книги
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Сертификаты
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Предзаказы
                                    </a>
                                </li>
                            </ul>
                        </MDBCol>

                        <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
                            <h5 className='text-uppercase'>Помощь</h5>

                            <ul className='list-unstyled mb-0'>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Как сделать заказ
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Оплата
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Доставка
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Поддержка
                                    </a>
                                </li>
                            </ul>
                        </MDBCol>

                        <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
                            <h5 className='text-uppercase'>Мы в соцсетях</h5>

                            <ul className='list-unstyled mb-0'>
                                <li>
                                    <a href='#!' className='text-white'>
                                        ВКонтакте
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        YouTube
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Дзен
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Телеграм
                                    </a>
                                </li>
                            </ul>
                        </MDBCol>
                    </MDBRow>
                </section>
            </MDBContainer>

            <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                © 2023 Copyright: 
                <a className='text-white' href='https://localhost:44442/'>
                    <span></span> OnlyBooks
                </a>
            </div>
        </MDBFooter>
    );
}