import { Outlet } from 'react-router-dom';
import Navbar from '../components/NavBar';
import SearchFilterBar from '../components/SearchFilterBar'; // <--- Import
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#06070a] text-gray-100 flex flex-col">

            {/* 1. TOP NAVBAR */}
            <Navbar />

            {/* 2. SEARCH & FILTER BAR (Sticky) */}
            <SearchFilterBar />

            {/* 3. MAIN CONTENT */}
            <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
                <Outlet />
            </main>

        </div>
    );
};

export default DashboardLayout;