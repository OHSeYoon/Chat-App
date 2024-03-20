import React, { useContext, useState } from "react";
import unoun from "../img/201.png";
import balt from "../img/343.png";
import chim from "../img/358.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  collection,
  updateDoc,
  getDocs
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch, createCode, setTrigger } = useContext(ChatContext);

  const handleFileInput = (e) => {
    const selectedImage = e.target.files[0];
    const storageRef = ref(storage, uuid());
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    uploadTask.on(
      (error) => {
        console.error(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              text,
              senderId: currentUser.uid,
              img: currentUser.photoURL,
              photo: downloadURL,
            }),
          });
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    );
  };

  const handleSend = async () => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        text,
        senderId: currentUser.uid,
        img: currentUser.photoURL,
      }),
    });

    await updateDoc(doc(db, "users", currentUser.uid), {
      [data.chatId]: text,
    });
    
    const CollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(CollectionRef);
    const uids = [];
    querySnapshot.forEach((doc) => {
      uids.push( doc.id);
    });

    uids.forEach(uid => {
      if (data.chatId.includes(uid)) {
        console.log("Match found for chatId:", uid);
      }
    });



    setText("");
    setFile(null);
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
          onChange={handleFileInput}
        />

        <label htmlFor="file">
          <img src={unoun} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
