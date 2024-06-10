import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const [trigger, setTrigger] = useState('');

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        const newChatId =
          currentUser.uid > action.payload
            ? currentUser.uid + action.payload
            : action.payload + currentUser.uid;

        return {
          ...state, // In this way ANY OTHER change on the state WILL NOT change EXEPT user and chatID
          user: action.payload,
          chatId: newChatId,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  useEffect(() => {
    const createCode = async () => {
      if (!trigger) return;

      try {
        const chatCode = doc(db, "chats", state.chatId);
        const chatCheck = await getDoc(chatCode);

        if (!chatCheck.exists()) {
          await setDoc(chatCode, {
            participants: [trigger, currentUser.uid],
            messages: '',
            createdAt: new Date(),
          });

          console.log("CHAT CONTEXT: CHAT CREATED");
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    };

    createCode();
  }, [trigger, state.chatId, currentUser.uid]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch, setTrigger }}>
      {children}
    </ChatContext.Provider>
  );
};
