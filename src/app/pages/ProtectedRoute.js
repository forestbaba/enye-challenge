import React, {useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom'
import { authentication } from '../util/FirebaseInit'
import { useSelector } from 'react-redux';

const Protected = ({ component: Component, ...rest }) => {

    const [currentUser, setCurrentUser] = useState(false)
    const [user, setUser] = useState(null)
    const data = useSelector((state) => state);

    const {userData:{loggedInUser, isAuthenticated}} = data

 

useEffect(() => {
    console.log('ISAUTH: ', isAuthenticated)
    if (isAuthenticated) {
        setCurrentUser(true)
    }
}, [currentUser === false]);

    return (
        <Route {...rest}
            render={
                (props) => (
                    
                     isAuthenticated ?   <Component {...props} />  : <Redirect to={
                            {
                                pathname: '/',
                                state: {
                                    from: props.location
                                }
                            }
                        }/>
                    
                    
                )
            } />
    )
}
export default Protected;