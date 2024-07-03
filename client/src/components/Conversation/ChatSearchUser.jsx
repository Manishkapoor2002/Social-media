import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useEffect, useState } from "react"
import { useSetRecoilState } from "recoil";
import { chatWithUser, currUserId } from '../../store/atom.js'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export const ChatUserSearch = () => {
    const usersRef = collection(db, "users");
    const currUser = localStorage.getItem("currentUsername");
    const [searchUser, setSearchUser] = useState("");
    const [userDetail, setUserDetail] = useState(null);
    const  setcurrUserId  = useSetRecoilState(currUserId);
    const setChatWithUser = useSetRecoilState(chatWithUser)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersQuery = query(usersRef, where("username", "==", currUser));
                const querySnapshot = await getDocs(usersQuery);
                const usersData = querySnapshot.docs.map(doc => doc.data())[0];
                setcurrUserId(usersData.uId);
                console.log(usersData.uId)
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, [currUser])

    const SearchHandler = async (e) => {
        e.preventDefault();
        if (searchUser === "" || searchUser === null || searchUser === currUser) {
            return;
        }

        const fetchUsers = async () => {
            try {
                const usersQuery = query(usersRef, where("username", "==", searchUser));
                const querySnapshot = await getDocs(usersQuery);
                const usersData = querySnapshot.docs.map(doc => doc.data())[0];
                setUserDetail(usersData);
                console.log(usersData)
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }


    return <>
        <div>
            <form onSubmit={SearchHandler}>
                <div style={{
                    display: 'flex',
                    marginTop:'50px'
                }}>
                    <Box
                        sx={{
                            width: '100%',
                        }}
                    >
                        <TextField fullWidth type="text" name="" id="" onChange={(e) => setSearchUser(e.target.value)} />
                    </Box>
                    <Button type="submit" variant="contained">
                        Search
                    </Button>
                </div>

            </form>
            <br />
            <div style={{
                // padding: userDetail ? '10px 0px' : '0px',
                margin: userDetail ? '0px 0px 10px 0px' : '0px',
                display: userDetail ? 'block' : 'none',
            }}>
                {userDetail && (
                    <div style={{
                        display: 'flex', justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer', padding: '1%', border: '2px solid #ccc',
                        backgroundColor: '#f9f9f9', height:'50px'
                    }} onClick={() => {
                        setChatWithUser(userDetail.username);
                        setTimeout(() => {
                            setUserDetail(null);
                        }, 100)
                    }}>
                        <div>
                            <img
                                src={userDetail.profilePicture}
                                alt={(userDetail.username).charAt(0).toUpperCase()}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    marginRight: '15px',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>{userDetail.username}</div>
                        </div>
                    </div>
                )}

            </div>
        </div >
    </>
}
