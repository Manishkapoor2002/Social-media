import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRecoilState  } from "recoil";
import Typography from '@mui/material/Typography';
import { isLogin } from "../store/atom";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const successLogin = () => toast.success("Login Successfully!", {
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

const notifyWentWrong = () => toast.warning("Something went wrong!!", {
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

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [login, setLogin] = useRecoilState(isLogin)

    // login handler 
    const loginHandle = async (e) => {
        e.preventDefault()

        if (!username || !password || username.length === 0 || password.length === 0) {
            return;
        }
        try {
            const result = await axios.post('http://localhost:3030/user/login', {
                username,
                password
            });
            if (result && result.data.message === 'User has been successfully logged in') {
                successLogin()
                localStorage.setItem('token', "Bearer " + result.data.token);
                localStorage.setItem('currentUsername', username);
                localStorage.setItem('currentUserId', result.data.userId);

                setTimeout(() => {
                    setLogin(true);
                    navigate('/');
                }, 1000)
            }else{
            console.log(result.data.message)
                notifyWentWrong()
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (login) {
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
                        <Typography component="h1" variant="h5" align="center">Your are already Loged in !! </Typography>
                    </div>
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
                        localStorage.setItem('token', "");
                        localStorage.setItem('currentUsername', '');
                            setLogin(false);
                        }}>Log out</Button>
                </div>
            </div>
        </>
    } else {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '50px',
            }}>
                <div>
                    <form autoComplete="off" onSubmit={loginHandle}>
                        <Typography component="h1" variant="h5" align="center">
                            Login
                        </Typography>
                        <TextField
                            required
                            margin="normal"
                            fullWidth
                            name="email"
                            autoComplete="email"
                            autoFocus
                            id="outlined-required"
                            label="Username"
                            defaultValue=""
                            onChange={(e) => setUsername(e.target.value)} />
                        <TextField
                            required
                            type="password"
                            margin="normal"
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            defaultValue="" onChange={(e) => setPassword(e.target.value)} />

                        <Button type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }} > Login</Button>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        )
    }




}