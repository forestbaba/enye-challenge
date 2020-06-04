import React, { useState } from 'react'
import { AudioOutlined, LoadingOutlined } from '@ant-design/icons';
import { Select, Input, List, Avatar, Button, Spin } from 'antd';
import './styles.css'

import 'antd/dist/antd.css';
// import './index.css';


const { Option } = Select;
const { Search } = Input;

const SearchScreen = () => {

    const [data, setdata] = useState([
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ])
    const [searchResult, setsearchResult] = useState([])
    const [disableButton, setdisableButton] = useState(false)
    const [showSpinner, setshowSpinner] = useState(false)
    const [showLoadingError, setshowLoadingError] = useState(false)

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


    const handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    const handleSearch = () => {
        console.log('Searching')
    }

    return (
        <div className='container'>

            <div>
                <h5>Please Select search Radius and search button to search for hospitals near you  </h5>
                <div className='radius_option'>
                    <Select defaultValue="20" style={{ width: 120 }} onChange={handleChange}>
                        <Option value="20">20</Option>
                        <Option value="30">30</Option>
                        <Option value="50">50</Option>
                        <Option value="100">100</Option>
                    </Select>
                    {
                        showLoadingError ? <p>Error, please select radius to search</p> : null
                    }
                   
                </div>
                <div className='button_holder'>
                    <Button type="primary"
                        className='action_button'
                        disabled={disableButton}
                        onClick={handleSearch}>Search</Button>
                    <div className='spinner'>
                        {
                            showSpinner ? <Spin indicator={antIcon} /> : null
                        }
                       
                    </div>
                </div>
            </div>
            {
                searchResult.length > 0 ?
                    <>
                        <Input
                            placeholder="input search text"
                            // enterButton="Search"
                            size="large"
                            // suffix={suffix}
                            onSearch={value => console.log(value)}
                            className='searchbar'
                        />


                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={<a href="https://ant.design">{item.title}</a>}
                                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                    />
                                </List.Item>
                            )}
                        />
                    </> : null
            }

        </div >
    )
}
export default SearchScreen 