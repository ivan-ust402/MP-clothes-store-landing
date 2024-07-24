'use strict';

// Вариант эталонного решения

// Получаем значок количества товаров в корзине
const basketCounterEl = document.querySelector('.mycart__count'); 
// Блок с итоговой суммой товаров
const basketTotalEl = document.querySelector('.mycart-content__total');
// Итоговая сумма товаров в корзине
const basketTotalValueEl = document.querySelector('.mycart-content__total-value');
// Получим элемент окна корзины
const basketWindowEl = document.querySelector('.mycart-content');
// Создадим объект для хранения добавленных товаров в корзину
const basket = {}; //Обычно для хранения такой инфо используют Map


// Блок с элементом корзины и ссылкой, повесим
// на него обработчик событий, для открытия окна корзины
document.querySelector('.mycart').addEventListener('click', () => {
    basketWindowEl.classList.toggle('hidden');
});

// Повесим обработчик события на контейнер содержащий все товары
document.querySelector('.items__block').addEventListener('click', event => {
    // Обрабатываем контейнер кнопки add to cart
    if (!event.target.closest('.addToCart')) {
        // Ищем ближайшего предка с классом addToCart
        return;
    }
    // Находим предка с классом item и забирем у него дата атрибуты
    const item = event.target.closest('.item');
    const id = +item.dataset.id;
    const name = item.dataset.name;
    const price = +item.dataset.price;
    
    // Добавляем продукт в корзину
    addToCart(id, name, price);
    console.log(basket);
});

/**
 * Функция добавления объекта товара в объект корзины
 * @param {number} id 
 * @param {string} name 
 * @param {number} price 
 */
function addToCart(id, name, price) {
    if (!(id in basket)) {
        basket[id] = {id, name, price, count: 0};
    }
    basket[id].count++;
    // отобразим количество товаров в корзине
    basketCounterEl.classList.remove('hidden');
    // отобразим количество позиций товаров в корзине
    // basketCounterEl.textContent = Object.keys(basket).length;
    // либо отобразим общее количество товаров (что на мой взгляд 
    // не очень логично)
    basketCounterEl.textContent = getTotalBasketCount().toString();
    // Выведем в окно корзины отображение итоговой суммы
    basketTotalValueEl.textContent = getTotalBasketPrice().toFixed(2);
    // Отображаем информацию в окне корзины
    renderProductInBasket(id);
}

/**
 * Функция подсчета количества товаров в корзине
 * @returns {number} Общее число товаров в корзине
 */
function getTotalBasketCount() {
    return Object.values(basket).reduce((acc, el) => acc + el.count, 0);
}

/**
 * Функция подсчета итоговой цены товаров в корзине
 * @returns {number} общая сумма товаров в корзине
 */
function getTotalBasketPrice() {
    return Object.values(basket)
        .reduce((acc, el) => acc + el.count * el.price, 0);
}

/**
 * Функция рендера окна корзины
 * @param {number} id 
 * @returns 
 */
function renderProductInBasket(id) {
    // был ли такой продукт вставлен до 
    const basketRowEl = basketWindowEl
        .querySelector(`.mycart-content__row[data-productId="${id}"]`);
    if (!basketRowEl) {
        renderNewProductInBasket(id);
        return;
    }
    //если да - обновляем count и общую сумму товара
    basketRowEl.querySelector('.productCount').textContent = basket[id].count;
    basketRowEl.querySelector('.productTotalRow').textContent = basket[id].price * basket[id].count;
}

/**
 * Функция добавления шаблона разметки в окно корзины
 * @param {number} productId 
 */
function renderNewProductInBasket(productId) {
    const productRow = `
        <div class="mycart-content__row basketRow" data-productId="${productId}">
            <div>${basket[productId].name}</div>
            <div>
                <span class="productCount">
                    ${basket[productId].count}
                </span> шт.
            </div>
            <div>${basket[productId].price}</div>
            <div>
                $<span class="productTotalRow">
                    ${basket[productId].price * basket[productId].count}
                </span>
            </div>
            <button class="mycart-content__removebtn">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </button>
        </div>
    `;
    basketTotalEl.insertAdjacentHTML('beforebegin', productRow);
}

// #### Реализуем возможность удаления товара из корзины
// Установим обработчик события на окно корзины и отловим клики на 
// кнопку удалить
document.querySelector('.mycart-content').addEventListener('click', event => {
    if (!event.target.closest('.mycart-content__removebtn')) {
        return;
    }
    // находим продукт по которому кликнули и забираем у него id
    const product = event.target.closest('.basketRow');
    const id = product.dataset.productid;
    removeProductFromCart(id);
    console.log(basket);
})

function removeProductFromCart(id) {
    // Удаляем поле продукта из объекта корзины
    delete basket[id];
    // Удаляем из разметки необходимый блок
    basketWindowEl.querySelector(`.mycart-content__row[data-productId="${id}"]`).remove();
    // Пересчитываем итоговую цену и ререндерим
    basketTotalValueEl.textContent = getTotalBasketPrice();
    // Пересчитываем количество товаров и перерендериваем
    basketCounterEl.textContent = getTotalBasketCount().toString();
    // Если корзина пуста скрываем отображение количества товаров
    if(!getTotalBasketCount()) {
        basketCounterEl.classList.add('hidden');
    }
}
