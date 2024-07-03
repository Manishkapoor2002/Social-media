import { useEffect, useState ,useRef} from "react";
import { collection, query, where, orderBy, onSnapshot,serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase-config";

const chatContainerStyle = {
    height: '80%',
    overflowY: 'auto',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    width: 'auto'
};

const userNameStyle = {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
    display: 'block',
};

const messageStyle = (isCurrentUser) => ({
    textAlign: isCurrentUser ? 'right' : 'left',
    padding: '10px',
    margin: '5px 0',
    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
    backgroundColor: isCurrentUser ? 'lightblue' : '#fff',
    border: isCurrentUser ? '1px solid #cce5b1' : '1px solid #ddd',
    borderRadius: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
});

export const Chats = ({ combinedID }) => {
    const [messages, setMessages] = useState([]);
    const currUser = localStorage.getItem("currentUsername")
    const chatEndRef = useRef(null);


    useEffect(() => {
        if (!combinedID) return;

        const messageRef = collection(db, "chats");
        const queryMessage = query(messageRef, where("combinedID", "==", combinedID), orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
            const msg = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data) {
                    msg.push({
                        id: doc.id,
                        text: data.text,
                        createdAt: serverTimestamp(),
                        combinedID: data.combinedID,
                        sentBy: data.sentBy
                    });
                }
            });
            setMessages(msg);
        }, (error) => {
            console.error('Error fetching messages:', error);
        });

        return () => unsubscribe();
    }, [combinedID]);


    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div style={chatContainerStyle}>
            {messages.map((msg, id) => (
                <div style={messageStyle(msg.sentBy === currUser)} key={id}>
                    {msg.userName !== currUser && <h5 style={userNameStyle}>{msg.sentBy}:</h5>}
                    <span>{msg.text}</span>
                    <div ref={chatEndRef} />
                </div>
            ))}
        </div>
    );
};

export default Chats;
