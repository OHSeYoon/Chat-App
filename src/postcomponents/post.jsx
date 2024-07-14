import React, { useState, useContext } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../context/AuthContext';
import { db, storage } from '../firebase';
import './Poststyle.css';

const Post = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { currentUser } = useContext(AuthContext); // Get the current user

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    try {
      await addDoc(collection(db, 'posts'), {
        senderId: currentUser.uid, // Set senderId to currentUser.uid
        text,
        imageUrl,
        like: 0,
        dislike: 0,
        clickCount: 0,
        userReactions: {} // Initialize empty object to track user reactions
      });
      setText('');
      setImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input type="file" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}  
      <button type="submit">Post</button>
    </form>
  );
};

export default Post;
