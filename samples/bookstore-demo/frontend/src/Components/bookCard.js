import '../styles/styles.css'
import Button from "react-bootstrap/Button";
import {useState} from "react";
import AddToCartModal from "./addToCartModal";

function BookCard({bookData, refreshCallback}){
    const [showModel, setShowModel] = useState(false);

    function title(){
        return bookData.title.length < 20 ? bookData.title : bookData.title.substring(0, 20) + "..."
    }

    function authors(){
        if (bookData.authors){
            const str = bookData.authors.join(',')
            return str.length < 20 ? str : str.substring(0,20) + "..."
        }
        return '';
    }

    return (
        <div className="bookCard-item bg-redis-pencil-200 rounded m-2 font-mono font-bold text-redis-indigo-600">
            {title()}
            <img style={{height: 160}} src={bookData.thumbnail} alt={bookData.title}/>
            <p>Author: {authors()}</p>
            <p>Price: ${(bookData.price && bookData.price.toFixed(2)) || "no price"}</p>
            <Button className="mb-2" onMouseUp={()=>setShowModel(true)} variant="primary">Add To Cart</Button>
            <AddToCartModal callback={refreshCallback} isOpen={showModel} close={()=>setShowModel(false)} bookDetails={bookData}/>
        </div>
    )

}

export default BookCard;