import {useNavigate} from 'react-router-dom';

export default function Logout () {

    const navigate = useNavigate();

    function backToHome() {
        navigate("/");
    }
    
    setTimeout(backToHome, 5000);
    
    return (
        <div className="logout-page">
            <p>Te esperamos pronto!</p>
            <a href="/account"><button>Volver a loguearse</button></a>
        </div>
    )
}
