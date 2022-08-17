//client/components/Navbar.jsx
import React , {useState, useEffect} from 'react'; 
import { Link } from 'react-router-dom';

const Navbar = props => {

  useEffect(()=>{
    console.log('Navbar.jsx isLoggedIn: ', props.user)
  }, [props.user])

  const handleLogout = () => {
    props.setUser(null);
  }

  return (
    <div className="navbar">
      <Link to='/' className="submit-btn">Home</Link>
      <h1>{props.user ? `${props.user}'s ` : ''}Historical Climate Data</h1>
      {/* <Link to='/signup' className="submit-btn">Signup</Link> */}
      {props.user ? <Link to='/' className="submit-btn" onClick={handleLogout}>Logout</Link> : <Link to='/login' className="submit-btn">Signup/Login</Link>} 
    </div>
  )

}

export default Navbar;