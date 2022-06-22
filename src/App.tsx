import { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client';
import { client } from './lib/apollo';

const GET_LESSON_QUERY = gql`
query {
  lessons {
    id
    title
  }
}`
const App = () => {
  const { data } = useQuery(GET_LESSON_QUERY);
  console.log(data)
  return (
    <h1 className="text-2xl">
      Hi there
    </h1>
  )
}

export default App
