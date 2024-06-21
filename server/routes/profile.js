import express from 'express';
import { User } from '../db/index.js';
import { authenticationJWT } from '../middlewares/auth.js';

const profileRoute = express.Router();

// search user Profile
profileRoute.get('/search/:username', authenticationJWT, async (req, res) => {
    const currentUserName = req.user.username;
    try {
        const user = await User.findOne({ 'username': req.params.username });
        if (!user) {
            res.json({ "message": "User not found" })
        } else {
            let result = user.followers.includes(currentUserName);
            let postLen = user.totalPost.length || 0;


            res.json({
                'userDetail': {
                    "username": user.username,
                    "email": user.email,
                    "profilePicture": user.profilePicture,
                    postLen,
                    "followings": user.followings,
                    "followers": user.followers,
                    'isFollowing': result,
                    'userDescription': user.userDescription
                },
                "message": "User Data Send Successfully",
            });
        }

    } catch (err) {
        res.json({ 'message': 'something went wrong', "error": err })
    }

})

// update profile route (update user details : profile pic and Description)
profileRoute.post('/updateProfile', authenticationJWT, async (req, res) => {
    const { newProfilePic, newUserDescription } = req.body;  

    try {
        const user = await User.findOne({ 'username': req.user.username });

        if (!user) {
            return res.json({ 'message': "Something went wrong" });
        }

        user.profilePicture = newProfilePic || user.profilePicture;
        user.userDescription = newUserDescription || user.userDescription
        await user.save();
        res.json({ 'message': 'Profile successfully updated' })
    } catch (err) {
        res.json({ 'message': 'something went wrong', "error": err });
    }

})

// own prfoile detail
profileRoute.get('/myprofile',authenticationJWT,async(req,res)=>{
    try {
        const user = await User.findOne({ 'username': req.user.username });
        if (user) {
            res.json({
                'userDetails': {
                    "username": user.username,
                    "email": user.email,
                    "profilePicture": user.profilePicture,
                    'totalPost': user.totalPost,
                    "followings": user.followings,
                    "followers": user.followers,
                    "userDescription":user.userDescription
                },
                'message': 'User Data Send Successfully'
            });
        } else {
            res.json({ 'message': 'User not found' });
        }
    } catch (err) {
        res.json({ 'message': 'Something went wrong!' });
    }
})


export default profileRoute;