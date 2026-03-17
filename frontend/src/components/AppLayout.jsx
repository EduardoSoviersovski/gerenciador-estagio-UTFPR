import { Outlet } from 'react-router-dom';
import { MainHeader } from './MainHeader';

export const AppLayout = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MainHeader />
      
      <main style={{ 
        width: '100%', 
        padding: '2%', 
        boxSizing: 'border-box',
        flex: 1 
      }}>
        <Outlet />
      </main>

      <footer style={{ width: '100%', padding: '1%', textAlign: 'center', fontSize: '0.8rem' }}>
        © 2026 UTFPR - Campus Curitiba
      </footer>
    </div>
  );
};