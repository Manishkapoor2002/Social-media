import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState } from "recoil";
import { signupUsername } from "../../store/atom";
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce'

const notifyUserExist = () => toast.warning("Username already exists!", {
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
const notifyUsernameIsShort = () => toast.warning("username is too short!!", {
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

const getSearchUsername = async (username) => {
    const usernameCheck = await axios.get('http://localhost:3030/isAvailable/username/' + username)
    return usernameCheck.data.message;
}

function UsernameInput() {
    const setUsername = useSetRecoilState(signupUsername)
    const debounceRequest = debounce(async (text) => {
        if (text.length > 6) {
            const result = await getSearchUsername(text)
            if (result && result == 'username is available') {
                setUsername(text)
            } else if (result == 'username is not available') {
                notifyUserExist()
                setUsername('')
            } else {
                setUsername('')
                notifyWentWrong();
            }
        } else {
            notifyUsernameIsShort()
        }

    }, 1000);


    return (
        <div>
            <TextField
                required
                margin="normal"
                fullWidth
                name="username"
                autoComplete="username"
                autoFocus
                id="outlined-required"
                label="Username"
                defaultValue=""
                onChange={(e) => debounceRequest(e.target.value)} />
            <ToastContainer />
        </div>

    );

}

export default UsernameInput;