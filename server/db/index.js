import mongoose from 'mongoose';
const { Schema } = mongoose;
const userSchema = new Schema({
    'userId': String,
    "username": String,
    'email': String,
    "profilePicture": String,
    'phoneNumber': Number,
    "privateAccount": Boolean,
    'age': Number,
    'followings': [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    'followers': [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    'blockedAccounts': [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],//for future update:
    'totalPost': Number,
    "userDescription": String
})

const userPassword = new Schema({
    'username':String,
    'password':String
})


const postSchema = new Schema({
    'imageURL': String,
    'postBody': String,
    'username': String,
    "privatePost": Boolean,
    'likes': [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    'postDate': String,
    'postAuthImg': String
})

const commentSchema = new Schema({
    'commentBody': String,
    'postId': String,
    'postDate': String,
    'commentAuth': {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema)
const UserPassword = mongoose.model('UserPassword',userPassword) 

export { User, Post, Comment , UserPassword};