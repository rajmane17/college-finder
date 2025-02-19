import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <>
            {/* The Navbar stays here at the top */}
            <Navbar />

            {/* Child routes will be rendered here */}
            <Outlet />
        </>
    );
};

export default Layout;
