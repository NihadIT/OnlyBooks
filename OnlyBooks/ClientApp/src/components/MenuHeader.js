import React, { useState } from 'react';
import './NavMenu.css';

const MenuHeader = () => {

    return (
        <div className="menu-header">
            <div className="menu-header-category">
				<nav>
					<ul>
						<li><a href="#">Книги</a>
							<ul>
								<li><a href="/category/year=2023&minRate=7/Главные 2023">Главные 2023</a></li>
								<li><a href="/category/all/Все книги">Все книги</a></li>
								<li><a href="#">Билингвы</a>
									<ul>
										<li><a href="#">Все книги жанра</a></li>
										<li><a href="#">Билингвы для детей</a></li>
										<li><a href="#">Билингвы. Английский язык</a></li>
										<li><a href="#">Билингвы. Другие языки</a></li>
									</ul>
								</li>
								<li><a href="/category/categoryId=3/Книги для детей">Книги для детей</a>
									<ul>
										<li><a href="/category/categoryId=3/Книги для детей">Все книги жанра</a></li>
										<li><a href="/category/categoryId=6/Детская художественная литература">Детская художественная литература</a></li>
										<li><a href="#">Детский досуг</a></li>
										<li><a href="#">Познавательная литература для детей</a></li>
									</ul>
								</li>
								<li><a href="/category/categoryId=47/Комиксы, Манга">Комиксы, Манга</a></li>
								<li><a href="/category/categoryId=1/Нехудожественная литература">Нехудожественная литература</a></li>
								<li><a href="#">Религия</a></li>
								<li><a href="/category/categoryId=2/Художественная литература">Художественная литература</a></li>
								<li><a href="#">Молодежная литература</a></li>
							</ul>
						</li>

						<li><a href="#">Иностранные</a>
							<ul>
								<li><a href="/category/subjectId=1/Книги на английском языке">Книги на английском языке</a></li>
								<li><a href="#">Книги на испанском языке</a></li>
								<li><a href="#">Книги на итальянском языке</a></li>
								<li><a href="#">Книги на немецком языке</a></li>
								<li><a href="#">Книги на французском языке</a></li>
							</ul>
						</li>
						<li><a href="/">Главное</a></li>
						<li><a href="#">Предметы</a>
							<ul>
								<li><a href="/category/subjectId=5/Русский язык">Русский язык</a></li>
								<li><a href="/category/subjectId=1/Английский язык">Английский язык</a></li>
								<li><a href="/category/subjectId=4/Математика">Математика</a></li>
								<li><a href="#">Окружающий мир</a></li>
								<li><a href="#">История</a></li>
								<li><a href="/category/subjectId=6/Литература.Чтения">Литература. Чтение</a></li>
								<li><a href="/category/subjectId=3/Физика. Астрономия">Физика. Астрономия</a></li>
								<li><a href="#">Биология. Экология</a></li>
								<li><a href="/category/subjectId=2/География">География</a></li>
							</ul>
						</li>
						<li><a href="/apps">Приложения</a></li>
					</ul>
				</nav>
            </div>
        </div>
    );
};

export default MenuHeader;
