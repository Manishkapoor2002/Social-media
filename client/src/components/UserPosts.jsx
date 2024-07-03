import {useState, useEffect} from 'react'
import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Heart from "react-heart"
import {Box, Modal, Typography} from "@mui/material";
import {CommentSection} from "./CommentSection.jsx";
import {CommentBox} from "./CommentBox.jsx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1200px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
    height: "800px"
};

export const UserPosts = (props) => {
    // eslint-disable-next-line react/prop-types
    const username = props.username;
    const [modalPost, setModalPost] = useState({});
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [allPost, setAllPost] = useState([]);
    const [likeCount,setLikeCount] = useState(0);
    const [active, setActive] = useState(false)
    const currUser = localStorage.getItem('currentUsername');
    const currUserId = localStorage.getItem('currentUserId')
    window.addEventListener('scroll', function () {
        var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

        var totalHeight = document.documentElement.scrollHeight;

        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        if (scrollPosition + viewportHeight >= totalHeight) {
            setPage(page + 1)
        }
    });


//     like and dislike handler:
    const LikeHandler = () => {
        const response = async () => {
            console.log(modalPost._id)
            try {
                const result = await axios.post(
                    "http://localhost:3030/post/like/" + modalPost._id,
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
    // like count handler:
    const showLikeHandler = () =>{
        if(active){
            setLikeCount((val)=>val-1);
            setActive(false);
        }else{
            setLikeCount((val)=>val+1);
            setActive(true);
        }
    }

    // checking user already liked the post or not:
    useEffect(() => {
        if (modalPost && modalPost.likes) {
            if (Array.isArray(modalPost.likes)) {
                setLikeCount(modalPost.likes.length);
                const verifyLike = modalPost.likes.includes(currUserId);
                setActive(verifyLike);
            } else {
                console.error('modalPost.likes is not an array:', modalPost.likes);
            }
        } else {
            console.log('modalPost is not defined or does not have a likes array');
        }
    }, [modalPost._id, currUser]);

    // getting post :
    useEffect(() => {
        const response = async () => {

            const result = await axios.get("http://localhost:3030/post/getpost/" + page, {
                headers: {
                    'authentication': localStorage.getItem("token")
                },
                params: {
                    username
                }
            });
            console.log(result.data.post)
            if (result.data.message === 'post send successfully') {
                setAllPost(prevPosts => [...prevPosts, ...result.data.post]);
            }else if (result.data.message === 'no more posts'){
                // notifyNomorePosts();
                console.log("No more posts found.");
            }
        }
        response();
    }, [page, username])


  if(allPost.length === 0){
      return <>
          <Typography variant="h3" align="center" >
              No Post Yet!!
          </Typography>
      </>
  }else {
      console.log(allPost)
      return (
          <>
              <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  flexDirection: 'column',
                  alignItems: 'center'
              }}>
                    <span style={{
                        height: '1px',
                        backgroundColor: 'black',
                        width: '100%'
                    }}></span>
                  <h1>All Posts</h1>

                  <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                  }}>
                      {allPost.map((post) => {
                          return <Cards key={post._id} post={post} handleOpen={handleOpen} setModalPost={setModalPost} />
                      })}
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
                      <div style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          height: "100%"
                      }}>
                          <div style={{
                              display: 'flex',
                              justifyContent: 'center',
                              height: '100%',
                              width: '60%',
                              overflow: 'hidden',
                              borderRight: '2px solid black'
                          }}>
                              <img key={new Date().getMilliseconds} src={modalPost.imageURL} alt=""
                                   style={{ height: '100%' }} />
                          </div>

                          <div style={{
                              width: '40%',
                          }}>

                              <div style={{
                                  height: '7%',
                                  padding: '10px',
                                  backgroundColor: '#f9f9f9',
                                  borderRadius: '10px',
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                  margin: '10px 0'
                              }}>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <img
                                          src={modalPost.postAuthImg}
                                          alt="Author"
                                          style={{
                                              width: '50px',
                                              height: '50px',
                                              borderRadius: '50%',
                                              marginRight: '10px',
                                              objectFit: 'cover'
                                          }}
                                      />
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <h3 style={{
                                              margin: '0',
                                              fontSize: '1.1em',
                                              fontWeight: 'bold',
                                              color: '#333'
                                          }}>{modalPost.username}</h3>
                                          <span style={{
                                              fontSize: '0.9em',
                                              color: '#777'
                                          }}>at {modalPost.postDate}</span>
                                      </div>
                                  </div>
                              </div>
                              <div style={{
                                  width: '100%',
                                  height: '2px',
                                  backgroundColor: 'black',
                                  margin: '3px 0'
                              }}></div>

                              <div className='comments' style={{
                                  height: '70%'
                              }}>
                                  <CommentSection postID={modalPost._id} />
                              </div>
                              <div style={{
                                  width: '100%',
                                  height: '2px',
                                  backgroundColor: 'black',
                                  margin: '3px 0'
                              }}></div>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Heart
                                      style={{ width: '25px', cursor: 'pointer' }}
                                      isActive={active}
                                      onClick={() => {
                                          LikeHandler();
                                          showLikeHandler();
                                      }}
                                  />
                                  <span style={{ marginLeft: '10px' }}>
                                        {likeCount}
                                    </span>
                              </div>


                              <div>
                                  <CommentBox postId={modalPost._id} />
                              </div>

                          </div>
                      </div>
                  </Box>
              </Modal>
              <ToastContainer/>
          </>
      )
  }
}

function Cards(props) {
    const setModalPost = props.setModalPost
    const handleOpen = props.handleOpen
    const onPostClick = (e) => {
        setModalPost(props.post);
        handleOpen();
    }
    return <div>

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            margin: '10px',
            width: '250px',
            height: '250px',
            overflow: 'hidden',
            cursor: 'pointer'
        }} onClick={onPostClick}>
            <img src={props.post.imageURL} alt="" style={{
                width: '100%'
            }} />
        </div>


    </div>

}