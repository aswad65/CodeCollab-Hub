import express from "express";
import { IsAuth } from "../middlewares/Auth.js";
import {DeleteProject, AddUser, createProject, GetAllProjects, GetprogectbyId, GetprojectfiletreebyId } from "../controllers/Project.controller.js";
import { body } from "express-validator";
import { ProjectModel } from "../models/project.model.js";
const router = express.Router();

router.post(
    "/create",
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .custom(async (value) => {
            const existing = await ProjectModel.findOne({ name: value });
            if (existing) {
                return Promise.reject("Name already in use");
            }
            return true;
        }),
    IsAuth,
    createProject
);



router.get(
    "/getAll-project",
    IsAuth,
    GetAllProjects
);


router.put(
        "/add-user",
        body('user')
            .notEmpty().withMessage('User ID(s) required')
            .bail()
            .custom((value) => {
                if (Array.isArray(value)) return true;
                if (typeof value === 'string') return true;
                throw new Error('User must be an id or an array of ids');
            }),
        body('user.*')
            .optional()
            .isMongoId().withMessage('Invalid user ID format'),

        body("projectId")
                .trim()
                .notEmpty().withMessage("Project ID is required")
                .isMongoId().withMessage("Invalid project ID format"),
        IsAuth,
        AddUser
);

router.put(
    "/get-project-filetree",
    body("fileTree")
        .optional()
        .custom((value) => {
            if (typeof value === 'object' && value !== null) return true;
            throw new Error('fileTree must be an object');
        }),
    IsAuth,
    GetprojectfiletreebyId
);

router.get(
    "/get-project/:id",
    body("userId")
        .trim()
        .notEmpty().withMessage("User ID is required")
        .isMongoId().withMessage("Invalid user ID format"),
    IsAuth,
    GetprogectbyId
);
export default router;


router.post("/delete-project", IsAuth, DeleteProject);




