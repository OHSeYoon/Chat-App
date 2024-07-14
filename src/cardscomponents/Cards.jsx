import React, { useState, useEffect, useRef } from 'react';
import './CardSlider.css';

const Cards = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;
  const sliderRef = useRef(null);

  const totalCards = cards.length;

  const goToNextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCards);
  };

  const goToPrevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalCards) % totalCards);
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.3s ease';
      sliderRef.current.style.transform = `translateX(-${(currentIndex * 100) / cardsPerView}%)`;
    }
  }, [currentIndex]);

  return (
    <div className="card-slider">
      <div className="slider" ref={sliderRef}>
        <div className="cards">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card"
              style={{
                minWidth: `${100 / cardsPerView}%`,
              }}
            >
              <div className="image-container">
                <img src={card.imageUrl} alt={card.title} />
              </div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
      <button className="prev" onClick={goToPrevCard}>&#10094;</button>
      <button className="next" onClick={goToNextCard}>&#10095;</button>
    </div>
  );
};

export default Cards;
