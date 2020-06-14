import React, {useState, useEffect} from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom'


const { Header, Content, Sider } = Layout;

const HeaderLayout = ({ currentUser }) => {

    const [active, setActive] = useState(1)

    const pathname = window.location.pathname;

    const path = pathname === '/' ? '1' : pathname.substr(1)
    useEffect(() => {
       
        if (path === 'login') {
            console.log('Check 1')
            setActive(2)
        } else if (path === 'register') {
            setActive(3)
            console.log('Check 121')

        }
   },[])
    return (
        <Header className="header">
            {/* <div>Get inside Now</div> */}
            {
                currentUser ? (
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[active]}>

                        <Menu.Item key="1"> <Link to='/'>Home</Link></Menu.Item>
                        <Menu.Item key="2"> <Link to='/logout'>Log out</Link></Menu.Item>
                    </Menu>
                ) : (
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[active]}>

                            <Menu.Item key="2"> <Link to='/login'>Login</Link></Menu.Item>
                            <Menu.Item key="3" to='/register'><Link to='/register'>Register</Link></Menu.Item>
                        </Menu>
                )
            }
           
        </Header>
    )
}
export default HeaderLayout;