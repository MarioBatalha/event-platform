import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: 'https://api-sa-east-1.graphcms.com/v2/cl4pdrlf21wvj01z4cy4e3vrw/master',
    cache: new InMemoryCache() 
})