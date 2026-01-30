import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import { useProjectContext } from '../Context/ProjectContext'
import { useUserContext } from '../Context/UserContext';

export const Profile = () => {
  const { Getproject, fetchProjects } = useProjectContext()
  const { user, } = useUserContext()

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects])

    const [isOpen, setIsOpen] = useState(false);
  const projectCount = Getproject?.length;
  const collaboratorCount = Getproject?.reduce((total, project) => total + project.users.length, 0);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-purple-200 p-6 overflow-hidden">
      <button
        className="fixed top-0 cursor-pointer left-2 z-50 text-gray-800 focus:outline-none"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <Sidebar isOpen={isOpen} onClose={toggleSidebar} />
      <div className="relative bg-linear-to-r mt-5 from-blue-600 to-indigo-700 h-48 rounded-lg shadow-md mb-8 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">My Profile</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 -mt-24 relative">
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-5xl font-bold border-4 border-white shadow-lg mx-auto -mt-20 relative z-10">
          A
        </div>



        <div className="text-center mt-4">
          <h2 className="text-3xl font-bold text-gray-800">{user?.email} </h2>
          <p className="text-gray-600 text-lg italic">"I am programmer and I need to become a master in programming"</p>
          <LogoutButton />
        </div>

    

       <div className="mt-8 pt-8 border-t border-gray-200">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
    
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      <p className="text-3xl font-bold text-gray-800">{projectCount}</p>
      <p className="text-sm text-gray-500 mt-1 tracking-wide">Projects</p>
    </div>

    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      <p className="text-3xl font-bold text-gray-800">{collaboratorCount}</p>
      <p className="text-sm text-gray-500 mt-1 tracking-wide">Collaborators</p>
    </div>

  </div>
</div>

      </div>
    </div>

  )
}

function LogoutButton() {
  const { logoutUser } = useUserContext();
  return (
    <button
      onClick={logoutUser}
      className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition font-semibold"
    >
      Logout
    </button>
  );
}