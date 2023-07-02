import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', img: 'https://i.ibb.co/8cvk2sq/35a6638ac326afbe23aa1a049541baa1.jpg', title: 'Пицца чизбургер', price: 300, description: 'Соств'},
    {id: '2', img: 'https://i.ibb.co/8cvk2sq/35a6638ac326afbe23aa1a049541baa1.jpg', title: 'Пицца цезарь', price: 260, description: 'Соств'},
    {id: '3', img: 'https://i.ibb.co/8cvk2sq/35a6638ac326afbe23aa1a049541baa1.jpg',title: 'Пицца курица грибы', price: 260, description: 'Соств'},
    {id: '4', img: 'https://i.ibb.co/8cvk2sq/35a6638ac326afbe23aa1a049541baa1.jpg',title: 'Пицца 4 сыра', price: 300, description: 'Соств'},
    {id: '5', img: 'https://i.ibb.co/CKTh6xL/1670411216-1-podacha-blud-com-p-ovoshchnoi-salat-krasivoe-foto-1.jpg',title: 'Салат наслаждение', price: 170, description: 'Соств'},
    {id: '6', img: 'https://i.ibb.co/CKTh6xL/1670411216-1-podacha-blud-com-p-ovoshchnoi-salat-krasivoe-foto-1.jpg',title: 'Салат цезарь', price: 150, description: 'Соств'},
    {id: '7', img: 'https://i.ibb.co/CKTh6xL/1670411216-1-podacha-blud-com-p-ovoshchnoi-salat-krasivoe-foto-1.jpg',title: 'Салат гречиский', price: 160, description: 'Соств'},
    {id: '9', img: 'https://i.ibb.co/8cvk2sq/35a6638ac326afbe23aa1a049541baa1.jpg',title: 'Картофель по деревенски', price: 120, description: 'Соств'},
    {id: '10', img: 'https://i.ibb.co/8cvk2sq/35a6638ac326afbe23aa1a049541baa1.jpg',title: 'Картофель фри', price: 110, description: 'Соств'},
    {id: '11', img: 'https://i.ibb.co/8cvk2sq/35a6638ac326afbe23aa1a049541baa1.jpg',title: 'Мясо по французки', price: 170, description: 'Соств'},
    {id: '12', img: 'https://i.ibb.co/8cvk2sq/35a6638ac326afbe23aa1a049541baa1.jpg',title: 'Суп с лапшой', price: 120, description: 'Соств'},
]


const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
