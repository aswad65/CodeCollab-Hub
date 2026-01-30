import User from "../models/Usermodel.js";
import { addUserservice,deleteprojectservice, createprojectservice, gettingallprojectsservice, gettingprojectbyIdservice, gettingprojectfiletreeservice } from "../services/project.service.js";
import { validationResult } from "express-validator";
export const createProject=async(req,res)=>{
    const errors = validationResult(req);

      if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    try{  
     const {name}=req.body;
    const  loggedIn=await User.findOne({email:req.user.email});
    const project=await createprojectservice(name,loggedIn);

    res.status(201).json({
        success:true,
        message:"Project created successfully",
        project:project
    });
    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message
        });
        
    }


}

export const GetAllProjects=async(req,res)=>{
 
  try{
      const loggedInUser=await User.findOne({email:req.user.email})
      const project=await gettingallprojectsservice(loggedInUser.id);
      res.status(201).json(
        {project:project}
      )
  }catch(error){
    res.status(500).json({
      success:false,
      error:error.message
    });
  }
}
export const GetprogectbyId=async(req,res)=>{
  try{
    const {id}=req.params;
    const project=await gettingprojectbyIdservice(id);
    res.status(200).json({
      success:true,
      project:project
    });
  }catch(error){
    const msg = String(error.message || '');
    if (msg.includes('Invalid')) return res.status(400).json({ success: false, error: msg });
    if (msg.includes('not found')) return res.status(404).json({ success: false, error: msg });
    if (msg.includes('Only the project owner')) return res.status(403).json({ success: false, error: msg });

    res.status(500).json({
      success:false,
      error:error.message
    });
  }
}

export const AddUser=async(req,res)=>{
  const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  try{
    const {user,projectId}=req.body;
    const loggedInUser=await User.findOne({email:req.user.email});
    
    
    const project=await addUserservice(user,projectId,loggedInUser);
    res.status(200).json({
      success:true,
      message:"User added successfully",
      project:project
    });

  }catch(error){
    res.status(500).json({
      success:false,
      error:error.message
    });
  }
}

export const GetprojectfiletreebyId=async(req,res)=>{
  try{
    const {projectId,fileTree}=req.body;
    const project=await gettingprojectfiletreeservice(projectId,fileTree);
    res.status(200).json({
      success:true,
      project:project.fileTree
    });
  }catch(error){
    res.status(500).json({
      success:false
    });          
    }
}
export const DeleteProject=async(req,res)=>{
  try{
    const {projectId}=req.body;
    const project=await deleteprojectservice(projectId);
    res.status(200).json({
      success:true,
      message:"Project deleted successfully",
      project:project
    });
  }catch(error){
    res.status(500).json({
      success:false,
      error:error.message
    });
  }
}