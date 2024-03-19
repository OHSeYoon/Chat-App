import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
  } from "react";
  import { AuthContext } from "./AuthContext";
  import { db } from "../firebase";
  import { collection, getDocs,getDoc,doc,setDoc } from "firebase/firestore";
  
  export const ChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const INITIAL_STATE = {
      chatId: "null",
      user: {},
    };

    const [trigger,setTrigger]=useState('');
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":

          const newChatId =
          currentUser.uid > action.payload
            ? currentUser.uid + action.payload
            : action.payload + currentUser.uid;

          return {
            user: action.payload,
            chatId:newChatId,
          };
  
        default:
          return state        
      }
    };

  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);


    const createCode = async (u) => {
      try {
        const chatCode = doc(db, "chats", state.chatId);
        const chatCheck = await getDoc(chatCode);
 
        if (!chatCheck.exists()) {

          await setDoc(chatCode, {
            participants: [u.uid,currentUser.uid],
            messages:'' ,
            last: '',
            createdAt: new Date(),
          });
 
          console.log("CHAT CONETX: CHAT CREATED");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    createCode();
  ;

  useEffect(() => {
    if (trigger) {
      createCode(trigger);
    }
  }, [trigger]);

    return (
      <ChatContext.Provider value={{ data:state, dispatch,createCode,setTrigger }}>
        {children}
      </ChatContext.Provider>
    );
  };