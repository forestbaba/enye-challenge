import React, {useState, useEffect} from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { authentication } from '../util/FirebaseInit'
import { logOut } from '../redux/User/action'


const { Header, Content, Sider } = Layout;

const HeaderLayout = ({ isAuthenticated }) => {

    let dispatcher = useDispatch()
let history  = useHistory()

    const [active, setActive] = useState(1)
    const pathname = window.location.pathname;

    const path = pathname === '/' ? '1' : pathname.substr(1)
    useEffect(() => {
       
        // if (path === 'login') {
        //     console.log('Check 1')
        //     setActive(2)
        // } else if (path === 'register') {
        //     setActive(3)
        //     console.log('Check 121')

        // }

        if (!isAuthenticated) {
            history.push('/')
        }
    }, [isAuthenticated])

    const handleLogout = () => {
        // console.log('The ISAUthenticated: ', isAuthenticated)
        // console.log('The CLicked: ', history)
        // authentication.signOut()
        // if (!isAuthenticated) {
        //     history.push('/')
        // }

        dispatcher(logOut())
          

    }
    
    console.log('==', isAuthenticated)
    return (
        <Header className="header">
            {
                isAuthenticated && isAuthenticated ? (
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[active]}>

                        <Menu.Item key="1"> <Link to='/'>Home</Link></Menu.Item>
                        <Menu.Item key="2" onClick={handleLogout}> Log out</Menu.Item>
                    </Menu>
                ) : (
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[active]}>

                            <Menu.Item key="2"> <Link to='/'>Login</Link></Menu.Item>
                            <Menu.Item key="3" to='/register'><Link to='/register'>Register</Link></Menu.Item>
                        </Menu>
                )
            }
           
        </Header>
    )
}
export default HeaderLayout;