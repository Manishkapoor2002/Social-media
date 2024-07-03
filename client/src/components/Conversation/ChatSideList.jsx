import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useEffect, useState } from "react";
import { ChatUserSearch } from "./ChatSearchUser";
import { chatWithUser} from "../../store/atom.js";
import { useSetRecoilState } from "recoil";

export const ChatSideList = () => {
    const usersRef = collection(db, "users");
    const username = localStorage.getItem("currentUsername");
    const [allUsers, setAllUsers] = useState([]);
    const setChatWithUser = useSetRecoilState(chatWithUser)


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersQuery = query(usersRef, where("username", "==", username));

                const querySnapshot = await getDocs(usersQuery);
                const usersData = querySnapshot.docs.map(doc => doc.data())[0].chatList.sort((a, b) => b.timeStamp - a.timeStamp);
                console.log("usersData : ", usersData)
                if (usersData) {
                    setAllUsers(usersData);
                    console.log("ChatList users: ", usersData);
                }
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };


        fetchUsers();
    }, [username]);

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',

            }}>
                <div>
                    <ChatUserSearch />
                </div>
                <div>
                    {allUsers.map((user, index) => (
                        user && user.username !== username && (

                            <AllUsers key={index} userDetail={user} setChatWithUser={setChatWithUser} />
                        )
                    ))}
                </div>
            </div>
        </>
    );
};

function AllUsers(props) {
    const setChatWithUser = props.setChatWithUser;
    const { lastMessage, profilePicture, username, uId, timeStamp } = props.userDetail;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            width: 'auto',
            padding: '12px',
            borderBottom: '1px solid #efefef',
            cursor: 'pointer',
            backgroundColor: '#ffffff',
        }} onClick={() => setChatWithUser(username)}>
            <img
                src={profilePicture}
                alt={username.charAt(0).toUpperCase()}
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ccc',
                    fontSize: '24px',
                    color: '#fff',
                }}
            />
            <div style={{ flex: 1, marginLeft: 10 }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                }}>
                    <div style={{
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#262626',
                    }}>
                        {username}
                    </div>
                    <div style={{
                        fontSize: '12px',
                        color: '#8e8e8e',
                    }}>
                        {TimeCal(timeStamp)}
                    </div>
                </div>
                <div style={{
                    fontSize: '14px',
                    lineHeight: '18px',
                    color: '#8e8e8e',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '250px'
                }}>
                    {lastMessage}
                </div>
            </div>
        </div>


    )


}

function TimeCal(timestamp) {
    const now = new Date();
    const timestampDate = timestamp.toDate();
    const differenceInMs = now - timestampDate;

    const seconds = Math.floor(differenceInMs / 1000);
    if (seconds < 60) return `just now`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return `yesterday`;
    if (days < 7) return `${days} days ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;

    const years = Math.floor(days / 365);
    return `${years} years ago`;
}