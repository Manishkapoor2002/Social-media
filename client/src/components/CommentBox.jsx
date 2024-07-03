import { useState } from "react";
import { Button, TextareaAutosize } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { useSetRecoilState } from "recoil";
import {newComment} from "../store/atom.js";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const successCommentUpload = () => toast.success("Comment successfully uploaded!", {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
});

export const CommentBox = ({ postId }) => {
    const [commentDes,setCommentDis] = useState("");
    const setnewCommentHappen  = useSetRecoilState(newComment)

    const commentUploadHandler = (e) =>{
        e.preventDefault();
            setCommentDis("")
            if(commentDes.length === 0){
                alert("you can do empty comment!")
            }else{
                const response = async () =>{
                    try{
                        const result = await axios.post("http://localhost:3030/comment/upload/" +postId,{
                                'commentBody': commentDes
                            },
                            {
                                headers: {
                                    'authentication': localStorage.getItem("token")
                                }
                            });

                        if(result.data.message === 'Comment successfully uploaded'){
                            setnewCommentHappen(true);
                            setCommentDis("");
                            successCommentUpload()
                        }else{
                            alert(result.data.message)
                        }
                    }catch(err){
                        console.log(err);
                    }

                }
                response();
            }
    }
    return <>
    <form autoComplete="off" onSubmit={commentUploadHandler}>
        <div style={{
            display: 'flex',
            justifyContent: 'start',
            minWidth: '100%',
        }}>
            <TextareaAutosize
                margin="normal"
                minRows={5}
                value={commentDes}
                style={{
                    width: '100%',
                }} onChange={(e) => setCommentDis(e.target.value)}
            />
            <Button variant="contained" endIcon={<SendIcon/>} type="submit">
                Post
            </Button>
        </div>
    </form>
        <ToastContainer/>
</>
}