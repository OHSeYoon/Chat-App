
import React, { useState } from 'react';
import './CardSlider.css'; 

const Cards = ({cards}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextCard = () => {
      setCurrentIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
    };
  
    const goToPrevCard = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
    };
  
    return (
      <div className="card-slider">
        <div className="slider">
          <div className="cards" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {cards.map((card, index) => (
              <div key={index} className="card">
                <h2>{card.title}</h2>
                <img src={card.imageUrl} alt={card.title} />
                <p>{card.description}</p>
              </div>
            ))}
          </div>
          <button className="prev" onClick={goToPrevCard}>&#10094;</button>
          <button className="next" onClick={goToNextCard}>&#10095;</button>
        </div>
      </div>
    );
  };

export default Cards
