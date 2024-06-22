import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from 'axios';
import { getProducts } from "./api";

const App = () => {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((error) => {
        alert("Ошибка при получении списка продукции. Попробуйте перезагрузить страницу.");
      });
  }, []);

  const addProduct = (e) => {
    e.preventDefault();

    const productId = e.target.product.value;
    const quantity = e.target.quantity.value;

    if (productId === '') {
      alert('Выберите продукцию');
      return;
    }

    if (quantity === '') {
      alert('Введите количество');
      return;
    }

    const product = products.find((p) => p.id === parseInt(productId));
    const productCost = product.price * quantity;

    setOrder([...order, { product: product.title, quantity, cost: productCost }]);

    setTotalCost(totalCost + productCost);
  };

  const saveOrder = () => {
    if (order.length === 0) {
      alert('Выберите хотя бы один товар для заказа.');
      return;
    }

    const requestBody = {
      products: order.map((item) => ({
        product_id: item.product,
        quantity: item.quantity,
      })),
    };

    axios.post('https://dev-su.eda1.ru/test_task/save.php', requestBody)
      .then((response) => {
        if (response.data.success) {
          alert(`Заказ сохранен. Номер заказа: ${response.data.code}`);
          window.location.reload();
        } else {
          alert('Ошибка при сохранении заказа. Попробуйте еще раз.');
        }
      })
      .catch((error) => {
        alert('Ошибка при сохранении заказа. Попробуйте еще раз.');
      });
  };


  return (
    <div className="container">
      <h1>Форма добавления заказа</h1>
      <form onSubmit={addProduct}>
        <label htmlFor="product">Продукция:</label>
        <select id="product">
          <option value="" disabled selected hidden>Выберите продукцию</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>

        <label htmlFor="quantity">Количество:</label>
        <input type="number" id="quantity" placeholder= "Укажите количество" min="1" />

        <button type="submit">Добавить</button>
      </form>

      <table id="order-table">
        <thead>
          <tr>
            <th>Название товара</th>
            <th>Добавленное количество</th>
            <th>Стоимость добавленного количества</th>
          </tr>
        </thead>
        <tbody>
          {order.map((item) => (
            <tr key={item.product}>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>{item.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div id="total-cost">Итоговая стоимость: {totalCost}</div>

      <button class = "save-button" type="button" onClick={saveOrder}>
        Сохранить
      </button>
    </div>
  );
};

export default App;