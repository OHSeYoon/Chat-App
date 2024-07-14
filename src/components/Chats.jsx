import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import './Styles.scss';

const Chats = ({ onSelectMessage }) => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch, setTrigger } = useContext(ChatContext);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, data: doc.data() });
        });

        setUsers(usersData);
        console.log('Chats:', usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

  const handleSelect = async (user) => {
    const chatId =
      currentUser.uid > user.id
        ? currentUser.uid + user.id
        : user.id + currentUser.uid;

    dispatch({ type: 'CHANGE_USER', payload: user.id });
    console.log(`Chats: \nSelected User: ${user.id}\nCurrent User: ${currentUser.uid}`);
    setTrigger(chatId);

  };

  return (
    <div className="chats">
      {users.map((user) => {
        const chatId =
          currentUser.uid > user.id
            ? currentUser.uid + user.id
            : user.id + currentUser.uid;

        return (
          <div
            className="userChat"
            key={user.id}
            onClick={() => handleSelect(user)}
          >
            <img src={user.data.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{user.data.displayName}</span>
              <p>
                {user.data.conversation && user.data.conversation[chatId]
                  ? user.data.conversation[chatId]
                  : 'NO MESSAGE'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
