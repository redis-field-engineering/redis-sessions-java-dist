import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Container, Form} from "react-bootstrap";
import '../styles/styles.css';
import Header from "./header";

function Login(){
    let navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const handleSubmit = async (event)  => {
        event.preventDefault();
        const response = await fetch('/api/account/login', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                username:username,
                password:password
            })
        })

        if(response.status === 200){
            navigate('/');
        }
        else if(response.status === 401){
            setError("Username or password is incorrect");
        } else{
            setError("Encountered error while logging in");
        }
    }

    return(
        <div className="bg-redis-pencil-200 vh-100">
            <Header/>
            <Container className="mt-5 border-4 border-redis-red-500 bg bg-redis-pencil-300 rounded-3xl">
                <h2 className="flex justify-center text-redis-indigo-600 font-mono font-extrabold text-4xl">Login</h2>
                <Form onSubmit={handleSubmit}>
                    <div className="flex-form-group">
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label className="text-redis-indigo-600 font-mono font-bold">Username:</Form.Label>
                            <Form.Control
                                className="rounded !placeholder-redis-pencil-500 !bg-redis-pencil-200 font-sans text-redis-pencil-950"
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>

                    <div className="flex-form-group">
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="text-redis-indigo-600 font-mono font-bold">Password:  </Form.Label>
                            <Form.Control
                                className="rounded !placeholder-redis-pencil-500 !bg-redis-pencil-200 font-sans text-redis-pencil-950"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>

                    <Button className="!bg-blue-06 !text-redis-pencil-100 !font-mono" variant="primary" type={"submit"}>
                        Submit
                    </Button>
                    <p className="mt-2 font-mono font-bold text-xs">
                        Don't have an account? <Link to="/signup" className="!text-redis-indigo-600">Sign up here</Link>
                    </p>
                    {error && <div className="alert alert-danger" role="alert">
                        {error}
                    </div>}

                </Form>
            </Container>
        </div>
    )
}
export default Login;