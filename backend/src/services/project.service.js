import { ProjectModel } from "../models/project.model.js";
import mongoose from 'mongoose'
import User from '../models/Usermodel.js'


export const createprojectservice = async (name, userId) => {
    const project = await ProjectModel.create({
        name,
        users: [userId]

    });
    return project;
}
export const gettingallprojectsservice = async (userId) => {
    const projects = await ProjectModel.find({ users: userId })
    return projects
}
export const addUserservice = async (user, projectId, userId) => {

    if (!userId) throw new Error('Logged-in user required');
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid projectId');
    }


    const userIds = Array.isArray(user) ? user : [user];
    if (userIds.length === 0) throw new Error('No user ids provided');

    for (const u of userIds) {
        if (!mongoose.Types.ObjectId.isValid(String(u))) {
            throw new Error('Invalid user id to add');
        }
    }

    const project = await ProjectModel.findById({ _id: projectId });
    if (!project) throw new Error('Project not found');

 
    const UpdatedUsers = await ProjectModel.findByIdAndUpdate(
        {
            _id: projectId
        }, {
        $addToSet: { users: { $each: userIds } }
    }, {
        new: true
    }


    )



    return UpdatedUsers


}
export const gettingprojectbyIdservice = async (id) => {
    const project = await ProjectModel.findById(id).populate('users', 'email name');
    return project;
}
export const gettingprojectfiletreeservice = async (projectId, fileTree) => {
    const project = await ProjectModel.findOneAndUpdate(
        { _id: projectId },
        { $set: { fileTree: fileTree } },  
        { new: true, upsert: true }
    );
    return project;
};

export const deleteprojectservice = async (projectId) => {
    const project = await ProjectModel.findOneAndDelete({ _id: projectId });
    return project;
}
