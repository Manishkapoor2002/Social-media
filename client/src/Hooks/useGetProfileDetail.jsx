import {useEffect, useState} from "react";
import axios from "axios";
export const  useGetProfileDetail = (username) => {
    console.log(username);
    const [userDetail,setUserDetail] = useState(null)
    useEffect(()=>{
        const result = async ()=>{
            try{
                const response = await axios.get('http://localhost:3030/profile/search/'+username,{
                    headers: {
                        'authentication': localStorage.getItem("token")
                    }
                })
                if(response.data.message === 'User Data Send Successfully'){
                    setUserDetail(response.data.userDetail);
                }else if(response.data.message === 'Login or signUp again'){
                    setUserDetail('loginAgain')
                }
            }catch(err){
                console.log(err)
            }
        }
        result();
    },[username])

    return userDetail;
}