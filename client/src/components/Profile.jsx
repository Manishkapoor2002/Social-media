import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import {useGetProfileDetail} from "../Hooks/useGetProfileDetail.jsx";
import {Box, Button, Modal, Typography} from "@mui/material";
import axios from "axios";
import {UserPosts} from "./UserPosts.jsx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
    height: "600px"
};



export const Profile = () => {
    const navigate = useNavigate();
    const params = useParams();
    const currUsername = localStorage.getItem('currentUsername')
    const userName = params.username;
    const [modalDetail, setModalDetail] = useState({});
    const [doesFollow, setDoesFollow] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [followerLen,setFollowerLen] = useState(0);
    const handleClose = () => {
        setModalDetail({}),
            setOpen(false);
    }

    useEffect(() => {
        if (currUsername === userName) {
            navigate('/my-profile');
        }
    }, [userName]);


    const userDetail = useGetProfileDetail(userName);
    // console.log("user : ",userDetail.followers);

    // following user or not
    useEffect(() => {

        const response = async () => {
            try {
                const result = await axios.get(
                    "http://localhost:3030/user/isFollowing/" + userName,
                    {
                        headers: {
                            'authentication': localStorage.getItem("token")
                        }
                    }
                );
                if (result.data.message === 'Already Following') {
                    setDoesFollow(true);
                } else if (result.data.message === 'Not Following') {
                    setDoesFollow(false);
                }
            } catch (err) {
                console.log(err);
            }
        }
        response();

    }, [userName,doesFollow])

        const FollowUnFollowandler = () => {
                if (doesFollow){
                    const response = async () => {
                        try {
                            const result = await axios.get(
                                "http://localhost:3030/user/unfollow/" + userName,
                                {
                                    headers: {
                                        'authentication': localStorage.getItem("token")
                                    }
                                }
                            );
                            console.log(result.data.message)

                            if (result.data.message === 'unfollow successfully') {
                                setDoesFollow(false);
                            } else if (result.data.message === 'Something went wrong') {
                                console.log('Something went wrong');
                            } else {
                                console.log('message :   ' + result.data.message);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    response();
                }else {
                    // start following handler
                    const response = async () => {
                        try {
                            const result = await axios.get(
                                "http://localhost:3030/user/follow/" + userName,
                                {
                                    headers: {
                                        'authentication': localStorage.getItem("token")
                                    }
                                }
                            );

                            if (result.data.message === 'followed successfully') {
                                setDoesFollow(true);
                            } else if (result.data.message === 'Something went wrong') {
                                console.log('Something went wrong');
                            } else {
                                console.log('message :   ' + result.data.message);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    response();
                }

        }

    if(userDetail){
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                marginTop: '60px'
            }}>

                <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            {modalDetail && (
                                <>
                                    <Typography id="modal-modal-title" align="center" variant="h6" component="h2">
                                        {modalDetail.modalFor}
                                    </Typography>
                                    <hr />
                                    {modalDetail.List && modalDetail.List.map((val, index) => {
                                        return <ListItem key={index} singleUser={val} />
                                    })}
                                </>
                            )}
                        </Box>
                    </Modal>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop: '60px',
                    flexDirection: 'column'
                }}>

                    <div style={{

                        display: 'flex',
                        justifyContent: 'space-around',
                        alignContent: 'center',
                        width: '700px',
                        padding: '50px'
                    }}>
                        <div>

                            <img src={userDetail.profilePicture} alt="" style={{
                                height: '150px',
                                width: '150px',
                                borderRadius: '50%'
                            }} />
                        </div>
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}>
                                <Typography component="h1" variant="h5" align="center" paddingRight={'50px'}>
                                    {userDetail.username}
                                </Typography>

                                <Button onClick={FollowUnFollowandler} variant="contained">
                                    {!doesFollow ? "Follow" : "UnFollow"}
                                </Button>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '20px'
                            }}>

                                <span>{userDetail.totalPost} Posts</span>
                                <span style={{
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    setModalDetail({
                                        'modalFor': 'Following',
                                        'List': userDetail.followings
                                    })
                                    handleOpen()
                                }}>{userDetail.followings.length} Following </span>
                                <span style={{
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    setModalDetail({
                                        'modalFor': 'Followers',
                                        'List': userDetail.followers
                                    })
                                    handleOpen()

                                }}>{userDetail.followers.length} Followers</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '20px'
                            }}>
                                {userDetail.userDescription}
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignContent: 'center',
                        maxWidth: '900px',
                        padding: '50px'
                    }}>
                        <UserPosts username={userDetail.username} />
                    </div>
                </div>
            </div>
        )

    } else {
        return <>

            <div style={{
                background: 'red',
                height:'100%'
            }}></div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
                flexDirection: 'column',
            }}>
                <div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>
                        <Typography component="h1" variant="h5" align="center">User Not Found !!</Typography>
                    </div>
                    <Button type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}} onClick={() => {
                        navigate('/')
                    }}>Go to Home
                    </Button>
                </div>
            </div>
        </>
    }

}


// eslint-disable-next-line react/prop-types
function ListItem({singleUser}) {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex', justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer', marginBottom: '16px', padding: '1%', border: '2px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f9f9f9',
        }} onClick={() =>
            navigate('/profile/' + singleUser.username)
        }>
            <div>
                <img
                    src={singleUser.profilePicture}
                    alt={singleUser.username}
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
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>{singleUser.username}</div>
            </div>
        </div>
    );
}