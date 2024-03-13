import React from 'react'
import { useNavigate } from 'react-router-dom';

const ChatBody = ({messages, lastMessageRef, typingStatus, socket, user}) => {
    
    const navigate = useNavigate();

    
    const handleLeaveChat = () => {
        socket.emit('leaveChat');
        navigate('/');
    };

    return (
        <>
            <div className="chat__main">
                <header className="chat__mainHeader">
                    <button className="leaveChat__btn" onClick={handleLeaveChat}>
                        Abandonar Chat
                    </button>
                </header>

                {/*This shows messages sent from you*/}
                <div className="message__container">
                    {messages.map((message) =>
                        message.email === user.email ? (
                            <div className="message__chats" key={message._id}>
                                <p className="sender__name">You</p>
                                <div className="message__sender">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="message__chats" key={message._id}>
                                <p>{message.email}</p>
                                <div className="message__recipient">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        )
                    )}

                    {/*This is triggered when a user is typing*/}
                    <div className="message__status">
                        <p>{typingStatus}</p>
                    </div>

                    <div ref={lastMessageRef} />
                </div>
            </div>
        </>


    )
}

export default ChatBody