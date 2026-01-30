import mongoose from "mongoose";    


const projectShema=new mongoose.Schema({
    name:{
        type:String,
        unique:[true,"Project name must be unique"],
        required: true,
        trim: true
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    fileTree: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export const ProjectModel=mongoose.model("Project",projectShema);