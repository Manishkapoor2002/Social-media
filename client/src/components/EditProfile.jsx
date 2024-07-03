import { useState,useEffect } from "react";
import { Typography, Button, CircularProgress, TextareaAutosize, Avatar, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";


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

const Container = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
});

const ContentWrapper = styled(Paper)(({ theme }) => ({
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    borderRadius: '16px',
    boxShadow: theme.shadows[5],
    backgroundColor: '#fff',
}));

const ProfileSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
});

const BioSection = styled(Box)({
    marginBottom: '24px',
});

const UpdateButton = styled(Button)(({ theme }) => ({
    marginTop: '20px',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const TextareaStyled = styled(TextareaAutosize)({
    width: '100%',
    maxHeight:'200px',
    height: '100px',
    padding: '12px',
    fontSize: '16px',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: '8px',
    resize: 'none',
    outline: 'none',
    '&:focus': {
        borderColor: '#3f51b5',
        boxShadow: '0 0 5px rgba(63, 81, 181, 0.5)',
    },
});


export const EditProfile = () => {
    const [newUserDescription, setNewUserDescription] = useState("");
    const [newProfilePic, setNewProfilePic] = useState(null);
    const username = localStorage.getItem('currentUsername')
    const [showImg, setShowImg] = useState("http://res.cloudinary.com/dzfvpd08i/image/upload/v1717259736/minMax-post-2024-6-1%2022:5:34.png");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchProfilePic = async () => {
            const result = await axios.get(`http://localhost:3030/user/getProfilePic/${username}`);
            if (result.data.message === 'user found') {
                setShowImg(result.data.profilePicture);
            }
        };
        fetchProfilePic();
    }, [username]);


    const updateHandler = async () => {
        let URL = "";


        if(!newProfilePic){
            URL = null;
        }else{
            setLoading(true);
            const formData = new FormData();
            formData.append("image", newProfilePic);

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

        }

        try {
            const result = await axios.post('http://localhost:3030/profile/updateProfile', {
                'newProfilePic': URL,
                'newUserDescription': newUserDescription
            }, {
                headers: {
                    'authentication': localStorage.getItem("token")
                }
            });

            if (result.data.message === 'Profile successfully updated') {
                setLoading(false);
                alert('Profile successfully updated');
            } else {
                setLoading(false);
                alert('Something went wrong!');
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    return (
        <Container>
            <ContentWrapper>
                <Typography component="h1" variant="h4" fontWeight={300} align="left" gutterBottom>
                    Edit Profile
                </Typography>

                <ProfileSection>
                    <Avatar src={showImg} alt="Profile Picture" sx={{ width: 60, height: 60, marginRight: 2 }} />
                    <Box>
                        <Typography variant="body1" fontWeight={500}>
                            {localStorage.getItem('currentUsername')}
                        </Typography>
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            sx={{ marginTop: 1 }}
                        >
                            Change Picture
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setShowImg(URL.createObjectURL(e.target.files[0]));
                                    setNewProfilePic(e.target.files[0]);
                                }}
                            />
                        </Button>
                    </Box>
                </ProfileSection>

                <BioSection>
                    <Typography component="h2" variant="h5" fontWeight={300} align="left" gutterBottom>
                        Bio
                    </Typography>
                    <TextareaStyled
                        aria-label="scrollable textarea"
                        placeholder="Type your bio here..."
                        onChange={(e) => setNewUserDescription(e.target.value)}
                    />
                </BioSection>

                <UpdateButton
                    variant="contained"
                    onClick={updateHandler}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                </UpdateButton>
            </ContentWrapper>
        </Container>
    );


}