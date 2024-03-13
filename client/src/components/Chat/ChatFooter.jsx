import React, { useState } from 'react'

const ChatFooter = ({socket, user}) => {
    const [message, setMessage] = useState('');
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && user.name) {
            socket.emit('message', {
                message: message,
                name: user.name,
                email: user.email,
                socketID: socket.id,
                _id: `${socket.id}${Math.random()}`
            });
        }
        setMessage('');
    };

    const handleTyping = () => socket.emit('typing', `${user.name} está escribiendo`);

    return (

        <div className="chat__footer">
            <form className="form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Write message"
                    className="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                />
                <button className="sendBtn">SEND</button>
            </form>
        </div>

    )
}

export default ChatFooter