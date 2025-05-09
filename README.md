Financial Tracker - Трекер Личных Финансов ╰(*°▽°*)╯
Deploy: https://financialtracker-git-master-simmonas-projects.vercel.app 😊
My Work: https://youtu.be/i87yALOH-7Q?si=FY3hCbdO51PlMkZ7 😎


📝 Описание проекта
Financial Tracker — это инновационное веб-приложение, которое помогает пользователям управлять своими финансами, отслеживать доходы и расходы, а также анализировать финансовые потоки. Вся информация представлена в удобном и визуально привлекательном формате, который помогает сделать управление деньгами проще и понятнее.

С помощью этого приложения пользователи могут:

Легко отслеживать свои транзакции по категориям.

Анализировать доходы и расходы по периодам с помощью диаграмм.

Следить за балансом и принимать обоснованные финансовые решения.

Приложение оснащено:

Интуитивно понятным интерфейсом с адаптивным дизайном.

Мощной системой отчетности, которая помогает пользователю контролировать свои финансы.

Красивыми и удобными графиками для визуализации расходов и доходов.☆*: .｡. o(≧▽≦)o .｡.:*☆

🛠️ Технический стек
Frontend:
React — библиотека для создания компонентов интерфейса с гибким подходом к организации и состояниям.

Vite — ультрабыстрая система сборки, которая ускоряет процесс разработки и позволяет работать с горячей перезагрузкой.

Chakra UI — универсальная библиотека для создания доступных и красивых интерфейсов.

Recharts — инструмент для построения интерактивных и адаптивных графиков.

React Icons — коллекция иконок для улучшения визуальной составляющей интерфейса.

Backend:
Node.js — серверная платформа для работы с JavaScript, которая позволяет создавать быстрые и масштабируемые приложения.

Express — минималистичный фреймворк для построения API.^_^

MongoDB — NoSQL база данных, подходящая для хранения гибких структур данных.

Mongoose — ODM для MongoDB, обеспечивающий простой интерфейс для работы с базой данных.

⚙️ Установка и запуск
Предварительные требования:
Node.js (версии 14.x или выше)

MongoDB (локально или через MongoDB Atlas)

npm или yarn

Установка и запуск Backend:
Клонируйте репозиторий:

bash
Copy
git clone https://github.com/yourusername/financialtracker.git
cd financialtracker/backend
Установите зависимости:

bash
Copy
npm install
Создайте файл .env в корне директории backend и добавьте строку с подключением к базе данных MongoDB:

ini
Copy
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.example.mongodb.net/financialtracker
PORT=5000
Запустите сервер:

bash
Copy
npm start
или для разработки:

bash
Copy
npm run dev
Установка и запуск Frontend:
Перейдите в директорию frontend:

bash
Copy
cd ../frontend
Установите зависимости:

bash
Copy
npm install
Запустите приложение:

bash
Copy
npm run dev
Откройте браузер и перейдите по адресу:

arduino
Copy
http://localhost:5173
🏗️ Процесс проектирования и разработки
Фаза 1: Проектирование:
Определение требований: Основной функционал включает управление транзакциями, фильтрацию и визуализацию.

Проектирование архитектуры: Архитектура приложения разделена на frontend и backend, с использованием REST API для взаимодействия.

Проектирование базы данных: В MongoDB была создана гибкая схема для хранения транзакций.

Проектирование UI/UX: Разработаны макеты интерфейса, учитывающие удобство работы как на мобильных устройствах, так и на десктопах.

Фаза 2: Разработка:
Настройка окружения: Настроены проекты для frontend и backend.

Разработка backend: Созданы все необходимые API-эндпоинты для обработки CRUD операций.

Разработка frontend: Реализован интерфейс для ввода данных, отображения транзакций и анализа через графики.

Интеграция frontend и backend: Все запросы с фронтенда направляются на сервер через API, а данные отображаются на интерфейсе.

Фаза 3: Тестирование и улучшение:
Функциональное тестирование: Все основные функции были протестированы на разных устройствах.

Оптимизация: Повышение производительности и уменьшение времени отклика.

Добавление функционала: Введение интерактивных диаграмм для улучшенной аналитики.

🎨 Уникальные подходы и методологии
1. Компонентная архитектура
   Каждый элемент интерфейса представлен в виде независимого компонента. Это позволяет:

Модульность: Компонуемость приложения упрощает тестирование и обновление.

Повторное использование: Каждый компонент можно использовать в разных частях приложения.

Легкость поддержки: Обновление и изменение отдельных компонентов без затронуть остальную часть системы.

2. Разделение ответственности
   Мы разделили backend и frontend, что позволяет:

Легко масштабировать каждую часть проекта.

Упрощает независимую работу над клиентской и серверной частями.

3. Визуализация данных
   Для наглядности финансовых данных мы использовали Recharts, который позволяет:

Создавать интерактивные графики.

Оценивать динамику расходов и доходов в реальном времени.

4. Адаптивный дизайн
   Сделан акцент на мобильную версию, обеспечивающую удобное отображение на различных устройствах. Для этого мы используем Chakra UI, который предоставляет готовые компоненты для адаптивных интерфейсов.

🤔 Компромиссы при разработке
1. Простота vs Функциональность
   Компромисс: Я сосредоточилась на базовых функциях (управление транзакциями, фильтрация, аналитика), отказавшись от сложных, но не критичных возможностей.

Решение: Приложение гибкое, и в будущем можно добавить дополнительные функции.

2. Локальное хранение vs Облачное хранение
   Компромисс: В проекте используется MongoDB для хранения данных, что позволяет легко масштабировать приложение.

Решение: Решение идеально подходит для данного проекта с точки зрения гибкости и быстроты разработки.

3. Клиентский рендеринг vs Серверный рендеринг
   Компромисс: Используем клиентский рендеринг, что способствует более быстрой интерактивности, но замедляет начальную загрузку.

Решение: Для нашего типа приложения клиентский рендеринг является оптимальным.

🐛 Известные проблемы и ограничения
Обработка ошибок: При потере соединения с сервером могут быть недостаточно информативные сообщения.

Производительность: При большом количестве данных приложение может замедляться, особенно при фильтрации.

Многоязычность: На данный момент поддерживается только русский язык интерфейса.

Авторизация: Отсутствует система аутентификации, что ограничивает возможность персонализации данных.

🤷 Почему выбран этот технический стек
React + Vite
React был выбран за компонентный подход и гибкость, а Vite ускоряет процесс разработки благодаря быстрой сборке и горячей перезагрузке.

Chakra UI
Chakra UI идеально подходит для создания доступных и красивых интерфейсов, а также дает возможность легко настроить темы и компоненты.

MongoDB + Mongoose
MongoDB был выбран за свою гибкость, а Mongoose предоставляет удобный интерфейс для работы с базой данных.

Express
Express обеспечивает простоту и гибкость при построении API, идеально подходя для создания серверной части.

Recharts
Recharts идеально подходит для визуализации данных и обладает отличной производительностью, что позволяет эффективно работать с графиками.

 [InsertCodeHereCodingGIF (2)](https://github.com/user-attachments/assets/68d92fc3-ebdd-4da6-8e50-59adb0aaa109)

📊 Будущие улучшения  !     

Добавление аутентификации и авторизации.

Расширенная аналитика: добавление прогнозов и трендов.

Добавление системы финансовых целей и бюджетирования.

Оптимизация мобильного опыта (PWA).

Многоязычность и поддержка различных валют.

Экспорт данных в различные форматы.

 
