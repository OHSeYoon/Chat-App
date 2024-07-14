import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleFileInput = (e) => {
    const selectedImage = e.target.files[0];
    const storageRef = ref(storage, uuid());
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    uploadTask.on(
      "state_changed",
      null,
      (error) => console.error("File upload error:", error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        sendMessage(downloadURL);
      }
    );
  };

  const sendMessage = async (downloadURL = null) => {
    const message = {
      text,
      senderId: currentUser.uid,
      img: currentUser.photoURL,
      photo: downloadURL || null,
    };

    const chatRef = doc(db, "chats", data.chatId);

    // Add message to chat document
    await updateDoc(chatRef, {
      messages: arrayUnion(message),
    });

    // Set the timestamp separately
    await updateDoc(chatRef, {
      timestamp: serverTimestamp(),
    });

    // Update LastMessage field for both users
    await updateLastMessage(currentUser.uid, data.chatId, message);
    const otherUserId = data.chatId.replace(currentUser.uid, '').split(/(\w{28})/).filter(Boolean).find(id => id !== currentUser.uid);
    if (otherUserId) {
      await updateLastMessage(otherUserId, data.chatId, message);
    } else {
      console.error("Could not determine the other user's UID");
    }

    setText("");
    setFile(null);
  };
  

  const updateLastMessage = async (userId, chatId, message) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        [`conversation.${chatId}`]: message.text,  // Using dot notation to set the chatId key
      });
  
      const otherUserId = chatId.replace(currentUser.uid, '')
        .split(/(\w{28})/)
        .filter(Boolean)
        .find(id => id !== currentUser.uid);
  
      if (otherUserId) {
        return { success: true, otherUserId };
      } else {
        return { success: false, error: "Could not determine the other user's UID" };
      }
    } catch (error) {
      console.error("Error updating last message:", error);
      return { success: false, error: error.message };
    }
  };
  

 
  const handleSend = () => {
    if (file) {
      handleFileInput({ target: { files: [file] } });
    } else {
      sendMessage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="file">
          <img src="C:\Users\david\OneDrive\Desktop\Chat\yarned\src\img\100.png" alt="" /> 
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
