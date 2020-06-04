import React, { useState } from 'react'
import { AudioOutlined } from '@ant-design/icons';
import { Select, Input, List, Avatar, Button } from 'antd';
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


    const handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    return (
        <div className='container'>

            <div>
                <h5>Please Select search Radius and search button to search for hospitals near you  </h5>
                <div className='radius_option'>
                    <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled">Hi</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                    <p>Error, please select radius to search</p>
                </div>
                <Button type="primary" className='action_button'>Search</Button>
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