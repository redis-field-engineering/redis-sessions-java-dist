import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import Dashbord from "./dashbord";
import Header from "./header";
import {useNavigate} from "react-router-dom";

function Admin() {
    const [adminAvailable, setAdminAvailable] = useState(null);
    const [largestSessions, setLargestSessions] = useState(null);
    const [oldestSessions, setOldestSessions] = useState(null);
    const [uniqueSessions, setUniqueSessions] = useState(null);
    const [username, setUsername] = useState('');
    const [userSessionId, setUserSessionId] = useState('');
    const [sessionsInPriceRange, setSessionsInPriceRange] = useState(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [book, setBook] = useState('');
    const [sessionsWithGivenBook, setSessionsWithGivenBook] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [numBooksInCart, setNumBooksInCart] = useState(0);
    let navigate = useNavigate();
    const findSessionsWithinCartTotalRange = async (e) => {
        e.preventDefault();
        const apiResponse = await (await fetch(`/api/admin/getSessionsWithinRange?min=${minPrice}&max=${maxPrice}`)).json();
        setSessionsInPriceRange(apiResponse);
    };

    const setupNumBooks = async () =>{
        try{
            const numBookResult = await (await fetch("/api/cart/numItems")).json();
            setNumBooksInCart(numBookResult)
        } catch(err){
            //ignore
        }
    }

    const findSessionsWithBook = async (e) => {
        e.preventDefault();
        const apiResponse = await (await fetch(`/api/admin/getSessionsWithGivenBook?title=${book}`)).json();
        setSessionsWithGivenBook(apiResponse);
    };

    const populateUserSession = async (e) => {
        e.preventDefault();
        if (!username) {
            setUserSessionId("No username provided");
            return;
        }
        const userSessionResponse = await fetch(`/api/admin/getSessionForUser?username=${username}`);
        if (userSessionResponse.status === 404) {
            setUserSessionId("No session found for user");
            return;
        }
        const text = await userSessionResponse.text();
        setUserSessionId(text);
    };

    useEffect(() => {
        const getAdminDetails = async () => {
            const adminAvailable = await (await fetch("/api/admin/available")).json();
            if (adminAvailable !== true) return;
            setAdminAvailable(true);

            const largestSessionsResponse = await (await fetch("/api/admin/getLargestSessions")).json();
            const oldestSessionsResponse = await (await fetch("/api/admin/getOldestSessions")).json();
            const uniqueSessionsResponse = await (await fetch("/api/admin/getUniqueSessions")).json();

            setLargestSessions(largestSessionsResponse);
            setOldestSessions(oldestSessionsResponse);
            setUniqueSessions(uniqueSessionsResponse);
        };

        const setupUser = async() =>{
            const response = await fetch("/api/account/getLoggedInUser");

            if(response.status === 404){
                navigate('/login')
            } else{
                const user = await response.json();
                setUserDetails(user);
            }
        }

        setupNumBooks();
        setupUser();
        getAdminDetails();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header userInfo={userDetails} numBooks={numBooksInCart}/>
            {adminAvailable ? (
                <div className="space-y-8 p-8">

                    <Dashbord/>
                    {oldestSessions && (
                        <div className="bg-white p-6 rounded shadow">
                            <h2 className="text-xl font-bold mb-4">Oldest Sessions</h2>
                            <ul className="space-y-2">
                                {Object.entries(oldestSessions).map(([key, value]) => (
                                    <li key={key}>Session Id: {key} Created at: {value}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {largestSessions && (
                        <div className="bg-white p-6 rounded shadow">
                            <h2 className="text-xl font-bold mb-4">Largest Sessions</h2>
                            <ul className="space-y-2">
                                {Object.entries(largestSessions).map(([key, value]) => (
                                    <li key={key}>Session Id: {key} Size: {value} bytes</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {uniqueSessions && (
                        <div className="bg-white p-6 rounded shadow">
                            <p>Unique sessions: {uniqueSessions}</p>
                        </div>
                    )}

                    <Form onSubmit={populateUserSession} className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Find Sessions for User</h2>
                        <FormGroup className="mb-4">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                value={username}
                                onChange={event => setUsername(event.target.value)}
                                type="text"
                                className="border rounded px-4 py-2 w-full"
                            />
                        </FormGroup>
                        <Button variant="primary" type="submit" className="w-full">Find</Button>
                        {userSessionId && <p className="mt-4">{userSessionId}</p>}
                    </Form>

                    <Form onSubmit={findSessionsWithinCartTotalRange} className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Find Sessions in Price Range</h2>
                        <FormGroup className="mb-4">
                            <Form.Label>Min Price</Form.Label>
                            <Form.Control
                                value={minPrice}
                                onChange={event => setMinPrice(event.target.value)}
                                type="number"
                                className="border rounded px-4 py-2 w-full"
                            />
                        </FormGroup>
                        <FormGroup className="mb-4">
                            <Form.Label>Max Price</Form.Label>
                            <Form.Control
                                value={maxPrice}
                                onChange={event => setMaxPrice(event.target.value)}
                                type="number"
                                className="border rounded px-4 py-2 w-full"
                            />
                        </FormGroup>
                        <Button variant="primary" type="submit" className="w-full">Find</Button>
                        {sessionsInPriceRange && (
                            <ul className="mt-4 space-y-2">
                                {sessionsInPriceRange.map(s => (
                                    <li key={s}>{s}</li>
                                ))}
                            </ul>
                        )}
                    </Form>

                    <Form onSubmit={findSessionsWithBook} className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Find Sessions with Given Book</h2>
                        <FormGroup className="mb-4">
                            <Form.Label>Book Title</Form.Label>
                            <Form.Control
                                value={book}
                                onChange={event => setBook(event.target.value)}
                                type="text"
                                className="border rounded px-4 py-2 w-full"
                            />
                        </FormGroup>
                        <Button variant="primary" type="submit" className="w-full">Find</Button>
                        {sessionsWithGivenBook && (
                            <ul className="mt-4 space-y-2">
                                {sessionsWithGivenBook.map(s => (
                                    <li key={s}>{s}</li>
                                ))}
                            </ul>
                        )}
                    </Form>
                </div>
            ) : (
                <h2 className="text-center text-xl font-semibold text-gray-600">Admin not available without Redis Enterprise Session Store</h2>
            )}
        </div>
    );
}

export default Admin;
