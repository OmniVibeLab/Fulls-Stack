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
  Image,
  X
} from "lucide-react";
import authService from "../services/authService";
import { toast } from 'react-hot-toast';

// Create Post Modal
const CreatePostModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white rounded-lg max-w-lg w-full p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <textarea
          className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          placeholder="What's on your mind?"
        />
        <div className="flex justify-between items-center">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
            <Image size={20} /> <span>Add Photo</span>
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Post
          </button>
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
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Messages", href: "/chat", icon: MessageCircle },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Create", href: "#", icon: PlusSquare, onClick: () => setShowCreatePost(true) },
    { name: "Profile", href: `/profile/${user?.username}`, icon: User },
  ];

  const secondaryNav = [
    { name: "Saved", href: "/saved", icon: Bookmark },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Modal */}
      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />

      {/* Sidebar */}
      <div className="hidden sm:flex w-64 bg-white border-r flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="w-8 h-8 rounded-md" />
            <span className="ml-2 text-xl font-bold text-gray-900">Social App</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={(e) => item.onClick && (e.preventDefault(), item.onClick())}
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

        <div className="px-4 py-4 space-y-1 border-t">
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

          <div className="mt-4 flex items-center space-x-3">
            <img
              src={user?.avatar || "https://via.placeholder.com/32"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500">@{user?.username}</p>
            </div>
            <button onClick={handleLogout} className="ml-auto text-red-600 hover:text-red-800">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t sm:hidden">
        <nav className="flex justify-around p-2">
          {navigation.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${isActive(item.href) ? "text-blue-600" : "text-gray-500"}`}
            >
              <item.icon size={24} />
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {navigation.find((item) => isActive(item.href))?.name || "Home"}
            </h1>
            <div className="flex items-center sm:hidden space-x-2">
              <button onClick={() => setShowCreatePost(true)} className="text-gray-500">
                <PlusSquare size={20} />
              </button>
              <Bell size={20} className="text-gray-500" />
              <MessageCircle size={20} className="text-gray-500" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
