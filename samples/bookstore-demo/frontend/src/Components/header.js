import React from 'react'
import '../styles/tailwind.css'


function Header({userInfo, numBooks}){

    return(
        <div >
            {userInfo ? (
                <header className="flex bg-redis-pencil-300 text-redis-indigo-600 font-mono  items-center justify-between">
                    <h1 className="mx-auto font-bold text-4xl">Welcome to the Redis Book Store {userInfo.firstName}</h1>
                    <nav>
                        <ul className="space-x-4 pr-4">
                            <li className="bg-redis-yellow-500 rounded ml-4 mt-2"><a className="ml-1 text-redis-pencil-950" href="/">home</a></li>
                            {numBooks !== null && <li className="mt-2 rounded bg-redis-indigo-500 mr-2"><a className="ml-1 text-redis-pencil-950" href="/cart">cart({numBooks})</a></li>}
                            <li className="bg-redis-red-500 rounded mt-2 mr-2 "><a className="text-redis-pencil-950 ml-1" href="/logout">logout</a></li>
                            <li className="bg-redis-skyblue-500 rounded mt-2 mr-2 mb-2"><a className="text-redis-pencil-950 ml-1" href="/admin">admin</a></li>
                        </ul>
                    </nav>
                </header>
            ) : (
                <header className="flex justify-between bg-redis-pencil-300">
                    <h1 className="mx-auto text-redis-indigo-600 font-mono font-bold">Welcome to the Book Store</h1>
                    <nav>
                        <ul>
                            <li className="bg-redis-red-600 p-1 mt-2 mr-2 rounded"><a className="text-redis-pencil-950" href="/login">login</a></li>
                            <li className="bg-redis-indigo-500 p-1 mt-2 mr-2 rounded"><a className="text-redis-pencil-950" href="/signup">signup</a></li>
                        </ul>
                    </nav>
                </header>
            )
            }
        </div>
    )
}

export default Header