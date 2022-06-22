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

interface Lesson {
  id: string;
  title: string;
}
const App = () => {
  const { data } = useQuery<{ lessons: Lesson[] }>(GET_LESSON_QUERY);
  console.log(data)
  return (
    <ul>
      {
        data?.lessons.map(lesson => {
          return <li key={lesson.id}>{lesson.title}</li>
        })
      }
    </ul>
  )
}

export default App
