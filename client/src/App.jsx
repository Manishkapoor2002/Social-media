import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RecoilRoot } from 'recoil';
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignupComponents/Signup";
import {MyProfile} from "./components/MyProfile.jsx";
import {Profile} from "./components/Profile.jsx"
import {EditProfile} from "./components/EditProfile.jsx";
import Home from "./components/Home.jsx";
import {ChatRoom} from "./components/Conversation/ChatRoom.jsx";
function App() {
  return (
    <>
    <BrowserRouter>
      <RecoilRoot>
        <Navbar />
        <Routes>
          <Route path='/login' element={<Login />} />
           <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/profile/:username' element={<Profile />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path="/chats" element={<ChatRoom/>}/>
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
    </>
  )
}

export default App
