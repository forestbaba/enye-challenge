import React, { useState, useEffect } from 'react'
import Loader from 'react-loader-spinner';
import './styles.scss';
import { Link, useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { login } from '../redux/User/action';

const Login = () => {

    const [showSpinner, setShowSpinner] = useState('')
    const [loginDetails, setLoginDetails] = useState('');
    const data = useSelector((state) => state);

    const history = useHistory();

    const { userData: { loggedInUser, isAuthenticated } } = data

    const realdispatch = useDispatch()

    useEffect(() => {
        if (isAuthenticated) {
          history.push('/home')
      }
    }, [isAuthenticated === false])

    const ValidateEmail = (mail) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(loginDetails.email)) {
            return (true)
        }

        return (false)
    }
    const handleLogin = () => {
        if (!ValidateEmail(loginDetails.email)) {
            alert("You have entered an invalid email address!")
        }
        else if (loginDetails.email === undefined ||  loginDetails.email.length === '' || loginDetails.email.length === null) {
            alert('Email Field is required')
        } else if (loginDetails.password === undefined ||  loginDetails.password.length === '' || loginDetails.password.length === null)  {
            alert('Password Field is required')
        } else {
            console.log('>>>>', loginDetails)
            setShowSpinner(true)
            realdispatch(login(loginDetails))

        }
        
    }
  
    const handleChange = (e) => {
        const value = e.target.value;
        setLoginDetails({
            ...loginDetails,
            [e.target.name]: value
        });
    };
    return (
            <div className='popup_inner_signup'>
                <div className='note-container'>
                    <h3>Login </h3>
                    <p>Welcome to medic finder app, please create an account</p>
                </div>

                <input placeholder='Email address' className='text_input' type='email' name='email' onChange={handleChange} required />
                <input placeholder='Password' className='text_input' name='password' type='password' onChange={handleChange} required />

                <button className='login_button' onClick={handleLogin}>{showSpinner !== true ? <h6 className='button-text'> Login</h6> : <Loader type="Oval" color="white" height={40} width={40} />}</button>

                <div className='login-footer'>
                    <h5 className='new'>Don't have an account ?</h5>
                <h5 className='sign-up-text'><Link to='/register'>Register</Link></h5>
                </div>
            </div>
    )
}
export default Login;