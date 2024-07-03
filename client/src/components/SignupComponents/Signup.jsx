import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import UsernameInput from './Username';
import { UserEmailInput } from './UserEmail';
import { UserPasswordInput } from './UserPass';
import { Typography, Button, CircularProgress } from '@mui/material';
import { isLogin, signUpPassword, signupEmail, signupUsername } from '../../store/atom';
import { useRecoilState, useRecoilValue } from 'recoil'
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase-config'

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

const notifyWentWrong = () => toast.warning("Missing details or Something went wrong!!", {
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
const notifySuccessfull = () => toast.success("Signup successfully!!", {
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

export const SignUp = () => {
    const navigate = useNavigate()
    const username = useRecoilValue(signupUsername)
    const email = useRecoilValue(signupEmail)
    const password = useRecoilValue(signUpPassword)
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null)
    const [showImg, setShowImg] = useState("http://res.cloudinary.com/dzfvpd08i/image/upload/v1717259736/minMax-post-2024-6-1%2022:5:34.png");

    const [login, setIsLogin] = useRecoilState(isLogin);

    const handleSignUp = async (event) => {
        event.preventDefault();
        console.log(username, password, email)

        if (username === '' || password === '' || email === '') {
            notifyWentWrong()
        } else {
            try {
                setLoading(true)
                let URL;
                if (image) {
                    const formData = new FormData();
                    formData.append("image", image);
                    const result = await axios.post("http://localhost:3030/post/imageUrlGen", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    URL = result.data.imageUrl;
                }

                const user = await axios.post('http://localhost:3030/user/signup', {
                    username,
                    password,
                    email,
                    'profilePicture': URL || ''
                });

                if (user.data.message === 'User has been created') {
                    notifySuccessfull();
                    setLoading(false)

                    localStorage.setItem('currentUsername',username);
                    localStorage.setItem("token", "Bearer " + user.data.token)
                    localStorage.setItem("currentUserId", user.data.userID)

                    // also store in firestore for use in real time chat :
                    const uId = user.data.userID;

                    const docRef = await addDoc(collection(db, "users"), {
                        'uId': uId,
                        "username": username,
                        "chatList": [],
                        'profilePicture': URL || "http://res.cloudinary.com/dzfvpd08i/image/upload/v1717259736/minMax-post-2024-6-1%2022:5:34.png",
                    });
                    await updateDoc(docRef, {
                        "id": docRef.id
                    });
                    console.log("Document written with ID: ", docRef.id);
                    setTimeout(() => {
                        setIsLogin(true)
                        navigate("/");
                    }, 1000)
                } else {
                    setLoading(false)
                    notifyWentWrong()
                }
            } catch (err) {
                setLoading(false)
                console.error(err);
            }
        }
    }

    if (login) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90vh',
            flexDirection: 'column',
        }}>
            <div>
                <Typography component="h1" variant="h5" align="center">Your are already Loged in !!</Typography>
                <br />
                <Typography component="h1" variant="h6" align="center"> To create new account please logout first!</Typography>

                <Button type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }} onClick={() => {
                        navigate('/')
                    }}>Go to Home page</Button>
                <Button type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }} onClick={() => {
                        localStorage.setItem("token", "");
                        localStorage.setItem('currentUsername',+ "");
                    // setCurrentUsername('');
                        setIsLogin(false);
                    }}>Log out</Button>
            </div>
        </div>
    } else {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '50px',
            }}>
                <div>
                    <Typography component="h1" variant="h5" align="center">
                        Sign in
                    </Typography>

                    <form onSubmit={handleSignUp}>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '30px',
                            padding: '16px',
                            borderRadius: '4px',
                        }}>
                            <div style={{
                                width: '65%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <img
                                    src={showImg}
                                    alt="Image"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        backgroundColor: '#2196f3',
                                        color: '#fff',
                                    }}
                                />
                            </div>
                            <div style={{
                                width: '35%',
                            }}>
                                <Button
                                    component="label"
                                    variant="contained"
                                    color="primary"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload file
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setShowImg(URL.createObjectURL(e.target.files[0]));
                                                setImage(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </Button>
                            </div>
                        </div>
                        <UsernameInput />
                        <UserEmailInput />
                        <UserPasswordInput />
                        <Button type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}>
                            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                        </Button>
                        <ToastContainer />
                    </form>
                </div>
            </div>
        );
    }
}
