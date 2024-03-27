import React, { useState } from 'react';
import firebase from 'firebase/app';
import {
  arrayUnion,
  addDoc,
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

const CardInputForm = ({ onAddCard }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !imageFile) return;
  
    try {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error(error);
        },
        async () => {
          try {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            // Add card data to Firestore
            const docRef = await addDoc(collection(db, "cards"), {
              title,
              description,
              imageUrl,
            });
            onAddCard({ title, description, imageUrl, id: docRef.id });
            setTitle("");
            setDescription("");
            setImageFile(null);
            console.log("CardInput: Upload Sucess!!!")
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <label htmlFor="file">Choose Image</label>
        <button type="submit">Add Card</button>
      </div>
    </form>
  );
};

export default CardInputForm;
