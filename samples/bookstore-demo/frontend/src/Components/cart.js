import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import CartBookCard from "./cartBookCard";
import Header from "./header";

function Cart(){
    let navigate = useNavigate();
    const [books, setBooks] = useState(null);
    const [userDetails, setUserDetails] = useState(null)
    const populateCart = async()=>{
        const response = await fetch("/api/cart")
        if(response.status === 401){
            navigate('/login')
        } else{
            const cart = await response.json();
            setBooks(Object.values(cart.books));
        }
    }

    const setupUser = async() =>{
        const response = await fetch("/api/account/getLoggedInUser");

        if(response.status === 404){
            navigate('/login')
        } else{
            const user = await response.json();
            setUserDetails(user);
        }
    }

    useEffect(() =>{
        populateCart()
        setupUser()
    }, []);

    const removeFromCart = async(bookDetails)=>{
        await fetch(`/api/cart/${bookDetails.id}`,{
            method: 'DELETE'
        });

        populateCart();
    }

    return(
        <div className='h-[80%] w-[100%] bg-redis-pencil-200'>
            {userDetails && <Header userInfo={userDetails} numBooks={null}/>}
            <div className="overflow-y-scroll">
                <ul className="flex flex-col border items-center space-y-4 !h-[10%]">
                    {books && books.map(book => (
                        <li className="w-64 inline-flex justify-center m-0" key={book.title}><CartBookCard bookDetails={book}
                                                                                          removeFromCart={removeFromCart}/>
                        </li>))}
                </ul>
                <p className="font-mono font-bold text-redis-pencil-950 text-2xl" style={{textAlign: 'center'}}>Cart
                    total: {books ? books.reduce((accumulator, book) => accumulator + book.price, 0).toFixed(2) : 0}</p>

            </div>

        </div>
    )
}

export default Cart;