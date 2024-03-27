import React, { useState, useEffect } from 'react';
import CardInputForm from '../cardscomponents/CardInput';
import Cards from '../cardscomponents/Cards';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you have initialized Firebase in '../firebase'

const Test = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cards'));
        const fetchedCards = [];
        querySnapshot.forEach((doc) => {
          fetchedCards.push(doc.data());
        });
        setCards(fetchedCards);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []); 
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
