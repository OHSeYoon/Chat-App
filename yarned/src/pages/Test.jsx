import React, { useState } from 'react';
import CardInputForm from '../cardscomponents/CardInput';
import Cards from '../cardscomponents/Cards';
import unoun from "../img/201.png";
import balt from "../img/343.png";
import chim from "../img/358.png";


const Test = () => {

    function importAllImages(r) {
        let images = {};
        r.keys().map((item, index) => {
          images[item.replace('./', '')] = r(item);
        });
        return images;
      }
      
      
      const images = importAllImages(require.context('../img', false, /\.(png|jpe?g|svg)$/));
    const [cards, setCards] = useState([
        { title: 'Card 1', description: 'Description for Card 1', image: unoun },
        { title: 'Card 2', description: 'Description for Card 2', image: balt },
        { title: 'Card 3', description: 'Description for Card 3', image: chim },
      ]);

  const handleAddCard = (newCard) => {
    setCards([...cards, newCard]);
  };

  return (
    <div>
      <h1>React Card Slider</h1>
      <CardInputForm onAddCard={handleAddCard} />
      <Cards cards={cards} />
    </div>
  );
};

export default Test;