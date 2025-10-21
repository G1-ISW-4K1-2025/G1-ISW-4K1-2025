import { useLocation, Outlet } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import ShopHeader from './ShopHeader';

const Layout = () => {
    const location = useLocation()
    let header

    switch (location.pathname) {
        case '/':
            header = <HomeHeader/>
            break
        case '/shop':
            header = <ShopHeader/>
            break
        case '/mercadopago':
            header = <></>
            break
        
        default:
            header = <HomeHeader/>
    }

    return (
        <div>
            {header}
            <main>
                <Outlet />
            </main>
        </div>
    );
};


export default Layout;