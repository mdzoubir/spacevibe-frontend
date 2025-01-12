// src/App.tsx
import {Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import {ProtectedRoute} from './components/ProtectedRoute';
import HouseDetailsPage from "./pages/HouseDetailsPage";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/house-details/:id"
                    element={
                        <ProtectedRoute>
                            <HouseDetailsPage/>
                        </ProtectedRoute>
                    }/>
            </Routes>
        </AuthProvider>
    );
}

export default App;