import React, { useState, useEffect, useContext } from 'react';
import { collection, doc, updateDoc, onSnapshot, getDoc,increment } from 'firebase/firestore';
import { db } from '../firebase';
import './Poststyle.css';
import { AuthContext } from '../context/AuthContext';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(AuthContext); // Get the current user

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (id) => {
    const postRef = doc(db, 'posts', id);
    const postSnap = await getDoc(postRef);
    const post = postSnap.data();

    // Handle undefined userReactions field
    const userReactions = post.userReactions || {};
    const currentUserReaction = userReactions[currentUser.uid];

    if (currentUserReaction === 'like') {
      await updateDoc(postRef, {
        like: post.like - 1,
        userReactions: { ...userReactions, [currentUser.uid]: null }
      });
    } else {
      await updateDoc(postRef, {
        like: post.like + (currentUserReaction === 'dislike' ? 2 : 1),
        dislike: post.dislike - (currentUserReaction === 'dislike' ? 1 : 0),
        userReactions: { ...userReactions, [currentUser.uid]: 'like' }
      });
    }
  };

  const handleDislike = async (id) => {
    const postRef = doc(db, 'posts', id);
    const postSnap = await getDoc(postRef);
    const post = postSnap.data();

    const userReactions = post.userReactions || {};
    const currentUserReaction = userReactions[currentUser.uid];

    if (currentUserReaction === 'dislike') {
      await updateDoc(postRef, {
        dislike: post.dislike - 1,
        userReactions: { ...userReactions, [currentUser.uid]: null }
      });
    } else {
      await updateDoc(postRef, {
        like: post.like - (currentUserReaction === 'like' ? 1 : 0),
        dislike: post.dislike + (currentUserReaction === 'like' ? 2 : 1),
        userReactions: { ...userReactions, [currentUser.uid]: 'dislike' }
      });
    }
  };

  const handleClickCount = async (id) => {
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, { clickCount: increment(1) });
  };

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.senderId}</h3>
          {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
          <p>{post.text}</p>
          <div className="post-actions">
            <button
              onClick={() => handleLike(post.id)}
              className={post.userReactions?.[currentUser.uid] === 'like' ? 'active' : ''}
            >
              Like {post.like}
            </button>
            <button
              onClick={() => handleDislike(post.id)}
              className={post.userReactions?.[currentUser.uid] === 'dislike' ? 'active' : ''}
            >
              Dislike {post.dislike}
            </button>
            <button onClick={() => handleClickCount(post.id)}>
              Click {post.clickCount}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


export default PostList;
