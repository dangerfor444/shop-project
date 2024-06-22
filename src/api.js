const getProducts = async () => {
  try {
    const response = await fetch("https://dev-su.eda1.ru/test_task/products.php");
    const data = await response.json();

    if (data.success) {
      return data.products;
    } else {
      throw new Error("Ошибка при получении списка продукции");
    }
  } catch (error) {
    throw error;
  }
};

export { getProducts };