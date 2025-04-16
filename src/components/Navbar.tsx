import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpenIcon, CheckSquareIcon, BarChartIcon, PlusSquareIcon, HomeIcon } from 'lucide-react';
const Navbar: React.FC = () => {
  const location = useLocation();
  const navItems = [{
    path: '/',
    label: 'Dashboard',
    icon: <HomeIcon size={20} />
  }, {
    path: '/create',
    label: 'Create Assignment',
    icon: <PlusSquareIcon size={20} />
  }, {
    path: '/grade',
    label: 'Grade Submissions',
    icon: <CheckSquareIcon size={20} />
  }, {
    path: '/analysis',
    label: 'Analysis',
    icon: <BarChartIcon size={20} />
  }];
  return <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BookOpenIcon size={24} className="mr-2" />
            <span className="font-bold text-xl">Homework Grader</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === item.path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>)}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === item.path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>)}
        </div>
      </div>
    </nav>;
};
export default Navbar;