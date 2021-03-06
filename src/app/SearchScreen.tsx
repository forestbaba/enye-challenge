import React, { useState, useEffect, ChangeEvent, MouseEvent, useRef } from 'react';
import { Select, Input, List, Avatar, Button, Spin, Alert, Tabs } from 'antd';
import { HistoryOutlined, LoadingOutlined,SearchOutlined } from '@ant-design/icons';
import './styles.css';
import { HistorySVG } from './styledsvg';
import 'antd/dist/antd.css';
import { useSelector } from 'react-redux';

import axios from 'axios';
import { dataBase } from './util/FirebaseInit';
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag';

const { Search } = Input;
const { Option } = Select;

interface Props {
	latitude: number;
	longitude: number;
	searchIndex: Number;

}


const SearchScreen: React.FC<Props> = ({}) => {
	const [ searchResult, setsearchResult ] = useState<any[]>([]);
	const [ searchHistory, setsearchHistory ] = useState<any[]>([]);
	const [ filteredResult, setfilteredResult ] = useState<any[]>([]);
	const [ predictedLoc, setpredictedLoc ] = useState<any[]>([]);
	const [ localSearch ] = useState<any[]>([]);
	const [ disableButton ] = useState<boolean>(false);
	const [ showSpinner, setshowSpinner ] = useState<boolean>(false);
	const [ showHistoryLoading, setshowHistoryLoading ] = useState<boolean>(false);
	const [ showHistorySpinner, setshowHistorySpinner ] = useState<boolean>(false);
	const [ showLoadingError ] = useState<boolean>(false);
	const [ lat, setLat ] = useState<number>(0);
	const [ lon, setLon ] = useState<number>(0);
	const [ errorMsg, seterrorMsg ] = useState<string>('');
	const [ suggestedValue, setsuggestedValue ] = useState<string>('');
	const [ searchKey, setsearchKey ] = useState<string>('');
	const [ radius, setRadius ] = useState<number>(20);
	const [ siValue, setsiValue ] = useState<string>('');
	const [ searchTerm, setsearchTerm ] = useState<string>('');
	const [ activeTab, setactiveTab ] = useState<string>('1');
	const [changeTabs, setchangeTabs] = useState<boolean>(true);

	// const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

	const [currentUser, setCurrentUser] = useState(false)
	const [user, setUser] = useState(null)
	const userdatax = useSelector((state: any) => state);
	// const { userData } = userdatax

	const { userData: { loggedInUser, isAuthenticated } } = userdatax
	
	const { loading, data } = useQuery(FETCH_SEARCH_HISTORY)


	useEffect(
		() => {
			console.log('========', userdatax.userData.user.uid)

			setfilteredResult(searchResult);
			let location = null;
			let latitude = null;
			let longitude = null;
			if (window.navigator && window.navigator.geolocation) {
				location = window.navigator.geolocation;
			}
			if (location) {
				location.getCurrentPosition(function(position) {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;

					setLat(latitude);
					setLon(longitude);
				});
			}
			
		},
		[searchResult, errorMsg, loggedInUser ]
	);
	

	const [addHistory, { error }] = useMutation(CREATE_HISTORY, {
		variables: {
			
			radius: ""+ radius,
			body: "" +suggestedValue,
			lat: "" +lat,
			lon: "" +lon,
			searchKey: searchKey,
			uid: userdatax.userData.user.uid
		
		},
		update(_, result) {
			console.log('The rws: ', result)
		}
	})
	const [fetchUserSearchHistory] = useMutation(FETCH_USER_HISTORY, {
		variables: {
			userId: userdatax.userData.user.uid
		},
		update(_, result) {
			let searchHis: any[] = [];
			console.log('The rws: ', result.data.fetchUserSearchHistory)

			result.data.fetchUserSearchHistory.forEach((item:any, i:any) => {
					// searchHis.push(doc.data());
				console.log('===', item)
				searchHis.push(item)
				});
				setsearchHistory(searchHis);
				setshowHistorySpinner(false);
				setshowHistoryLoading(false)
		}
	})
	


	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
		setRadius(parseInt(value) * 1000);
		console.log('New Radius: ', radius);
	};
	const handleSearchBodyChange = (value: string) => {
		console.log(`selected ${value}`);
		setsearchKey(value);
		// console.log('New Radius: ', radius);
	};

	const handleSearch = () => {
		// AIzaSyD6MK_F1geodPtX4UDpWnD6DsvuX9pipTc ====>test 0
		// AIzaSyB26e6iXj1nK2fKr9j8X77Q68mp3oYVxOQ ====>test
		//AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY  ====>live

		setshowSpinner(true);
		let searchHis: any[] = [];
		setpredictedLoc(searchHis)

		// axios.post(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${radius}&type=hospitals&keyword=${searchKey}&key=AIzaSyD6MK_F1geodPtX4UDpWnD6DsvuX9pipTc&location=${lat},${lon}`)

		axios.post(`https://enye-cors.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${radius}&type=medical&keyword=${searchKey}&key=AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY&location=${lat},${lon}`)
	
			.then((places) => {
				if (places) {
					if (places && places.data.length > 0) {
						seterrorMsg('')
					}
					setsearchResult(places.data.results);
					setsearchHistory(searchHis)

					if (suggestedValue) {
						addHistory()

					}
					setshowSpinner(false);
				}
				if (places.data.status.toString() === 'ZERO_RESULTS') {
					seterrorMsg('No results at the moment, try again later');
				}
				if (places.data.error_message) {
					seterrorMsg(places.data.error_message);
				}
				console.log('Suppose: ', places.data);
			})
			.catch((err) => {
				console.log('ERR+ ', err);
				seterrorMsg(err.error_message);
				setshowSpinner(false);
			});
	};

	const loadHistory = () => {
		setshowHistoryLoading(true)
		fetchUserSearchHistory()
		// console.log('====', bodyMen)
		// let searchHis: any[] = [];

		// setshowHistorySpinner(true);

		// dataBase
		// 	.collection('searchhistory')
		// 	.get()
		// 	.then((item) => {
		// 		item.docs.forEach((doc, i) => {
		// 			searchHis.push(doc.data());
		// 		});
		// 		setsearchHistory(searchHis);
		// 		setshowHistorySpinner(false);
		// 		setshowHistoryLoading(false)

		// 	})
		// 	.catch((err) => {
		// 		setshowHistoryLoading(false)

		// 		console.log('ERR: ', err);
		// 	});
	};

	const handleSearchSuggestion = async (event: MouseEvent<HTMLElement>) => {
		const { index } = (event.target as HTMLElement).dataset;
		let searchHis: any[] = [];

		let nIndex: string = index as string;
		let desc = predictedLoc[parseInt(nIndex)].description

		setsuggestedValue(desc)
		setpredictedLoc(searchHis)

		let resp:any = await axios.get('https://enye-cors.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json',
			{params:{
			address: desc,
			key: 'AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY'
			}
			})
		
	
		setLat(resp.data.results[0].geometry.location.lat)
		setLon(resp.data.results[0].geometry.location.lng)
	
	}
	const handleSearchItem = (event: MouseEvent<HTMLElement>) => {
		const { index } = (event.target as HTMLElement).dataset;
		let searchHis: any[] = [];

		let nIndex: string = index as string;
		// nIndex = index ||0

		// axios.post(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${radius}&type=${searchTerm}&keyword=medical&key=AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY&location=${lat},${lon}`)

		setshowSpinner(true);
		setsearchHistory([])


		axios.post(`https://enye-cors.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${searchHistory[parseInt(nIndex)].radius}&type=hospitals&keyword=${searchHistory[parseInt(nIndex)].searchKey}&key=AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY&location=${searchHistory[parseInt(nIndex)].lat},${searchHistory[parseInt(nIndex)].lon}`)
			.then((places) => {
				if (places) {
					if (places.data.length > 0) {
						seterrorMsg('')
					}
					setsearchResult(places.data.results);
					setsearchHistory(searchHis)
					searchHistory.reverse()

					setshowSpinner(false);
				}
				if (places.data.status.toString() === 'ZERO_RESULTS') {
					seterrorMsg('No results at the moment, try again later');
				}
				if (places.data.error_message) {
					seterrorMsg(places.data.error_message);
				}
			})
			.catch((err) => {
				console.log('ERR+ ', err);
				seterrorMsg(err.error_message);
				setshowSpinner(false);
			});
	};

	const handleSearchKey = (event: MouseEvent<HTMLElement>) => {
		// let query = event.target.value;
		// console.log('>>>', query);

		// const currValue = e.target.value.split(' ');
		const filteredData =
			searchResult &&
			searchResult.filter(
				(entry) =>
					(entry.name && entry.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
					(entry.vicinity.name && entry.vicinity.name.toLowerCase().includes(searchTerm.toLowerCase()))
				// entry.paymentReference && entry.paymentReference.toLowerCase().includes(currValue.toLowerCase())
			);
		if (filteredData) {
			setfilteredResult(filteredData);
			setsearchTerm(searchTerm);
		} else {
			setfilteredResult(searchResult);
		}

		
	};

	const handleSearchFilter2 = (event: ChangeEvent<HTMLInputElement>) => { 
		let query = event.target.value;
		setsuggestedValue(query)
		

		axios.post(`https://enye-cors.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&location=${lat},${lon}&radius=${radius * 1000}&key=AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY&location`)
			.then(item => {
				if (item.data.length > 0) {
						seterrorMsg('')
				
				}
				setpredictedLoc(item.data.predictions)
			}).catch(err => {
			console.log('ERR: ', err)
		})
	}
	const handleSearchFilter = (event: ChangeEvent<HTMLInputElement>) => {
		//   const value = e.target.value;
		let query = event.target.value;
		setsearchTerm(query);


	};


	//ff0000
	return (
		<div className='parent'>

			
			<div style={{ backgroundColor: '#063861', height: 200, width: '100%' }} />

			{/* { errorMsg.length > 0 ? alert(errorMsg) : null} */}
			{/* {errorMsg && errorMsg.length > 0 ? (
				<Alert message="Error" description={errorMsg} type="error" showIcon closable />
			) : null} */}

			<div className='container'>
			<p style={{ fontWeight: 'bold', color: 'white', fontSize: '18px' }}>Search for nearest Hospitals, Pharmacies, Clinics and Medical centers nearby...</p>
				<div className="radius_option">
						<Select defaultValue="5 km"
							
							style={{ width: 200 }}
							onChange={handleChange}>
						<Option value="5">5 km</Option>
						<Option value="10">10 km</Option>
						<Option value="20">20 km</Option>
						<Option value="30">30 km</Option>
						<Option value="50">50 km</Option>
						<Option value="100">100 km</Option>
					</Select>

					<Select defaultValue="Select Search Body" style={{ width: 200 }} onChange={handleSearchBodyChange}>
						<Option value="hospitals">Hospitals</Option>
						<Option value="pharmacy">Pharmacies</Option>
						<Option value="clinics">Clinics</Option>
						<Option value="medical offices">Medical Offices</Option>
						</Select>
						
				{/* <div className="searchAndIcon"> */}
				<div className="searchbar-container">
					<div className='search-container-2'>
					<Input
						placeholder="Filter for hospitals, Pharmacies, Clinic and Medical Offices.."
						size="large"
						// suffix={suffix}
						onChange={handleSearchFilter2}
									className="searchbar"
									value={suggestedValue}
					/>
						<SearchOutlined
							disabled={disableButton}
							onClick={handleSearch}
							className='search-icon'
						style={{fontSize: '25px', padding: '10px', paddingTop:'7px',position:'absolute',marginLeft:'37%'}} />
					</div>
					{
						predictedLoc && predictedLoc.length > 0 ?
							<div className='scard2'>

								{predictedLoc && predictedLoc.length > 0 ? <p className='stitle'>Suggested Locations: </p> : null}

								{predictedLoc && predictedLoc.length > 0 ? (
									predictedLoc.map((item: any, index: number) => {
										return (
											<>
												<p onClick={handleSearchSuggestion} data-index={index} className="searchList">
													{item.description}
												</p>
											</>
										);
									})
								) : null}
							</div> : null

					}

					</div>				
								
					<div className='history_parent'>	
						<div className='history_and_title'>
							<HistoryOutlined onClick={loadHistory} className='searchIconx' style={{ color: "#ffffff"}} />
							<p>Search history</p>
							{showHistoryLoading ? <LoadingOutlined style={{ fontSize: 24, color:'#ffffff', marginLeft:'10px'}} spin /> : null}
						</div>
					{
						searchHistory && searchHistory.length > 0 ?
							<div className='scard'>

								{searchHistory && searchHistory.length > 0 ? <p className='stitle'>Search History: </p> : null}

								{searchHistory && searchHistory.length > 0 ? (
									searchHistory.map((item: any, index: number) => {
										return (
											<>
												<p onClick={handleSearchItem} data-index={index} className="searchList">
													{item.body}
												</p>
											</>
										);
									})
								) : null}
							</div> : null

					}
				</div>
			</div>
					
								
					
					
			<div className="spinner">{showSpinner ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : null}</div>

				
				{showLoadingError ? <p>Error, please select radius to search</p> : null}

				
			
			
			{filteredResult && filteredResult.length > 0 ? (
				<div style={{marginTop:'65px', marginBottom:'25px'}}>
					
					<p className='search-title'>Search results: </p>

					<List
						itemLayout="horizontal"
						dataSource={filteredResult}
						renderItem={(item) => (
							<List.Item
									style={{
										borderRadius: '10px',
									boxShadow: ' 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
										padding: '20px',
										marginTop: '20px'}}>
								<List.Item.Meta
									avatar={<Avatar src={item.icon} />}
									title={item.name}
									description={item.vicinity}
								/>
							</List.Item>
						)}
					/>
				</div>
			 ) : searchResult.length > 0 ? (
					<>
				<Input
					placeholder="Filter to hospitals..."
					size="large"
					onChange={handleSearchFilter}
					className="searchbar"
					style={{ marginTop: '20px' }}
					/>
						<button
							onClick={handleSearchKey}
						style={{width:'150px',marginTop:'20px' }}>Search</button>
						</>

				) : null} 
			
			</div>
		</div>
	);
};


const FETCH_SEARCH_HISTORY = gql`
	{	
		getSearchHistory{
		radius lat lon searchKey
	}
}
`

const CREATE_HISTORY = gql`
mutation addHistory(
	$radius:String!
	$lat:String!
	$lon:String!
	$uid:String!
	$body:String!
	$searchKey:String!
){
	addHistory(
		radius: $radius
		lat: $lat
		lon: $lon
		uid: $uid
		body: $body
		searchKey: $searchKey
	){
		uid
	}
}
`

const FETCH_USER_HISTORY = gql`
mutation fetchUserSearchHistory(
	$userId:String!
	
){
	fetchUserSearchHistory(
		userId: $userId
		
	){
		radius
		lat
		lon
		uid
		body
		searchKey
	}
}
`
export default SearchScreen;
