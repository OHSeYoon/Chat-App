import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats",data.chatId), (doc) => {
      if (doc.exists()) {
        const messagesData = doc.data().messages || [];
        setMessages(messagesData);
        console.log("Messages: Full ChatId",data.chatId)
      } else {
        setMessages(["NOPE"]);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.length === 0 ? (
        <p>No messages available.</p>
      ) : (
        messages.map((m) => <Message message={m} key={m.id} />)
      )}
    </div>
  );
};

export default Messages;