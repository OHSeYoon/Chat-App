import { collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [users, setUsers] = useState([]); 
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch,createCode,setTrigger } = useContext(ChatContext);


  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);

        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, data: doc.data() });
        });

    
        setUsers(usersData);
        console.log("Chats:", usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers(); 

  }, []);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u.id });
    console.log(`Chats: \nSelected User: ${u.id}\nCurrent User: ${currentUser.uid}`);
    console.log("TESTING",u.data[data.chatId])
    setTrigger(u)

  };

  return (
    <div className="chats">
      {users.map((user) => ( 
        <div
          className="userChat"
          key={user.id} 
          onClick={() => handleSelect(user)}
        >
          <img src={user.data.photoURL} alt="" /> 
          <div className="userChatInfo">
            <span>{user.data.displayName}</span>
            {user.data[data.chatId] && (
    <p>{user.data[data.chatId]}</p>
)}
          </div>
          

        </div>
      ))}
    </div>
  );
};

export default Chats;
