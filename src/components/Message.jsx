import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Unoun from "../img/101.png";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
              message.img
          }
          alt={Unoun}
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
      </div>
    </div>
  );
};

export default Message;