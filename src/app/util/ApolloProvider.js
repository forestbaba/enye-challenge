import React from 'react'
import App from '../../App'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks'
import { Provider } from 'react-redux';
import {store} from '../redux'

const httpLink = createHttpLink({
    uri: 'https://enye-graphql.herokuapp.com/'
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})


export default (

    <ApolloProvider client={client}>
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>

        </React.StrictMode>
    </ApolloProvider>
)