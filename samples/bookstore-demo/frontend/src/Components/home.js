import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import BookCard from "./bookCard";
import '../styles/styles.css'
import Header from "./header";
import {Pagination} from "react-bootstrap";


function Home(){
    let navigate = useNavigate();
    const pageLimit = 8;
    const [loggedIn, setLoggedIn] = useState(false);
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const [books, setBooks] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [numBooksInCart, setNumBooksInCart] = useState(0);

    const setupNumBooks = async () =>{
        try{
            const numBookResult = await (await fetch("/api/cart/numItems")).json();
            setNumBooksInCart(numBookResult)
        } catch(err){
            //ignore
        }

    }

    useEffect( () => {

        const startup = async () =>{
            try{
                const response = await fetch("/api/account/getLoggedInUser");

                if(response.status === 404){
                    navigate('/login')
                } else{
                    const user = await response.json()
                    setUserDetails(user);
                    setLoggedIn(true)
                }

                const bookResult = await (await fetch(`/api/books/all?page=${page-1}&pageSize=12`)).json()
                setupNumBooks()

                setNumPages(bookResult["pages"]);
                setTotalBooks(bookResult["total"]);
                setBooks(bookResult["books"]);


            } catch (err){
                console.log('error fetching data: ', err)
            }
        }

        startup();
    }, [page]);

    const handlePageClick = (page) =>{
        setPage(page+1);
    }

    const getPageNumbers = () =>{
        const halfRange = Math.floor(pageLimit / 2)
        let start = Math.max(1, page-halfRange);
        let end = Math.min(numPages, page+halfRange);

        if(end - start + 1 < pageLimit){
            if(start === 1){
                end = Math.min(numPages, start + pageLimit -1);
            } else if (end === numPages){
                start = Math.max(1, end - pageLimit + 1);
            }
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }


    return(
        <div className="bg-redis-pen-200 vh-100">
            {loggedIn && (<Header userInfo={userDetails} numBooks={numBooksInCart}/>)}
            <div className="gallery flex-wrap">
                {loggedIn && books && books.map(book => (
                    <BookCard refreshCallback={setupNumBooks} key={book.id} bookData={book}></BookCard>
                ))}
            </div>
            <Pagination className="flex justify-center space-x-2 mt-4">
                <Pagination.First className="!rounded" onClick={()=> handlePageClick(1)}/>
                <Pagination.Prev className="!rounded" onClick={()=> handlePageClick(Math.max(1, page-1))}/>
                {getPageNumbers().map((pageNum)=>(
                    <Pagination.Item className="w-14 bg-redis-yellow-500" key={pageNum+1} active={pageNum + 1 === page} onClick = {() => handlePageClick(pageNum-1)}><label className="text-redis-pencil-950 font-bold">{pageNum}</label></Pagination.Item>
                ))}
                <Pagination.Next className="!rounded" onClick={()=> handlePageClick(Math.min(numPages, page+1))}/>
                <Pagination.Last className="!rounded" onClick={()=> handlePageClick(numPages)}/>

            </Pagination>
        </div>


    )
}

export default Home;