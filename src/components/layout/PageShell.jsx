import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';

export default function PageShell() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <NavBar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
