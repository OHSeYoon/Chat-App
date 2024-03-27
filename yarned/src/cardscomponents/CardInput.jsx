import React, { useState } from 'react';

const CardInputForm = ({ onAddCard }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !imageFile) return;

    // Convert image file to base64 data URL
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      const imageUrl = reader.result;
      onAddCard({ title, description, imageUrl });
    };

    setTitle('');
    setDescription('');
    setImageFile(null);
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
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <button type="submit">Add Card</button>
    </form>
  );
};

export default CardInputForm;