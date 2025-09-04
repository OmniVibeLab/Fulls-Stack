import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import Logo from '../upload/logo.png';
import {
  Home,
  Search,
  Heart,
  User,
  Bell,
  Settings,
  Compass,
  MessageCircle,
  PlusSquare,
  Bookmark,
  LogOut,
  Users,
  Image,
  X
} from "lucide-react";
import authService from "../services/authService";
import { toast } from 'react-hot-toast';

const CreatePostModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create Post</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What's on your mind?"
            ></textarea>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                <Image size={20} />
                <span>Add Photo</span>
              </button>
            </div>
            <button className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition-colors">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navigation = [
    { name: "Home", href: "/app", icon: Home },
    { name: "Search", href: "/app/search", icon: Search },
    { name: "Explore", href: "/app/explore", icon: Compass },
    { name: "Messages", href: "/app/chat", icon: MessageCircle },
    { name: "Notifications", href: "/app/notifications", icon: Bell },
    { name: "Create", href: "#", icon: PlusSquare, onClick: () => setShowCreatePost(true) },
    { name: "Profile", href: "/app/profile", icon: User },
  ];

  const secondaryNav = [
    { name: "Saved", href: "/app/saved", icon: Bookmark },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/app') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Create Post Modal */}
      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />

      {/* Sidebar */}
      <div className="hidden sm:flex w-64 bg-white border-r flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link to="/app" className="flex items-center">
            <img src={Logo} alt="Logo" className="w-8 h-8 rounded-md" />
            <span className="ml-2 text-xl font-bold text-gray-900">Social App</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
              }}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Secondary Navigation */}
        <div className="px-4 py-4 space-y-1">
          {secondaryNav.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.name}
            </Link>
          ))}
          
          {/* User Profile */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center px-4 py-3">
              <img
                src={user?.avatar || 'https://via.placeholder.com/32'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500">@{user?.username || 'username'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t sm:hidden">
        <nav className="flex justify-around p-2">
          {navigation.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`p-2 text-center ${
                isActive(item.href) ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <item.icon size={24} />
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Home'}
              </h1>
              <div className="flex items-center space-x-4">
                <button 
                  className="p-2 text-gray-500 hover:text-gray-700 sm:hidden"
                  onClick={() => setShowCreatePost(true)}
                >
                  <PlusSquare size={20} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 sm:hidden">
                  <Bell size={20} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 sm:hidden">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;