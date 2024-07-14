import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import './CardSlider.css';

const CardInputForm = ({ onAddCard }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !imageFile) {
      console.log('All fields are required.');
      return;
    }

    try {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Upload error:', error);
        },
        async () => {
          try {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const docRef = await addDoc(collection(db, 'cards'), {
              title,
              description,
              imageUrl,
            });
            onAddCard({ title, description, imageUrl, id: docRef.id });
            setTitle('');
            setDescription('');
            setImageFile(null);
            setImagePreview(null);
            console.log('Card added successfully');
          } catch (error) {
            console.error('Error saving card data:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="card-input-form" onSubmit={handleSubmit}>
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
          id="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file" className="button-label">Choose Image</label>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Image Preview" />
          </div>
        )}
        <button type="submit">Add Card</button>
      </div>
    </form>
  );
};

export default CardInputForm;
