import { gql, useQuery } from '@apollo/client';
import Lesson from './Lesson';

const GET_LESSONS_QUERY = gql`
query {
    lessons(orderBy: availableAt_ASC, stage: PUBLISHED) {
        id
        lessonType
        availableAt
        title
        slug
    }
}`

interface SetLessonQueryResponse {
    lessons: {
        id: string
        title: string
        slug: string
        availableAt: string
        lessonType: 'live' | 'class'
    }[]
}

const Sidebar = () => {
    const { data } = useQuery<SetLessonQueryResponse>(GET_LESSONS_QUERY);
    return (
        <aside className="w-[348px] bg-gray-700 p-6 border-1 border-gray-600">
            <span className="font-bold txt-2xl pb-6 mb-6 border-b border-gray-500 block">Cronograma de aulas</span>
            <div className='flex flex-col gap-8'>
                {data?.lessons.map((lesson) => {
                    return (
                    <Lesson 
                    key={lesson.id}
                    title={lesson.title}
                    slug={lesson.slug}
                    availableAt={new Date(lesson.availableAt)}
                    type={lesson.lessonType}
                />
                    )
                })}
            </div>
        </aside>
    )
}

export default Sidebar;