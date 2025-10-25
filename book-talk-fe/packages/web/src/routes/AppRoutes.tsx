import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {DebateFull, DebatePage, MainPage, NotFound} from './index.ts';
import {ModalProvider} from '../providers';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <ModalProvider>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/debate/:debateId" element={<DebatePage/>}/>
                    <Route path="/debate-full" element={<DebateFull/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </ModalProvider>
        </BrowserRouter>
    );
}