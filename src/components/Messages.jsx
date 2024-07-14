import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";
import './Styles.scss'; // Import your styles

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [visibleMessages, setVisibleMessages] = useState(2); // Initial number of visible messages
  const { data } = useContext(ChatContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        const messagesData = doc.data().messages || [];
        setMessages(messagesData);
        console.log("Messages: Full ChatId", data.chatId);
      } else {
        setMessages([]);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, visibleMessages]);

  const loadMoreMessages = () => {
    setVisibleMessages((prevVisibleMessages) => prevVisibleMessages + 20);
  };

  return (
    <div className="messages">
      {messages.length > 0 && visibleMessages < messages.length && (
        <button className="load-more" onClick={loadMoreMessages}>
          Load More
        </button>
      )}
      {messages.length === 0 ? (
        <p>No messages available.</p>
      ) : (
        messages.slice(-visibleMessages).map((m) => <Message message={m} key={m.id} />)
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
