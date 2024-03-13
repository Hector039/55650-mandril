export default function Contador ({stock, quantity, setQuantity}) {
    
    function handleRest() {
        quantity > 1 && setQuantity(quantity - 1);
    }

    function handleSum() {
        /* quantity < stock &&  */setQuantity(quantity + 1);
    }
    
    return (
        <div className="seleccion-cantidad">
                    <button onClick={handleRest} className="botton-cantidad">-</button>                
                    <p className="info-cantidad">{stock === 0 ? "S/S" : quantity}</p>
                    <button onClick={handleSum} className="botton-cantidad">+</button>
                </div>
    )
}