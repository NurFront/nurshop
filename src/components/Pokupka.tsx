import React, { useEffect, useState } from 'react';
import Header from './Header';

const Pokupka = () => {
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        const storedProduct = localStorage.getItem('cart');
        if (storedProduct) {
            const parsedCart = JSON.parse(storedProduct);
            setCart(parsedCart);
        }
    }, []);

    return (
        <div>
            <Header />
            {cart.length > 0 ? (
                cart.map((item, index) => (
                    <div key={index}>
                        <p>{item.name}</p>
                        <img src={item.url} alt={item.name} width="100" />
                    </div>
                ))
            ) : (
                <p>Корзина пуста</p>
            )}
        </div>
    );
}

export default Pokupka;
