import React, { useContext } from "react";
import unoun from "../img/201.png";
import balt from "../img/343.png";
import chim from "../img/358.png";
import Messages from "./Messages";
import Input from "./Input";
import "./Styles.scss"

import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={unoun} alt="" />
          <img src={balt} alt="" />
          <img src={chim} alt="" />
        </div>
      </div>
      <Messages />
      <Input/>
      

    </div>
  );
};

export default Chat;