import React from "react";
import Navbar from "./Navbar";
import Chats from "./Chats";
import Chat from "./Chat";

const Sidebar = () => {
    return(
        <div className="sidebar">
            <Navbar/>
            <Chats/>
           
    
        </div>
    )
}

export default Sidebar