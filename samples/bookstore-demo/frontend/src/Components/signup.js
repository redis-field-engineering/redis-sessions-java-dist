import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import '../styles/styles.css'
import Header from "./header";

function Signup(){
    let navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async(event) =>{
        console.log("hello world")
        event.preventDefault();
        const response = await fetch("/api/account/createUser", {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password,
                email: email
            })
        })

        if(response.status === 200){
            navigate("/login");
        } else{
            setError("error while creating account: " + await response.text())
            console.log(error)
        }
    }

    return(
        <div className="bg-redis-pencil-200 vh-100">
            <Header/>
            <Container className="mt-5 rounded-2xl bg-redis-pencil-300 text-redis-indigo-600 font-bold">
                <h2>Create Login</h2>
                <Form className="pb-4" onSubmit={handleSubmit}>
                    <div className="flex-form-group">
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Username:</Form.Label>
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
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                className="rounded-input rounded !placeholder-redis-pencil-500 !bg-redis-pencil-200 font-sans text-redis-pencil-950"
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>

                    <div className="flex-form-group">
                        <Form.Group controlId="formBasicFirstName">
                            <Form.Label>First Name:</Form.Label>
                            <Form.Control
                                className="rounded-input rounded !placeholder-redis-pencil-500 !bg-redis-pencil-200 font-sans text-redis-pencil-950"
                                type="text"
                                placeholder="Enter First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>


                    <div className="flex-form-group">
                        <Form.Group controlId="formBasicLastName">
                            <Form.Label>Last Name:</Form.Label>
                            <Form.Control
                                className="rounded-input rounded !placeholder-redis-pencil-500 !bg-redis-pencil-200 font-sans text-redis-pencil-950"
                                type="text"
                                placeholder="Enter Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>

                    <div className="flex-form-group">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                className="rounded-input rounded !placeholder-redis-pencil-500 !bg-redis-pencil-200 font-sans text-redis-pencil-950"
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>
                    <Button className="!bg-blue-06 !text-redis-pencil-100 !font-mono" variant="primary" type="submit">Submit</Button>
                </Form>

                {error && <div className="alert alert-danger" role="alert">
                    {error}
                </div>}
            </Container>
        </div>
    )
}

export default Signup;