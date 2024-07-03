import Heart from "react-heart";
import CommentIcon from '@mui/icons-material/Comment';
import { useEffect, useState } from "react";
import { Modal, Box, Typography } from '@mui/material';
import axios from "axios";
// import {CommentSection} from "./CommentSection";
// import CommentBox from "./CommentBox";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer , Bounce, toast} from "react-toastify";
import {CommentSection} from "./CommentSection.jsx";
import {CommentBox} from "./CommentBox.jsx";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    backgroundColor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
    height: "600px"
};

const allPostSeen = () => toast.success("No more Posts,You see all of them!", {
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

export default function Home() {
    const [allPost, setAllPost] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalComment, setModalComment] = useState('')
    const [page, setPage] = useState(0);
    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setModalComment(),
        setOpen(false);
    }

    window.addEventListener('scroll', function () {
        var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

        var totalHeight = document.documentElement.scrollHeight;

        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        if (scrollPosition + viewportHeight >= totalHeight) {
            setPage(page + 1)
        }
    });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await axios.get(
                    "http://localhost:3030/post/homePost/" +page,
                    {
                        headers: {
                            'authentication': localStorage.getItem("token")
                        }
                    }
                );
                console.log(result.data)
                if (result.data.message === 'post send successfully') {
                    console.log(result.data.FeedPosts)
                    setAllPost(prevPosts => [...prevPosts, ...result.data.FeedPosts]);
                }else if(result.data.message === 'no more posts'){
                    // no more posts
                    console.log('sjbsd')
                    allPostSeen()
                }else{
                    // setAllPost([]);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchPosts();
    }, [page]);


 if (!allPost) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h1>
                        Follow more people to see posts!
                    </h1>
                </div>
            </div>

        );
    } else {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
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
                            {modalComment && (
                                <>
                                    <Typography id="modal-modal-title" align="center" variant="h6" component="h2">
                                        Comment Section
                                    </Typography>
                                    <hr />
                                    <div className='comments' style={{
                                        height: '78%'
                                    }}>
                                        <CommentSection postID={modalComment} />
                                    </div>
                                    <div style={{
                                    
                                    }}>
                                    {<CommentBox postId={modalComment}/>}
                                    </div>

                                </>
                            )}
                        </Box>
                    </Modal>
                </div>
                {allPost.map((post) => <Card key={post._id} post={post} setmodal={setModalComment} handleOpen={handleOpen} />)}
                <ToastContainer/>
            </div>
        );
    }
}

function Card({ post, setmodal, handleOpen }) {
    const navigate = useNavigate()
    const { _id, imageURL, postBody, username, likes, postDate, postAuthImg } = post;
    const currUserId = localStorage.getItem('currentUserId')
    const [likeCount, setLikeCount] = useState(likes.length);
    const [active, setActive] = useState(false);

    const LikeHandler = () => {
        const response = async () => {
            try {
                const result = await axios.post(
                    "http://localhost:3030/post/like/" + _id,
                    {},
                    {
                        headers: {
                            'authentication': localStorage.getItem("token")
                        }
                    }
                );

                if (result.data.message === 'Post Likes successfully') {
                    console.log("Post Likes successfully")
                } else if (result.data.message === 'Post disliked successfully') {
                    console.log('Post disliked successfully')
                } else {
                    console.log("something went wrong!!")
                }
            } catch (err) {
                console.log(err)
                console.log("something went wrong!! , Error!!")
            }
        }
        response();
    }
                                                                                    
    const showLikeHandler = () => {
        if (active) {
            setLikeCount((val) => val - 1);
            setActive(false);
        } else {
            setLikeCount((val) => val + 1);
            setActive(true);
        }
    }

    useEffect(() => {
        if (post && likes) {
            if (Array.isArray(likes)) {
                console.log(likes)
                const verifyLike = likes.includes(currUserId);
                setActive(verifyLike);
            }
        } else {
            console.log('something went wrong')
        }


    }, [_id, currUserId])

    return (
        <div style={{
            height: 'auto',
            width: '500px',
            backgroundColor: '#ffffff',
            margin: '20px 0',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
        }}>


            {/* profile, time, authname, and postBody */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: '16px'
            }}>

                <div style={{
                    cursor: 'pointer',
                }} onClick={()=>{
                    navigate('/profile/'+username)
                }}>
                    <img src={postAuthImg} style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        marginRight: '15px',
                        objectFit: 'cover'
                    }} />
                </div>
                <div>
                    <div style={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#333'
                    }}>{username}</div>
                    <div style={{
                        fontSize: '14px',
                        color: '#888'
                    }}>{postDate}</div>
                </div>
            </div>
            <div style={{
                borderBottom: '1px solid #eee',
                marginBottom: '15px',
                paddingBottom: '15px',
                color: '#444',
                fontSize: '15px'
            }}>{postBody}</div>
            {/* picture */}
            <div style={{
                maxHeight: '300px',
                textAlign: 'center',
                marginBottom: '15px',
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                <img src={imageURL} style={{
                    width: '100%',
                    height: 'auto',
                    backgroundColor: '#ffffff',
                    objectFit: 'cover',
                }} />
            </div>

            {/* like and add comment */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Heart
                        style={{ width: '25px', cursor: 'pointer' }}
                        isActive={active}
                        onClick={() => {
                            LikeHandler()
                            showLikeHandler()
                        }}
                    />
                    <span style={{
                        marginLeft: '8px',
                        fontSize: '14px',
                        color: '#555'
                    }}>{likeCount}</span>
                </div>
                <div>
                    <CommentIcon style={{ cursor: 'pointer', width: '25px' }} onClick={() => {
                        console.log(post._id)
                        setmodal(post._id)
                        handleOpen()
                    }} />
                </div>
            </div>
        </div>

    );
}
