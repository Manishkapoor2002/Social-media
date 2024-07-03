import { useRecoilValue } from "recoil"
import {chatWithUser} from "../../store/atom.js";
import { addDoc, collection, query, serverTimestamp, updateDoc, where, doc, getDocs, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { db } from "../../firebase-config";
import { Chats } from "./Chats";
import { useNavigate } from "react-router-dom";

export const ChatBox = () => {
    const otherPersonName = useRecoilValue(chatWithUser);
    const [otherPerson, setOtherPerson] = useState(null)
    const [currUserDetail, setCurrUserDetail] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [combinedID, setCombinedID] = useState(null);
    const messageRef = collection(db, "chats");
    const usersRef = collection(db, "users");
    const navigate = useNavigate();




    const sendMessageHandle = async (e) => {
        e.preventDefault();
        if (newMessage === "") {
            return;
        }

        await addDoc(messageRef, {
            'text': newMessage,
            'createdAt': serverTimestamp(),
            "sentBy": localStorage.getItem("currentUsername"),
            "combinedID": combinedID,
        });
        setNewMessage("")

        const userDocRef = doc(usersRef, currUserDetail.id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const currentChatList = userData.chatList || [];

            const updatedChatList = currentChatList.filter(chat => chat.uId !== otherPerson.uId);


            updatedChatList.push({
                uId: otherPerson.uId,
                username: otherPerson.username,
                profilePicture: otherPerson.profilePicture,
                lastMessage: newMessage,
                timeStamp: new Date(),
            });

            await updateDoc(userDocRef, {
                chatList: updatedChatList
            });
        } else {
            console.log("User document not found");
        }


        const otherUserRef = doc(usersRef, otherPerson.id);
        const otheruserDoc = await getDoc(otherUserRef);

        if (otheruserDoc.exists()) {
            console.log(otheruserDoc)
            const userData = otheruserDoc.data();
            const currentChatList = userData.chatList || [];
            const updatedChatList = currentChatList.filter(chat => chat.uId !== currUserDetail.uId);

            updatedChatList.push({
                uId: currUserDetail.uId,
                username: localStorage.getItem("currentUsername"),
                profilePicture: currUserDetail.profilePicture,
                lastMessage: newMessage,
                timeStamp: new Date(),
            });

            await updateDoc(otherUserRef, {
                chatList: updatedChatList
            });


        } else {
            console.log("User doc not found!");
        }

    }


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const currUser = localStorage.getItem("currentUsername");

                if (!currUser || !otherPersonName) {
                   return;
                }

                const usersQuery = query(usersRef, where("username", "==", currUser));
                const querySnapshot = await getDocs(usersQuery);
                const usersData = querySnapshot.docs.map(doc => doc.data())[0];
                setCurrUserDetail(usersData);

                const otherUsersQuery = query(usersRef, where("username", "==", otherPersonName));
                const otherQuerySnapshot = await getDocs(otherUsersQuery);
                const otherUsersData = otherQuerySnapshot.docs.map(doc => doc.data())[0];
                setOtherPerson(otherUsersData);

                console.log("otherPerson", otherPerson)
                console.log("currUser", currUserDetail)



            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, [otherPersonName]);


    useEffect(() => {
        if (otherPerson && currUserDetail) {
            if (otherPerson.uId > currUserDetail.uId) {
                setCombinedID(currUserDetail.uId + otherPerson.uId);
            } else {
                setCombinedID(otherPerson.uId + currUserDetail.uId);
            }
        }
    }, [currUserDetail, otherPerson])


    if (!combinedID) {
        return <div style={{
            display: 'flex',
            maxHeight: '75px',
            width: 'auto',
            marginBottom: '10px',
            justifyContent: 'center'
        }}>
            <h2>Start chat with your friends</h2>
        </div>
    } else {
        return <>
            <div style={{
                // width: '600px',
                height: '800px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    maxHeight: '60px',
                    width: 'auto',
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}>
                    <img
                        src={otherPerson.profilePicture}
                        alt={(otherPerson.username).charAt(0).toUpperCase()}
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
                            cursor: 'pointer'
                        }} onClick={() => {
                        navigate('/profile/' + otherPerson.username)
                    }}
                    />
                    <h3 style={{
                        marginLeft: 10,
                        fontSize: '18px',
                        color: '#333',
                        cursor: 'pointer'
                    }} onClick={() => {
                        navigate('/profile/' + otherPerson.username)
                    }}>
                        {otherPerson.username}
                    </h3>
                </div>

                <Chats combinedID={combinedID} />

                <div style={{
                    width: '100%'
                }}>
                    <form autoComplete="off" onSubmit={sendMessageHandle}>
                        <div style={{
                            display: 'flex',
                        }}>
                            <Box
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <TextField autoFocus autoComplete="false" fullWidth label="write your message" id="fullWidth" placeholder="type your message here...." value={newMessage} onChange={(e) => {
                                    setNewMessage(e.target.value);
                                }} />
                            </Box>
                            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                                Send
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>

    }
}


