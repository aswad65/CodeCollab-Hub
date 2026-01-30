import React, { useEffect, useState } from 'react'
import { useProjectContext } from '../Context/ProjectContext'
import { useNavigate } from "@tanstack/react-router";
import { useUserContext } from '../Context/UserContext';
import { HomeIcon, PlusIcon, DocumentDuplicateIcon, GlobeAltIcon, PuzzlePieceIcon, BookOpenIcon, AcademicCapIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export const Home = () => {
  const navigate = useNavigate()
  const {user}=useUserContext()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [name, setName] = React.useState('')
  const {CreateProject,fetchProjects, Getproject, DeleteProject} = useProjectContext()

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleCreate = () => {
    setName('')
    setIsOpen(false)
    CreateProject(name)
  }
        
  useEffect(() => {
    fetchProjects();
    
  }, [Getproject])
      


  const navItems = [
    { name: 'Create App', icon: PlusIcon, onClick: () => setIsOpen(true), active: true },
    { name: 'Home', icon: HomeIcon, onClick: () => navigate({ to: '/' }), active: true },
    { name: 'Profile', icon: AcademicCapIcon, onClick: () => navigate({ to: '/profile' }), active: true },
    { name: 'Import code or design', icon: DocumentDuplicateIcon, onClick: () => {}, active: false },
    { name: 'Apps', icon: PuzzlePieceIcon, onClick: () => {}, active: false },
    { name: 'Published apps', icon: GlobeAltIcon, onClick: () => {}, active: false },
    { name: 'Developer Frameworks', icon: AcademicCapIcon, onClick: () => {}, active: false },
    { name: 'Learn', icon: BookOpenIcon, onClick: () => {}, active: false },
    { name: 'Documentation', icon: BookOpenIcon, onClick: () => {}, active: false },
  ]

  return (
    <main className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`w-64 bg-gray-800 text-white flex-col z-40 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">CodeCollab Hub</h1>
        </div>
        <nav className="grow">
          <ul>
            {navItems?.map((item) => (
              <li key={item.name} onClick={item.active ? item.onClick : undefined} className={`relative flex items-center p-4 ${item.active ? 'hover:bg-gray-700 cursor-pointer' : 'opacity-50 blur-[1px] cursor-not-allowed group'}`}>
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
                {!item.active && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white bg-gray-800 bg-opacity-70 group-hover:opacity-100 opacity-0 transition-opacity duration-200">
                    Coming soon
                  </span>
                )}</li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="px-2 py-1 flex justify-center items-center shadow-2xl text-black bg-gray-500 cursor-pointer rounded-full w-full">
            {user?.email?.charAt(0)}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <section className={`grow p-6 bg-gray-100 overflow-auto relative md:ml-0 md:pl-6 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} transition-all duration-200 ease-in-out`}>
        <div className="md:hidden absolute top-4 left-4 z-50">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-800 focus:outline-none">
            {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-6">Welcome, {user?.email}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Getproject?.map((project) => (
            <div
              key={project._id}
            
              className="bg-white rounded-lg relative shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
            >
              <svg className='right-2 absolute' onClick={()=>DeleteProject(project._id)}  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720h400-400Z"/></svg>

              <h3  
               onClick={() =>
                navigate({
                  to: "/project",
                  state: { project },
                  search: { projectId: project._id },
                })
              } className="text-xl font-semibold mb-2 hover:underline w-fit hover:bg-gray-100">{project?.name}</h3>
              <p className="text-gray-600">
                Collaboration: {project?.users.length}

              </p>
            </div>
          ))}
        </div>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/30  bg-opacity-40"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-[200px] max-w-md p-6 mx-4"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Create Project</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring"
                placeholder="Project name"
                autoFocus
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 rounded cursor-pointer bg-blue-600 flex justify-center items-center w-full text-white"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}