import { useCallback } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { toast } from "react-toastify";
import "./detail.css";

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();

    const handleBlock = useCallback(async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });

            changeBlock();
            toast.success(isReceiverBlocked ? "User Unblocked" : "User Blocked");
        } catch (err) {
            console.error(err);
            toast.error("Error updating block status.");
        }
    }, [user, currentUser.id, isReceiverBlocked, changeBlock]);

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="User Avatar" />
                <h2>{user?.username}</h2>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowDown.png" alt="Expand/Collapse" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>KrafChat Privacy & Help</span>
                        <img src="./arrowDown.png" alt="Expand/Collapse" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="Expand" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowDown.png" alt="Expand/Collapse" />
                    </div>
                </div>
                <button onClick={handleBlock}>
                    {isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User Blocked" : "Block User"}
                </button>
                <button className="logout" onClick={() => auth.signOut()}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Detail;