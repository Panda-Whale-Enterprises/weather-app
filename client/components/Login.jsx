//client/components/Login.jsx
import React, {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';


const Login = (props) => {

    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [whoLogged, setWhoLogged] = useState();

    useEffect(()=>{

    },[isSubmitted, whoLogged, props.user])

    const handleSubmit = (e) => {

        e.preventDefault();

        const username = e.target.firstChild.nextSibling.value; 
        const password = e.target.firstChild.nextSibling.nextSibling.value; 

        console.log('Login.jsx handlesubmit username: ', username)
        console.log('Login.jsx handlesubmit password: ', password)

        axios({
            method: 'POST', 
            url: 'http://localhost:3000/login', 
            data: { username, password }
        })
         .then((res) => {
            console.log('Login.jsx .then res.data: ',res.data);
            console.log('logged in?: ', res.data.loggedIn); // true
            console.log('who logged in? ',res.data.user.username)
            //navigate(`${res.data.path}`, {replace:true})
            setIsSubmitted(res.data.loggedIn)
            setWhoLogged(res.data.user.username);
            props.setUser(res.data.user.username);
            
            res.data.loggedIn ? window.location.href = 'http://localhost:8080/' : (console.log('login failed'))
        });
    }

    const renderForm = (
        <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input className="form-input" type="text" name="username" placeholder="Username"></input>
        <input className="form-input" type="password" name="password" placeholder="Password"></input>
        <input className = "submit-btn" type="submit" value="Login"></input>
        <Link to="/signup">Don't have an account? Click here!</Link>
        </form>
    )

    return(
        <div className="login-div">
            {isSubmitted ? 
            <div className="login-success"><h3>Welcome {whoLogged}! </h3><h4>We're fetching your data</h4></div>
            : renderForm}
        </div>
    )
}

export default Login;