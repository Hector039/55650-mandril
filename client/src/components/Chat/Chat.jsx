import { useEffect, useRef, useState } from 'react';
import { useContext } from "react";
import { DataContext } from "../context/dataContext";
import { io } from 'socket.io-client';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { Tab, Nav, Row, Col } from "react-bootstrap";

const socket = io('http://localhost:8080', { autoConnect: false });


const Chat = () => {
    socket.connect()
    const { user } = useContext(DataContext)

    const lastMessageRef = useRef(null);

    const [typingStatus, setTypingStatus] = useState('');

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
    }, [socket, messages]);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        socket.on('typingResponse', (data) => setTypingStatus(data));
        socket.emit('newUser', { name: user.name, email: user.email });
    }, [socket]);

    return (
        
        <div className="chat">
            <ChatBar socket={socket} />
            <div className="chat__main">
                <ChatBody messages={messages} lastMessageRef={lastMessageRef} typingStatus={typingStatus} socket={socket} user={user}/>
                <ChatFooter socket={socket} user={user} />
            </div>
        </div>
    );
};

export default Chat;