
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full px-6 h-16 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md z-10">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-medium tracking-tight">
          ChessLink
        </Link>
      </div>
      
      <nav className="flex items-center space-x-6">
        <Link 
          to="/" 
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          New Game
        </Link>
        <Link 
          to="/profile" 
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Profile
        </Link>
      </nav>
    </header>
  );
}
