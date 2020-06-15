import React, { useState } from 'react'
import './styles.scss'
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom'
import { dataBase, authentication } from '../util/FirebaseInit';
import { useHistory } from 'react-router';


const Register = () => {

    const history = useHistory();
    const [showSpinner, setShowSpinner] = useState('')
    const [loginDetails, setLoginDetails] = useState('')

    const ValidateEmail = (mail) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(loginDetails.email)) {
            return (true)
        }

        return (false)
    }
    const handleSignUp = () => {

        if (!ValidateEmail(loginDetails.email)) {
            alert("You have entered an invalid email address!")
        }

        else if (loginDetails.email === undefined || loginDetails.email.length === '' || loginDetails.email.length === null) {
            alert('Email Field is required')
        } else if (loginDetails.password === undefined || loginDetails.password.length === '' || loginDetails.password.length === null) {
            alert('Password Field is required')
        } else if (loginDetails.password !== loginDetails.confirmpassword) {
            alert('Password and confirm password field do not match')
        } else {
            setShowSpinner(true)
            authentication.createUserWithEmailAndPassword(loginDetails.email, loginDetails.password)
                .then(user => {

                    // user.user.uid
                        dataBase.collection("users").doc(user.user.uid).set({
                        email: loginDetails.email,
                        uid: user.user.uid
                        }).then(newU => {
                            history.push('/');

                        console.log('Done')
                    }).catch(err => {
                        alert('Error creating user, Please try again later')
                        //console.log('ERRX: ', err)
                    })
                })
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
                <h3>Sign up</h3>
                <p>Welcome to medic finder app, please create an account</p>
            </div>

            <input placeholder='Email address' className='text_input' type='email' name='email' onChange={handleChange} required />
            <input placeholder='Password' className='text_input' name='password' type='password' onChange={handleChange} required />
            <input placeholder='Confirm Password' className='text_input' name='confirmpassword' type='password' onChange={handleChange} required />

            <button className='login_button' onClick={handleSignUp}>{showSpinner !== true ? <h6 className='button-text'> Sign up</h6> : <Loader type="Oval" color="white" height={40} width={40} />}</button>

            <div className='login-footer'>
                <h5 className='new'>Already have an account ?</h5>
                <h5 className='sign-up-text'><Link to='/'>Login</Link></h5>
            </div>
        </div>

    )
}
export default Register;