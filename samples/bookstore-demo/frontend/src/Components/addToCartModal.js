import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";


function AddToCartModal({isOpen, close, bookDetails, callback}){
    let navigate = useNavigate();
    if (!isOpen) return null;

    const addToCart = async () =>{
        const response = await fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify(bookDetails),
            headers:{
                'Content-Type':'application/json'
            }
        })

        if(response.status === 401){
            navigate('/login')
        } else{
            close();
        }

        await callback();
    }


    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                padding: 20,
                background: '#fff',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
                <h2>{bookDetails.title}</h2>
                <img src={bookDetails.thumbnail} alt={bookDetails.title}/>
                <p>Authors: {bookDetails.authors}</p>
                <p>Price: ${bookDetails.price}</p>
                <Button onClick={addToCart} variant='primary' style={{marginBottom:'3px'}}>Add to cart</Button>
                <Button variant='secondary' onClick={close}>close</Button>
            </div>
        </div>
    );
}

export default AddToCartModal;