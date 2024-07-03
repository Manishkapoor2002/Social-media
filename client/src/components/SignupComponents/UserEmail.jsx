import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState } from "recoil";
import { signupEmail } from "../../store/atom";
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';

const notifyEmailExist = () => toast.warning("Email already exists!!",{
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition:Bounce,
    });

const notifyWentWrong = () => toast.warning("Something went wrong!!",{
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition:Bounce,
    });

const notifyEmailNotValid = () => toast.warning("Email is Invalid!!",{
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition:Bounce,
    });



const getSearchUserEmail = async (mail) => {
    const emailCheck = await axios.get('http://localhost:3030/isAvailable/email/' + mail)
    return emailCheck.data.message;
}


export const UserEmailInput = () => {
    const setUserEmail = useSetRecoilState(signupEmail);

    const checkEmail = (mail) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(mail)) {
            return false;
        }
        return true;
    }

    const debounceRequest = debounce(async (mail) => {
        if (checkEmail(mail)) {
            const result = await getSearchUserEmail(mail)
            if (result == 'email is available') {
                setUserEmail(mail);
            } else if (result == 'email is not available') {
                notifyEmailExist()
                setUserEmail('');
            } else {
                setUserEmail('');
                notifyWentWrong();
            }
        } else {
            notifyEmailNotValid();
        }
    }, 2000);


    return (
        <div>
            <TextField
                required
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                defaultValue="" onChange={(e) => debounceRequest(e.target.value)} />
            <ToastContainer />
        </div>
    );

}
