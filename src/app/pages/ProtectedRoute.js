import React, {useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom'
import { authentication } from '../util/FirebaseInit'

const Protected = ({ component: Component, ...rest }) => {

    const [ currentUser,setCurrentUser] = useState()
    useEffect(() => {
        authentication.onAuthStateChanged(function (user) {
            if (user) {
                setCurrentUser(user)
                console.log('There is user: ', user)
                console.log('There is user: ', Object.keys(user))
            } else {
                console.log('Nothing')
            }
        });
    }, [])

    return (
        <Route {...rest}
            render={
                (props) => {
                    
                    if (currentUser) {
                        return <Component {...props} />
                    } else {
                        return <Redirect to={
                            {
                                pathname: '/login',
                                state: {
                                    from: props.location
                                }
                            }
                        }/>
                    }
                    
                }
            } />
    )
}
export default Protected;