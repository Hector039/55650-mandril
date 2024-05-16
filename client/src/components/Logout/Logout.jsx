import {useNavigate} from 'react-router-dom';

export default function Logout () {
    const navigate = useNavigate();
    function backToHome() {
        navigate("/");
    }
    setTimeout(backToHome, 5000);
    
    return (
        <div className="logout-page">
            <h2>Te esperamos pronto!</h2>
            <a href="/account"><button>Volver a loguearse</button></a>
        </div>
    )
}
