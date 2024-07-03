import {useGetProfileDetail} from "../Hooks/useGetProfileDetail.jsx";
import {useNavigate} from "react-router-dom";
import {Box, Button, Modal, Typography} from "@mui/material";
import {useState} from "react";
import {UserPosts} from "./UserPosts.jsx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    backgroundColor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
    height: "600px"
};
export const MyProfile = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('currentUsername');
    const userDetail = useGetProfileDetail(username);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [modalDetail, setModalDetail] = useState({});
    const handleClose = () => {
        setModalDetail({}),
            setOpen(false);
    }


    if(!userDetail){
        return <>
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
                        <Typography component="h1" variant="h5" align="center">Something went wrong !!</Typography>
                    </div>
                    <Button type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}} onClick={() => {
                        navigate('/login')
                    }}>Login Again!
                    </Button>
                </div>
            </div>
        </>
    } else {
        return <>
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
                                    <hr/>
                                    {modalDetail.List && modalDetail.List.map((val, index) => {
                                        return <ListItem key={index} singleUser={val}/>
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
                            }}/>
                        </div>
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}>
                                <Typography component="h1" variant="h5" align="center" paddingRight={'50px'}>
                                    {userDetail.username}
                                </Typography>

                                <Button variant="contained" onClick={() => {
                                    navigate('/edit-profile')
                                }}>
                                    Edit Profile
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
                        <UserPosts username={userDetail.username}/>
                    </div>
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