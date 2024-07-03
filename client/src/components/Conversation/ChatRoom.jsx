import { ChatBox } from "./ChatBox"
import { ChatSideList } from "./ChatSideList"

export const ChatRoom = () => {
    return <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '90vh',
        marginTop: '4%',
        overflowY:'auto'
    }}>

        <div style={{
            width:'25%',
            minHeight:"100%",
            height:'auto',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <ChatSideList />
        </div>


        <div style={{
            width:'75%'
        }}>
            <ChatBox />

        </div>


    </div>
}