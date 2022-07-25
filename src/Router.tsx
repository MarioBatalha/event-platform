import { Routes, Route } from 'react-router-dom';
import Event from './pages/Event';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Event />} />
        </Routes>
    )
}

export default Router;