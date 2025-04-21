import { useEffect, useState } from "react";
import '../styles/imagegallery.css';
import '../styles/basket.css'
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    url: string;
    count?: number;
};

const Basket = () => {
    const [cart, setCart] = useState<Product[]>(() => {
        const saved = localStorage.getItem('cart');
        const parsed = saved ? JSON.parse(saved) : [];
        return parsed.map((item: Product) => ({
            ...item,
            count: item.count || 1,
        }));
    });

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const buyBtn = () => {
        navigate('/buyproducts');
    };

    const changeCount = (id: number, delta: number) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id
                    ? {
                        ...item,
                        count: Math.min(10, Math.max(1, (item.count || 1) + delta)),
                    }
                    : item
            )
        );
    };

    const removeFromCart = (id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    return (
        <div className="cart">
            <h2>🛒 Корзина</h2>
            {cart.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <>
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index} className="cart-item">
                                <img src={item.url} alt={item.name} className="cart-img" />
                                <div className="cart-info">
                                    <p>{item.name}</p>
                                    <p>{Number(item.price) % 1 === 0 ? Number(item.price).toFixed(0) : Number(item.price).toFixed(2)}с</p>
                                    <div className="cart-count">
                                        <button onClick={() => changeCount(item.id, -1)} className="item-btn-minus">-</button>
                                        <h1>{item.count || 1}</h1>
                                        <button onClick={() => changeCount(item.id, 1)} className="item-btn">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="remove-btn"><Delete /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p>
                        <strong>Итого: </strong>
                        {cart.reduce((acc, item) => acc + Number(item.price) * (item.count || 1), 0)}₽
                    </p>
                    <button onClick={buyBtn} className="buy-btn">Перейти к покупке</button>
                    <button onClick={clearCart} className="clear-cart">Очистить корзину</button>
                </>
            )}
        </div>
    );
};

export default Basket;