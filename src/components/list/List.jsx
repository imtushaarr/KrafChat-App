import ChatList from "./chatList/ChatList.jsx";
import "./list.css"
import Userinfo from "./userInfo/Userinfo.jsx";

const List = () => {
    return (
        <div className="list">
            <Userinfo/>
            <ChatList/>
        </div>
    )
}

export default List;