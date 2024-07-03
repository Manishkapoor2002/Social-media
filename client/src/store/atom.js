import { atom } from "recoil";
export const isLogin = atom({
    key: "isLogin",
    default: false
})
export const signupUsername = atom({
    key: 'signupUsername',
    default: '',
});

export const signupEmail = atom({
    key: 'signupEmail',
    default: ''
})

export const signUpPassword = atom({
    key: 'signUpPassword',
    default: ''
})

export const newComment = atom({
    key : 'newComment',
    default:false
})

export const chatWithUser = atom({
    key:'chatWithUser',
    default:null,
})

export const currUserId = atom({
    key:'currUserId',
    default:null
})