import React, { useState, useEffect, useCallback, useContext } from 'react';
import CardInputForm from '../cardscomponents/CardInput';
import Cards from '../cardscomponents/Cards';
import { collection, getDocs,onSnapshot,doc } from 'firebase/firestore';
import { db } from '../firebase';
import Post from '../postcomponents/post';
import PostList from '../postcomponents/list';
import Chats from '../components/Chats';
import Modal from '../components/Modal';
import { ChatContext } from '../context/ChatContext';
import './Style.scss';

const Test = () => {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  const fetchCards = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cards'));
      const fetchedCards = querySnapshot.docs.map(doc => doc.data());
      setCards(fetchedCards);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (data.chatId) {
      const chatRef = doc(db, 'chats', data.chatId);
      const unSub = onSnapshot(chatRef, (doc) => {
        if (doc.exists()) {
          const messagesData = doc.data().messages || [];
          setMessages(messagesData);
          console.log("Messages: Full ChatId", messages);
          setShowModal(true);
        } else {
          setMessages([]);
        }
      });

      // Clean up the subscription when chatId changes or component unmounts
      return () => unSub();
    }
  }, [data.chatId]);

  useEffect(() => {
    // Add event listener for the Escape key when modal is open
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Clean up the event listener when the modal is closed or component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  const handleAddCard = (newCard) => {
    console.log('Adding new card:', newCard); // Debugging log
    setCards(prevCards => [...prevCards, newCard]);
  };

  const handleCloseModal = () => {
    console.log(data.chatId);
    console.log(messages);
    setShowModal(false);
  };

  return (
    <div className="test-container">
      <h1>Card Negócios</h1>
      <div className="sidebar">
      <Chats onSelectMessage={(msgs) => { setMessages(msgs); setShowModal(true); }} />      </div>
      <div className="main-content">
        <CardInputForm onAddCard={handleAddCard} />
        <Cards cards={cards} />
      </div>
      <div className="post-section">
        <Post />
        <PostList />
      </div>
      {showModal && <Modal onClose={handleCloseModal} messages={messages} />}
    </div>
  );
};

export default Test;
