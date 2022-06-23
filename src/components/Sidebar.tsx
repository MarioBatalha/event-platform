import Lesson from './Lesson';

const Sidebar = () => {
    return (
        <aside className="w-[348px] bg-gray-700 p-6 border-1 border-gray-600">
            <span className="font-bold txt-2xl pb-6 mb-6 border-b border-gray-500 block">Cronograma de aulas</span>
            <div className='flex flex-col gap-8'>
                <Lesson 
                    title="Aula-01"
                    slug="Aula-01"
                    availableAt={new Date()}
                    type="class"
                />
            </div>
        </aside>
    )
}

export default Sidebar;