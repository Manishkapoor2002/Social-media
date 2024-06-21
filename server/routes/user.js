import express from 'express';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User, UserPassword } from '../db/index.js';
import { authenticationJWT } from '../middlewares/auth.js';

dotenv.config();
const Secretkey = process.env.SECRET_KEY
const Salt_Value = (parseInt)(process.env.SALT_VALUE)
const userRouter = express.Router()
 

// signup route(new user signup)
userRouter.post('/signup', async (req, res) => {
    const { username, password, email, profilePicture, userDescription } = req.body;

    if (!username || !password || !email) {
        return res.json({ "message": 'required fields are empty' });
    }

    const salt = bcrypt.genSaltSync(Salt_Value);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const token = jwt.sign({ 'username': username, 'email': email }, Secretkey, { expiresIn: '7days' })

        const newUser = new User({
            'username': username,
            'email': email,
            'profilePicture': profilePicture || "http://res.cloudinary.com/dzfvpd08i/image/upload/v1717259736/minMax-post-2024-6-1%2022:5:34.png",
            "totalPost": 0, 'userDescription': userDescription || ''
        })
        const newUserPassword = new UserPassword({
            'username': username,
            'password': hashedPassword,
        })

        await newUser.save();
        await newUserPassword.save();

        const userDetail = {
            'username': newUser.username,
            'email': newUser.email,
            'profilePicture': newUser.profilePicture,
            "totalPost": newUser.totalPost,
            'userDescription': newUser.userDescription
        }

        res.json({ 'message': 'User has been created', "token": token, "userID": newUser._id, userDetail });

    } catch (err) {
        res.json({ 'message': 'something went wrong', "error": err })
    }
})

// login route(user login)
userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ "message": 'required fields are empty' });
    }

    try {
        const user = await User.findOne({ username })
        const pass = await UserPassword.findOne({ username });

        if (!user) {
            res.json({ "message": "user not found" });
        } else {
            const check = bcrypt.compare(password, pass.password);
            if (check) {
                const userEmail = user.email;
                const token = jwt.sign({ 'username': username, 'email': userEmail }, Secretkey, { expiresIn: '7days' })

                const userDetail = {
                    'username': user.username,
                    'email': user.email,
                    'profilePicture': user.profilePicture,
                    "totalPost": user.totalPost,
                    'userDescription': user.userDescription
                }

                res.json({
                    'message': 'User has been successfully logged in',
                    'token': token,
                    userDetail
                })

            } else {
                res.json({ 'message': 'User authorization failed', "error": "username or password doesn't match" });
            }
        }
    } catch (err) {
        res.json({ 'message': 'something went wrong', "error": 'err' });
    }
})

// follow route (follow other person)
userRouter.post('/follow/:username', authenticationJWT, async (req, res) => {
    try {

        if (req.params.username === req.user.username) {
            return res.json({ 'message': 'something went wrong', 'error': 'you cannot unfollow yourself' });
        }
        const [other, curr] = await Promise.all([
            User.findOne({ 'username': req.params.username }),
            User.findOne({ 'username': req.user.username })
        ]);

        if (!other || !curr) {
            return res.json({ 'message': 'user not found' });
        }
        const isFollowing = other.followers.includes(curr._id);

        if (isFollowing) {
            return res.json({ 'message': 'you are already following the user' })
        }

        other.followers.push(curr)

        curr.followings.push(other)

        await Promise.all([other.save(), curr.save()]);

        res.json({ "message": "followed successfully" })
    } catch (err) {
        console.log(err);
        res.json({ 'messgae': 'something went wrong', 'error': err });
    }


})
// unFollow route (unfollow other person)
userRouter.post('/unfollow/:username', authenticationJWT, async (req, res) => {


    try {
        if (req.params.username === req.user.username) {
            return res.json({ 'message': 'something went wrong', 'error': 'you cannot unfollow yourself' });
        }

        const [other, curr] = await Promise.all([
            User.findOne({ 'username': req.params.username }),
            User.findOne({ 'username': req.user.username })
        ]);

        if (!other || !curr) {
            return res.json({ 'message': 'user not found' });
        }

        const isFollowing = other.followers.includes(curr._id);

        if (!isFollowing) {
            return res.json({ 'message': 'you are already not following the user' })
        }

        other.followers.pull(curr._id);
        curr.followings.pull(other._id);

        await Promise.all([other.save(), curr.save()]);

        res.json({ "message": "unfollow successfully" })
    } catch (err) {
        console.log(err);
        res.json({ 'messgae': 'something went wrong', 'error': err });
    }
})

export default userRouter