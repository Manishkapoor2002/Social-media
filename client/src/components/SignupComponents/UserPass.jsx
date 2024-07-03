import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilState } from "recoil";
import { signUpPassword } from "../../store/atom";
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce'

const notifyPassNotMatch = () => toast.warning("Passwords do not match!!", {
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
const notifyPassIsShort = () => toast.warning("Passwords too short!!", {
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


const checkPasswordMatch = (password, cPassword) => {
    if (password !== cPassword) {
        return false;
    }
    return true;
};


export const UserPasswordInput = () => {
    const [password, setPassword] = useRecoilState(signUpPassword)


    const debounceRequestPassword = debounce((pass) => {
        if (pass.length > 6) {
            setPassword(pass);
        } else {
            setPassword('');
            notifyPassIsShort()
        }

    }, 500)


    const debounceRequestPasswordCheck = debounce((pass) => {
        if (checkPasswordMatch(password, pass)) {
            setPassword(pass);
        } else {
            setPassword('');
            notifyPassNotMatch();
        }

    }, 300)

    return <>
        <TextField
            type="password"
            required
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            name="password"
            defaultValue="" onChange={(e) => debounceRequestPassword(e.target.value)} />

        <TextField
            type="password"
            required
            margin="normal"
            fullWidth
            id="comfirm-password"
            label="Comfirm Password"
            name="comfirm-password"
            defaultValue="" onChange={(e) => debounceRequestPasswordCheck(e.target.value)} />

        <ToastContainer />
    </>
}

