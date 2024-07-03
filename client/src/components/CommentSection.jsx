import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {newComment} from "../store/atom.js";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export const CommentSection = ({postID}) => {
    const [allComments, setAllComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const newCommentHappen = useRecoilValue(newComment)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const result = await axios.get(`http://localhost:3030/comment/getAllComment/${postID}`, {
                    headers: {
                        'authentication': localStorage.getItem("token")
                    }
                });
                if (result.data.message === 'Comments Send Successfully') {
                    setAllComments(result.data.allComments);
                } else {
                    setAllComments([]);
                }
            } catch (err) {
                setError('Failed to load comments.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [postID, newCommentHappen]);

    if (loading) {
        return <div>Loading comments...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!allComments.length) {
        return <div style={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
        }}>
            <div>
                <h3>No comments on this post!</h3></div> </div>
    }else {
        return (
            <div style={{
                height:'100%',
                overflowY:'auto',
                padding:'10px',
            }}>
                {allComments.map(comment => (
                    <CommentCard key={comment._id} comment={comment} />
                ))}
            </div>
        );
    }
}

function CommentCard(props){
    const navigate = useNavigate();
    const { commentAuth, commentBody ,postDate} = props.comment;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            width: 'auto',
            padding: '16px',
            border: '2px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f9f9f9',
            marginBottom: '16px'
        }}>
            <img
                src={commentAuth.profilePicture}
                alt={`${commentAuth.username}'s avatar`}
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '16px'
                }}
            />
            <div style={{ flex: 1 }}>
                <div style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginBottom: '8px',
                    color: '#333',
                    cursor:'pointer'
                }}onClick={()=>navigate('/profile/'+commentAuth.username)}>
                    {commentAuth.username}
                </div>
                <div style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#555'
                }}>
                    {commentBody}
                </div>
            </div>
        </div>
    );

}