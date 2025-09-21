import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {DebatePage, MainPage} from './index.ts';
import {ModalProvider} from '../providers';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <ModalProvider>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/debate/:debateId" element={<DebatePage/>}/>
                </Routes>
            </ModalProvider>
        </BrowserRouter>
    );
}