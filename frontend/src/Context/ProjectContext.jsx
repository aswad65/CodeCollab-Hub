import { createContext, useContext,useState } from 'react'
import axios from 'axios'
import { useNavigate } from '@tanstack/react-router'
import toast, { Toaster } from 'react-hot-toast'
import { router } from '../routes/Router'
import { useEffect } from 'react'

const ProjectContext = createContext()
export const ProjectContextProvider = ({ children }) => {
    const [Getproject, setGetproject] = useState([])
    const url='https://backend-cv0c.onrender.com'
    const [allUsers, setAllUsers] = useState([])

    async function CreateProject(name) {
        try {
            const data = await axios.post(
                `${url}/api/project/create`,
                { name },
                { withCredentials: true }
            )
            toast.success(data.data.message)
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    }

    const fetchAllUsers = async () => {
        try {
            const { data } = await axios.get(
                `${url}/api/user/Getallusers`,
                { withCredentials: true }
            );
            
            setAllUsers(data.users || []);
            
            
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        }
    }



    const fetchProjects=async()=> {
            try {
                const {data} = await axios.get(
                    `${url}/api/project/getAll-project`,
                    { withCredentials: true }
                );
                setGetproject(data.project)
                
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        }
     const DeleteProject = async (projectId) => {
        try {
            const data = await axios.post(`${url}/api/project/delete-project`,
                { projectId },
                { withCredentials: true }
            )
            toast.success(data.data.message)
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    }

const fetchProjectCollaborators=async(projectId)=> {
    try {
        const {data} = await axios.get(`${url}/api/project/get-project/${projectId}`, { withCredentials: true });
        
             return data.project.users
        
    }catch(error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        console.log("error ->", error);
        
    }
}

    return (
        <ProjectContext.Provider value={{DeleteProject,fetchProjectCollaborators, CreateProject, fetchProjects, Getproject, allUsers, fetchAllUsers }}>
            {children}
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </ProjectContext.Provider>
    )

}

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProjectContext must be used within ProjectContextProvider");
    }
    return context;
};
