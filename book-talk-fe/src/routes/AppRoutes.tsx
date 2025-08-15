import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {MainPage} from './index.ts';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}