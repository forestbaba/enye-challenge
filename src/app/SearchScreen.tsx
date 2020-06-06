import React, { useState, useEffect, ChangeEvent } from 'react'
import {  LoadingOutlined } from '@ant-design/icons';
import { Select, Input, List, Avatar, Button, Spin, Alert } from 'antd';
import './styles.css'

import 'antd/dist/antd.css';
import axios from 'axios'

const { Option } = Select;

interface Props {
    latitude: number;
    longitude: number;
}

const SearchScreen: React.FC<Props> = ({}) =>  {

    const [searchResult, setsearchResult] = useState<any[]>([])
    const [filteredResult, setfilteredResult] = useState<any[]>([])
    const [localSearch] = useState<any[]>([])
    const [disableButton] = useState<boolean>(false)
    const [showSpinner, setshowSpinner] = useState<boolean>(false)
    const [showLoadingError] = useState<boolean>(false)
    const [lat, setLat] = useState<number>(0)
    const [lon, setLon] = useState<number>(0)
    const [errorMsg, seterrorMsg] = useState<string>('')
    const [radius, setRadius] = useState<number>(20)

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

   

    useEffect(() => {

         setfilteredResult(searchResult)

        let location = null;
        let latitude = null;
        let longitude = null;
        if (window.navigator && window.navigator.geolocation) {
            location = window.navigator.geolocation
        }
        if (location) {
            location.getCurrentPosition(function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                setLat(latitude)
                setLon(longitude)
            })
        }
    }, [searchResult, errorMsg])

console.log('search result:', searchResult)

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setRadius(parseInt(value) * 1000)
        console.log('New Radius: ', radius)
    }

    const handleSearch = () => {


        setshowSpinner(true)
        axios.post(`https://limitless-fortress-61614.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${radius * 1000}&type=hospitals&keyword=medical&key=AIzaSyD6MK_F1geodPtX4UDpWnD6DsvuX9pipTc&location=${lat},${lon}`)
            .then(places => {
                if (places) {
                    setsearchResult(places.data.results)
                    setshowSpinner(false)
                }
                if (places.data.status.toString() === 'ZERO_RESULTS') {
                    seterrorMsg('No results at the moment, try again later')
                }
                if (places.data.error_message) {
                    seterrorMsg(places.data.error_message)
                }
                console.log('Suppose: ', places.data)
            })
            .catch(err => {
                console.log('ERR+ ', err)
                seterrorMsg(err.error_message)
                setshowSpinner(false)

            })
    }

    const handleSearchFilter = (event: ChangeEvent<HTMLInputElement>) => {
     //   const value = e.target.value;
        let query = event.target.value;
        // const currValue = e.target.value.split(' ');
        const filteredData = searchResult && searchResult.filter(entry =>
            entry.name && entry.name.toLowerCase().includes(query.toLowerCase()) ||
            entry.vicinity.name && entry.vicinity.name.toLowerCase().includes(query.toLowerCase()) 
            // entry.paymentReference && entry.paymentReference.toLowerCase().includes(currValue.toLowerCase())
        );
        if (filteredData) {
            setfilteredResult(filteredData);
        } else {
            setfilteredResult(searchResult)
        }


        // setlocalSearch(value)

        //console.log('====', value)
    }

    let options;
    if (localSearch.length) {
        const searchPattern = new RegExp(localSearch.map(term => `(?=.*${term})`).join(''), 'i');
        options = searchResult.filter(option =>
            option.match(searchPattern)
        );
    } else {
        options = searchResult;
    }

    return (
        <div className='container'>
            {
                errorMsg && errorMsg.length > 0 ?
                   ( <Alert
                        message="Error"
                        description={errorMsg}
                        type="error"
                        showIcon
                        closable
                    />) : null
            }
            
            <div>
                <h5>Please Select search Radius and search button to search for hospitals near you  </h5>
                <div className='radius_option'>
                    <Select defaultValue="Select radius" style={{ width: 120 }} onChange={handleChange}>
                        <Option value="5">5</Option>
                        <Option value="10">10</Option>
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
                filteredResult && filteredResult.length > 0 ?
                    (<div>
                        <p>Search results: </p>

                        <Input
                            placeholder="Filter to hospitals..."
                            // enterButton="Search"
                            size="large"
                            // suffix={suffix}
                            onChange={handleSearchFilter}
                            className='searchbar' />


                        <List
                            itemLayout="horizontal"
                            dataSource={filteredResult}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.icon} />}
                                        title={item.name}
                                        description={item.vicinity}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                    ) : null
            }
        </div >
    )
}
export default SearchScreen 