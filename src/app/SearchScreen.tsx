import React, { useState, useEffect, ChangeEvent, MouseEvent, useRef } from 'react';
import { Select, Input, List, Avatar, Button, Spin, Alert, Tabs } from 'antd';
import { HistoryOutlined, LoadingOutlined } from '@ant-design/icons';
import './styles.css';
import { HistorySVG } from './styledsvg';
import 'antd/dist/antd.css';
import axios from 'axios';
import { dataBase } from './util/FirebaseInit';


const { Search } = Input;
const { TabPane} = Tabs;
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
	const [ showHistorySpinner, setshowHistorySpinner ] = useState<boolean>(false);
	const [ showLoadingError ] = useState<boolean>(false);
	const [ lat, setLat ] = useState<number>(0);
	const [ lon, setLon ] = useState<number>(0);
	const [ errorMsg, seterrorMsg ] = useState<string>('');
	const [ searchKey, setsearchKey ] = useState<string>('');
	const [ radius, setRadius ] = useState<number>(20);
	const [ siValue, setsiValue ] = useState<string>('');
	const [ searchTerm, setsearchTerm ] = useState<string>('');
	const [ activeTab, setactiveTab ] = useState<string>('1');
	const [ changeTabs, setchangeTabs ] = useState<boolean>(true);

	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

	useEffect(
		() => {
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
		[ searchResult, errorMsg ]
	);
	useEffect(() => {
		let searchHis: any[] = [];

		setshowHistorySpinner(true);

		console.log('load history');
		dataBase
			.collection('searchhistory')
			.get()
			.then((item) => {
				item.docs.forEach((doc, i) => {
					console.log('ITEM: ', doc.data());
					searchHis.push(doc.data());
				});
				setsearchHistory(searchHis);
				setshowHistorySpinner(false);
			})
			.catch((err) => {
				console.log('ERR: ', err);
			});

	},[])

	// console.log('search result:', searchResult);

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

		// axios.post(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${radius}&type=hospitals&keyword=${searchKey}&key=AIzaSyD6MK_F1geodPtX4UDpWnD6DsvuX9pipTc&location=${lat},${lon}`)

		axios.post(`https://enye-cors.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${radius}&type=${searchKey}&keyword=medical&key=AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY&location=${lat},${lon}`)
	
			.then((places) => {
				if (places) {
					setsearchResult(places.data.results);
					setsearchHistory(searchHis)

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
		let searchHis: any[] = [];

		setshowHistorySpinner(true);

		console.log('load history');
		dataBase
			.collection('searchhistory')
			.get()
			.then((item) => {
				item.docs.forEach((doc, i) => {
					console.log('ITEM: ', doc.data());
					searchHis.push(doc.data());
				});
				setsearchHistory(searchHis);
				setshowHistorySpinner(false);
			})
			.catch((err) => {
				console.log('ERR: ', err);
			});
	};

	const handleSearchItem = (event: MouseEvent<HTMLElement>) => {
		const { index } = (event.target as HTMLElement).dataset;
		let searchHis: any[] = [];

		let nIndex: string = index as string;
		// nIndex = index ||0

		// axios.post(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${radius}&type=${searchTerm}&keyword=medical&key=AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY&location=${lat},${lon}`)


		axios.post(`https://enye-cors.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${searchHistory[parseInt(nIndex)].radius}&type=hospitals&keyword=${searchHistory[parseInt(nIndex)].searchQuery}&key=AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY&location=${lat},${lon}`)
			.then((places) => {
				if (places) {
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
				console.log('Suppose: ', places.data);
			})
			.catch((err) => {
				console.log('ERR+ ', err);
				seterrorMsg(err.error_message);
				setshowSpinner(false);
			});
	};

	const handleSearchKey = (event: MouseEvent<HTMLElement>) => {
		console.log('Search Term: ', searchTerm);
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

		if (searchTerm) {
			dataBase
				.collection('searchhistory')
				.add({
					radius: radius,
					body: searchTerm,
					searchQuery: searchKey
				})
				.then(function(docRef) {
					console.log('Document written with ID: ', docRef.id);
				})
				.catch(function(error) {
					console.error('Error adding document: ', error);
				});
		}
	};

	const handleSearchFilter2 = (event: ChangeEvent<HTMLInputElement>) => { 
		let query = event.target.value;
		console.log('The radius: ', radius)
		console.log('The query: ', query)
		console.log('The lat: ', lat)
		console.log('The lon: ', lon)

		axios.post(`https://enye-cors.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&location=${lat},${lon}&radius=${radius * 1000}&key=AIzaSyDvuTxJbVly2LHuwfA475wCv9bT91z5-WY&location`)
			.then(item => {
				setpredictedLoc(item.data.predictions)
			console.log('==Item: ', item.data)
			}).catch(err => {
			console.log('ERR: ', err)
		})
	}
	const handleSearchFilter = (event: ChangeEvent<HTMLInputElement>) => {
		//   const value = e.target.value;
		let query = event.target.value;
		setsearchTerm(query);


	};
	const onTabChange = () => {
		
	}
	const changeTab = () => {
		console.log('Change active tab')
		setactiveTab('1')
	}
	const switchView = () => {
		setchangeTabs(!changeTabs)
		console.log('Switch view')
	}
	const handleClickHistory = () => {
		console.log('The elementary')
	}

	return (
		<div className="container">
			{errorMsg && errorMsg.length > 0 ? (
				<Alert message="Error" description={errorMsg} type="error" showIcon closable />
			) : null}

			<div>
				{/* <h5>Please Select search Radius and search button to search for hospitals near you </h5> */}
				<div className="radius_option">
					<Select defaultValue="5 km" style={{ width: 200 }} onChange={handleChange}>
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
					<div className='contain'>
					<div className="searchAndIcon">
					<Input
						placeholder="Filter for hospitals, Pharmacies, Clinic and Medical Offices.."
						size="large"
						// suffix={suffix}
						onChange={handleSearchFilter2}
							className="searchbar"
						
					// value={siValue}
						/>
							<HistoryOutlined className='searchIconx' onClick={handleClickHistory}/>
						</div>
						
						{
							predictedLoc && predictedLoc.length > 0 ?
								<div className='scard2'>

									{predictedLoc && predictedLoc.length > 0 ? <p className='stitle'>Suggested Locations: </p> : null}

									{predictedLoc && predictedLoc.length > 0 ? (
										predictedLoc.map((item: any, index: number) => {
											return (
												<>
													<p onClick={handleSearchItem} data-index={index} className="searchList">
														{item.description}
													</p>
												</>
											);
										})
									) : null}
								</div> : null

						}
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
					
					<div className="spinner">{showSpinner ? <Spin indicator={antIcon} /> : null}</div>

					
					
				</div>
				
				<Button type="primary" className="action_button" disabled={disableButton} onClick={handleSearch}>
					Search
					</Button>
				
				{showLoadingError ? <p>Error, please select radius to search</p> : null}

				<Button
					type="primary"
					icon={showHistorySpinner ? <LoadingOutlined /> : <HistoryOutlined />}
					onClick={loadHistory}>
					Load search history
				</Button>

				{
					changeTabs ? (<p>Hellow Search</p>) : (
					<div>
			

					</div>)
				}
				
			
				<button onClick={switchView}>Switch View</button>

				
			</div>
			
			
			{filteredResult && filteredResult.length > 0 ? (
				<div>
					<div className='search-and-button'>
					<Input
						placeholder="Filter for hospitals, Pharmacies, Clinic and Medical Offices.."
						size="large"
						// suffix={suffix}
						onChange={handleSearchFilter}
						className="searchbar"
						// value={siValue}
					/>

					<button onClick={handleSearchKey}
						style={{ width: '150px', marginTop: '20px' }}>Search</button>
					</div>
					<p className='search-title'>Search results: </p>

					<List
						itemLayout="horizontal"
						dataSource={filteredResult}
						renderItem={(item) => (
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
	);
};
export default SearchScreen;
