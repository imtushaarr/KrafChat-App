import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      try {
        const data = res.data();
        if (!data) {
          setChats([]);
          return;
        }

        const items = data.chats || [];
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      } catch (err) {
        console.error("Error fetching chats: ", err);
      }
    });

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

    if (chatIndex !== -1) {
      userChats[chatIndex].isSeen = true;

      const userChatsRef = doc(db, "userchats", currentUser.id);

      try {
        await updateDoc(userChatsRef, { chats: userChats });
        changeChat(chat.chatId, chat.user);
      } catch (err) {
        console.error("Error updating chat: ", err);
      }
    }
  };

  const filteredChats = chats.filter(c=> c.user.username.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="Search Icon" />
          <input 
            type="text" 
            placeholder="Search Here"
            onChange={(e)=>setInput(e.target.value)} 
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="Add Icon"
          className="add"
          onClick={() => setAddMode(prev => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div 
          className="item" 
          key={chat.chatId} 
          onClick={() => handleSelect(chat)}
        >
          <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="User Avatar" />
          <div className="texts">
            <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
            <p className={chat.isSeen ? "seen" : "unseen"}>
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;