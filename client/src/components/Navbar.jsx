import {useRecoilState, useSetRecoilState} from "recoil"
import {styled, alpha} from '@mui/material/styles';
import {Modal, Box, Typography, Button, TextField, CircularProgress} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react"
import axios from "axios";
import {isLogin} from "../store/atom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import debounce from "lodash.debounce";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import {chatWithUser} from "../store/atom";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
    height: "600px"

};

const SearchListSytle = {
    position: 'absolute',
    top: '99px',
    left: '45%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
}


const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const uploadSuccess = () => toast.success("Post Uploaded Successfully!", {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
});

const uploadError = () => toast.warning("Post Uploaded Successfully!", {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
});

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export const Navbar = () => {
    const navigate = useNavigate()

    const [login, setLogin] = useRecoilState(isLogin)
    const currUS = localStorage.getItem('currentUsername')
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false);
    const [postBody, setpostBody] = useState("");
    const [users, setUsers] = useState(null);
    const setChatWithUser = useSetRecoilState((chatWithUser))
    const [openSearch, setOpenSearch] = useState(false);
    const [showSearchTerm,setShowSearchTerm] = useState("");
    const [showImg, setShowImg] = useState("https://i0.wp.com/read.crowdfireapp.com/wp-content/uploads/2023/02/Blog_Banner_5_Great_Tools_to_Simultaneously_Post_Content_to_Multiple_Social_Media_Sites.png?resize=810%2C580&ssl=1");
    const handleOpen = () => setOpen(true);
    const handleSearchOpen = () => setOpenSearch(true);
    const handleSearchClose = () => {
        setOpenSearch(false);
        setShowSearchTerm("")
    }
    const handleClose = () => setOpen(false)

    const debounceRequest = debounce(async (searchedname) => {
        try {
            const response = await axios.get(`http://localhost:3030/profile/search/${searchedname}`, {
                headers: {
                    'Authentication': localStorage.getItem("token")
                }
            });
            if (response.data.message === 'User Data Send Successfully') {
                setUsers(response.data.userDetail)
                handleSearchOpen()
            } else {
                setUsers(null)
                handleSearchOpen()
            }
        } catch (err) {
            console.error('Error occurred while searching for user:', err);
        }

    }, 2000);

    const handlePostUpload = async () => {

        if (!image) {
            alert("Select photo")
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);
        let URL = "";

        try {
            const result = await axios.post("http://localhost:3030/post/imageUrlGen", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(result.data.message === 'File uploaded successfully'){
                URL = result.data.imageUrl;
                console.log(URL)
            }else{
                console.log("something went wrong!")
                return;
            }
        } catch (err) {
            console.log(err)
            setLoading(false);
        }

        try {
            const result = await axios.post("http://localhost:3030/post/upload", {
                "imageURL": URL,
                postBody,
            }, {
                headers: {
                    'authentication': localStorage.getItem("token")
                }
            });

            if (result.data.message === "post uploaded successfully") {
                handleSearchClose();
                setLoading(false);
                uploadSuccess()
                handleClose()
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
            uploadError()
        }
    }

    // about me useEffect:
    useEffect(() => {
        const response = async () => {
            try {
                const result = await axios.get('http://localhost:3030/user/me', {
                    headers: {
                        'authentication': localStorage.getItem("token")
                    }
                });
                if (!result) {
                    console.log("something went wrong")
                    setLogin(false)
                }

                if (result.data.message === 'Logged in') {
                    setLogin(true);
                } else {
                    setLogin(false)
                }
            } catch (err) {
                console.log("something went wrong", err);
                setLogin(false)
            }
        }
        response();

    }, [login, currUS])

    return (<>
        {login ? (<div>
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignContent: 'center',
                    backgroundColor: 'lightBlue',
                    width: '100%',
                    padding: '10px',
                    margin: '10px',
                    borderRadius: '5px',
                    position: 'fixed',
                    top: 0

                }}>
                    <Typography style={{
                        cursor: 'pointer'
                    }} variant="h4" onClick={() => {
                        navigate('/');
                        setTimeout(()=>{
                            setShowSearchTerm("")
                        },1000)
                        
                    }}>MinMax</Typography>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon/>
                            </SearchIconWrapper>
                            <StyledInputBase
                                value={showSearchTerm}
                                onChange={(e) => {
                                    debounceRequest(e.target.value);
                                    setShowSearchTerm(e.target.value)
                                }}
                                placeholder="Search…"
                                inputProps={{'aria-label': 'search'}}
                            />
                        </Search>
                        <Modal
                            keepMounted
                            open={openSearch}
                            onClose={handleSearchClose}
                        >
                            <Box sx={SearchListSytle}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '16px',
                                    padding: '1%',
                                    border: '2px solid #ccc',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#f9f9f9',
                                    width: 'auto',
                                    height: '100%'
                                }} onClick={() => {
                                    navigate('/profile/' + users.username)
                                    handleSearchClose()
                                }}>
                                    <div>
                                        <img
                                            src={users ? users.profilePicture : "http://res.cloudinary.com/dzfvpd08i/image/upload/v1717259736/minMax-post-2024-6-1%2022:5:34.png"}
                                            alt={users ? users.username : "User Not Found"}
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
                                        <div style={{
                                            fontWeight: 'bold', fontSize: '16px', color: '#333'
                                        }}>{users ? users.username : "UserNot Found"}</div>
                                    </div>
                                </div>
                            </Box>
                        </Modal>

                    </div>
                    <div style={{
                        display: 'flex', justifyContent: 'space-around', alignContent: 'center', width: '400px',
                    }}>
                        <Button variant="outlined" onClick={() => navigate('/chats')}>Message</Button>
                        <Button variant="outlined" onClick={handleOpen}>Post</Button>
                        <Button variant="outlined" onClick={() => {
                            navigate('/my-profile')
                        }}>Profile</Button>
                        <Button variant="outlined" onClick={() => {
                            localStorage.setItem("token", "");
                            localStorage.setItem("currentUsername", "");
                            localStorage.setItem("currentUserId", "");
                            setChatWithUser(null)
                            setLogin(false);
                            navigate('/login')
                        }}>Log out</Button>

                    </div>
                </div>

                <Modal
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={style}>
                        <Typography component="h1" variant="h5" fontWeight={600} align="center">
                            Create new post
                        </Typography>
                        <hr/>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '8px',
                                    width: '100%',
                                    height: '300px',
                                    overflow: 'hidden',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={showImg}
                                    alt="Preview"
                                    style={{width: 'auto', height: '100%'}}
                                />
                            </div>
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon/>}
                                style={{marginBottom: '20px'}}
                            >
                                Upload Photo/Video
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => {
                                        setShowImg(URL.createObjectURL(e.target.files[0]))
                                        setImage(e.target.files[0]);
                                    }}
                                />
                            </Button>
                            <TextField
                                label="Type something…"
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                                onChange={(e) => setpostBody(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePostUpload}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24}/> : 'Post'}
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </div>
            <ToastContainer/>
        </div>) : (<div>
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignContent: 'center',
                    backgroundColor: 'lightBlue',
                    width: '100%',
                    padding: '10px',
                    margin: 0,
                    borderRadius: '5px'
                }}>
                    <Typography style={{
                        cursor: 'pointer'
                    }} variant="h4" onClick={() => {
                        navigate('/');
                    }}>MinMax</Typography>
                    <div style={{
                        display: 'flex', justifyContent: 'space-around', alignContent: 'center', width: '400px',
                    }}>

                        <Button variant="outlined" onClick={() => {
                            navigate('/login')
                        }}>Login</Button>
                        <Button variant="outlined" onClick={() => {
                            navigate('/signup')
                        }}>Sign up</Button>
                    </div>

                </div>
            </div>
        </div>)}
    </>)

}