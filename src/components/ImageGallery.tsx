import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/imagegallery.css';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  url: string;
};

const ImageGallery = () => {
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [countProducts, setCountProducts] = useState(cart.length);
  const [images, setImages] = useState<Product[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3005/api/get-images")
      .then((response) => {
        setImages(response.data);
      })
      .catch((err) => {
        console.error("Ошибка при получении изображений:", err);
      });
  }, []);

  const addToCart = (product: Product) => {
    const savedCart = localStorage.getItem('cart');
    const existingCart: Product[] = savedCart ? JSON.parse(savedCart) : [];

    const isProductInCart = existingCart.some(item => item.id === product.id);
    if (isProductInCart) {
      return;    }

    const updatedCart = [...existingCart, product];

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    localStorage.setItem('countProducts', JSON.stringify(updatedCart.length));

    setCart(updatedCart);
    setCountProducts(updatedCart.length);
  };

  return (
    <div>
      <h1 className="count-products"> {countProducts}</h1>
      <div className="image-gallery-main">
        {images.map((image, index) => (
          <div key={index} className="image-card">
            <img src={image.url} alt={`img-${index}`} className="product-item" />
            <div className="card-content">
              <h3>{image.name}</h3>
              <p>{image.description}</p>
              <p>Цена: {Number(image.price) % 1 === 0 ? Number(image.price).toFixed(0) : Number(image.price).toFixed(2)} сом</p>
              <button className="add-product" onClick={() => addToCart(image)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
