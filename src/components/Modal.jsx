import React from 'react';
import "./Styles.scss";

const Modal = ({ onClose, messages }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-button" onClick={onClose}>×</button> {/* Escape button */}
        <div className="modal-content">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <p>{message.text}</p>
              {message.photo && <img src={message.photo} alt="message" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;