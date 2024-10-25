import Button from "react-bootstrap/Button";

function CartBookCard({bookDetails, removeFromCart}){

    function title(){
        return bookDetails.title.length < 20 ? bookDetails.title : bookDetails.title.substring(0, 20) + "..."
    }

    function authors(){
        if (bookDetails.authors){
            const str = bookDetails.authors.join(',')
            return str.length < 20 ? str : str.substring(0,20) + "..."
        }
        return '';
    }

    return (
        <div className="cartBookCard-item border bg-redis-pencil-200 rounded font-mono">
            {title()}
            <img style={{height: 160}} src={bookDetails.thumbnail} alt={bookDetails.title}/>
            <p>Author: {authors()}</p>
            <p>Price: ${bookDetails.price.toFixed(2)}</p>
            <Button className="mb-2 !bg-blue-06 !text-redis-pencil-100 !font-mono" onClick={()=>removeFromCart(bookDetails)} variant="primary">Remove From Cart</Button>
        </div>
    )
}

export default CartBookCard;