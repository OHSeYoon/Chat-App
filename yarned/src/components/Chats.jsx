import { collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [users, setUsers] = useState([]); // Corrected variable name to "users"
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);

        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, data: doc.data() });
        });

        // Set the users data in state
        setUsers(usersData);
        console.log("Chats:", usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers(); // Call the function to fetch users when the component mounts

  }, []);

  const handleSelect = () => {
    console.log("uhjkhj");
  };

  return (
    <div className="chats">
      {users.map((user) => ( // Use "users" state instead of "chats"
        <div
          className="userChat"
          key={user.id} // Access the "id" property of each user object
          onClick={() => handleSelect()}
        >
          <img src={user.data.photoURL} alt="" /> {/* Access user data properties */}
          <div className="userChatInfo">
            <span>{user.data.displayName}</span>
            <p>{user.data.lastMessage?.text}</p>
          </div>
          

        </div>
      ))}
    </div>
  );
};

export default Chats;
