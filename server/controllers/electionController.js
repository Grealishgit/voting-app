const { v4: uuid } = require("uuid");
const cloudinary = require('../utils/cloudinary')
const HttpError = require("../models/ErrorModel");
const ElectionModel = require('../models/electionModel')
const path = require("path");
const candidateModel = require("../models/candidateModel");




//ADDING NEW ELECTION
//POST: api/elections
//PROTECTED FOR ADMINS ONLY
const addElection = async (req, res, next) => {
    //Only admin can add election
    if (!req.user.isAdmin) {
        return next(new HttpError("Only the admin is authorised to perform this action", 403));
    }

    try {
        const { title, description } = req.body;

        // Validate fields
        if (!title || !description) {
            return next(new HttpError("Please fill out all fields.", 422));
        }

        // Validate thumbnail file
        if (!req.files || !req.files.thumbnail) {
            return next(new HttpError("Please choose a thumbnail.", 422));
        }

        const { thumbnail } = req.files;

        // Check thumbnail size
        if (thumbnail.size > 1000000) {
            return next(new HttpError("Thumbnail size should be less than 1MB.", 422));
        }

        // Rename the thumbnail
        let fileName = thumbnail.name.split(".");
        fileName = `${fileName[0]}-${uuid()}.${fileName[fileName.length - 1]}`;

        // Upload thumbnail to the uploads directory
        const uploadPath = path.join(__dirname, "..", "uploads", fileName);

        // Using promise-based handling for `mv`
        await new Promise((resolve, reject) => {
            thumbnail.mv(uploadPath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Upload thumbnail to Cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
            resource_type: "image",
        });

        if (!result.secure_url) {
            return next(new HttpError("Failed to upload image to Cloudinary.", 422));
        }

        // Save election to database
        const newElection = await ElectionModel.create({
            title,
            description,
            thumbnail: result.secure_url,
        });

        // Send success response
        return res.status(201).json({ message: "Election created successfully.", newElection });
    } catch (error) {
        console.error("Error adding election:", error);
        return next(new HttpError("Unable to add election. Please try again later.", 500));
    }
};




//GET ALL ELECTIONS
//GET : api/elections
//PROTECTED

const getElections = async (req, res, next) => {
    try {
        const elections = await ElectionModel.find();
        res.status(200).json(elections);
    } catch (error) {
        return next(new HttpError(error))
    }
}

//GET SINGLE ELECTION
//GET : api/elections/:id
//PROTECTED

const getElection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const elections = await ElectionModel.findById(id);
        res.status(200).json(elections);
    } catch (error) {
        return next(new HttpError(error))
    }
}

//GET ELECTION CANDIDATES
//GET : api/elections/:id/candidates
//PROTECTED(only ADMIN)

const getCandidatesOfElection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const candidates = await candidateModel.find({ election: id })
        res.status(200).json(candidates)

    } catch (error) {
        return next(new HttpError(error))

    }
}

//GET VOTERS OF AN ELECTION
//GET : api/elections/:id/voters
//PROTECTED
const getElectionVoters = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await ElectionModel.findById(id).populate('voters')
        res.status(200).json(response.voters)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//update election
//PATCH : api/elections/:id
//PROTECTED FOR ADMINS ONLY
const updateElection = async (req, res, next) => {
    try {
        //only admin can add election
        if (!req.user.isAdmin) {
            return next(new HttpError("Only the admin can perform this action", 403))
        }

        const { id } = req.params;
        const { title, description } = req.body;

        // Validate input fields
        if (!title || !description) {
            return next(new HttpError("Please provide a title and description.", 422));
        }

        // Check if a thumbnail file is included
        let updatedFields = { title, description };
        if (req.files && req.files.thumbnail) {
            const { thumbnail } = req.files;

            // Check thumbnail size
            if (thumbnail.size > 1000000) {
                return next(new HttpError("Thumbnail size should be less than 1MB.", 422));
            }

            // Rename the thumbnail
            let fileName = thumbnail.name.split(".");
            fileName = `${fileName[0]}-${uuid()}.${fileName[fileName.length - 1]}`;

            // Define upload path
            const uploadPath = path.join(__dirname, "..", "uploads", fileName);

            // Move the thumbnail to the uploads directory
            await new Promise((resolve, reject) => {
                thumbnail.mv(uploadPath, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Upload thumbnail to Cloudinary
            const result = await cloudinary.uploader.upload(uploadPath, {
                resource_type: "image",
            });

            if (!result.secure_url) {
                return next(new HttpError("Failed to upload image to Cloudinary.", 422));
            }

            // Add the Cloudinary URL to the updated fields
            updatedFields.thumbnail = result.secure_url;

            // Remove the local thumbnail file
            //  fs.unlinkSync(uploadPath);
        }

        // Update the election in the database
        const updatedElection = await ElectionModel.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedElection) {
            return next(new HttpError("Election not found.", 404));
        }

        // Send success response
        return res.status(200).json({ message: "Election updated successfully.", updatedElection });
    } catch (error) {
        console.error("Error updating election:", error);
        return next(new HttpError("Unable to update election. Please try again later.", 500));
    }
};




//DELETE ELECTION
//DELETE : api/elections/:id
//PROTECTED FOR ADMINS ONLY
const removeElection = async (req, res, next) => {
    try {
        // Only admin can add election
        if (!req.user.isAdmin) {
            return next(new HttpError("Only the admin is authorised to perform this action", 403));
        }
        const { id } = req.params;
        await ElectionModel.findByIdAndDelete(id);

        //delete candidates that belong to this election
        await candidateModel.deleteMany({ electionId: id });
        res.status(200).json("Election deleted successfully.")

    } catch (error) {
        return next(new HttpError(error))

    }
}

module.exports = {
    addElection,
    getElections,
    getElection,
    getCandidatesOfElection,
    getElectionVoters,
    removeElection,
    updateElection
}