import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Schedule' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function NavBar() {
  return (
    <nav className="bg-masters-green-light border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm font-medium font-body transition-colors whitespace-nowrap
              ${isActive ? 'text-gold border-b-2 border-gold' : 'text-white/80 hover:text-white'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
