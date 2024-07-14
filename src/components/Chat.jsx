import React from "react";
import volt from "../img/100.png";
import eletro from "../img/101.png";
import svolt from "../img/S100.png"
import Messages from "./Messages";
import Input from "./Input";
import "./Styles.scss"


const Chat = () => {

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatIcons">
          <img src={volt} alt="" />
          <img src={eletro} alt="" />
          <img src={svolt} alt="" />
        </div>
      </div>
      <Messages />
      <Input/>
      

    </div>
  );
};

export default Chat;