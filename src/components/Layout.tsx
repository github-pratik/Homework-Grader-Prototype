import React from 'react';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>Homework Grader Prototype &copy; {new Date().getFullYear()}</p>
      </footer>
      <Chatbot />
    </div>;
};
export default Layout;