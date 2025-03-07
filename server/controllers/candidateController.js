const { v4: uuid } = require("uuid");
const mongoose = require('mongoose')
const cloudinary = require('../utils/cloudinary')
const HttpError = require("../models/ErrorModel");
const ElectionModel = require('../models/electionModel')
const path = require("path");
const candidateModel = require("../models/candidateModel");
const voterModel = require("../models/voterModel");



//ADD CANDIDATE
//POST : api/candidates
//PROTECTED FOR ADMINS ONLY
const addCandidate = async (req, res, next) => {
    try {
        // Only admin can add candidates
        if (!req.user.isAdmin) {
            return next(new HttpError("Only the admin is authorised to perform this action", 403));
        }

        const { fullName, motto, currentElection } = req.body;

        // Validate inputs
        if (!fullName || !motto || !currentElection) {
            return next(new HttpError("Please fill in all fields", 422));
        }
        if (!req.files || !req.files.image) {
            return next(new HttpError("Please upload an image", 422));
        }

        const { image } = req.files;

        // Check image size
        if (image.size > 1000000) {
            return next(new HttpError("Image too large, it should be less than 1MB", 422));
        }

        // Rename the file
        let fileName = image.name.split(".");
        fileName = `${fileName[0]}-${uuid()}.${fileName[fileName.length - 1]}`;

        // Upload file to the `uploads` directory
        const uploadPath = path.join(__dirname, "..", "uploads", fileName);
        await new Promise((resolve, reject) => {
            image.mv(uploadPath, (err) => {
                if (err) reject(new HttpError("Failed to upload image locally", 500));
                else resolve();
            });
        });

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, { resource_type: "image" });

        if (!result.secure_url) {
            // Clean up local file if Cloudinary upload fails
            // fs.unlinkSync(uploadPath);
            return next(new HttpError("Failed to upload image to Cloudinary", 500));
        }

        // Clean up local file after successful upload
        //fs.unlinkSync(uploadPath);

        // Create the candidate
        const newCandidate = new candidateModel({
            fullName,
            motto,
            image: result.secure_url,
            election: currentElection,
        });

        // Get the election and update it with the candidate
        const election = await ElectionModel.findById(currentElection);
        if (!election) {
            return next(new HttpError("Election not found", 404));
        }

        // Use MongoDB transaction for atomic operation
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await newCandidate.save({ session: sess });
        election.candidates.push(newCandidate);
        await election.save({ session: sess });

        await sess.commitTransaction();

        res.status(201).json({ message: "Candidate added successfully", candidate: newCandidate });
    } catch (error) {
        console.error("Error adding candidate:", error);
        return next(new HttpError(error.message || "Failed to add candidate", 500));
    }
};

//GET CANDIDATE
//GET : api/candidates/:id
//PROTECTED 
const getCandidate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const candidate = await candidateModel.findById(id)
        res.json(candidate)

    } catch (error) {
        return next(new HttpError(error))

    }
}


const getCandidates = async (req, res, next) => {
    try {
        const { id } = req.params;
        const candidates = await candidateModel.find();
        res.status(200).json(candidates);
    } catch (error) {
        return next(new HttpError(error))
    }
}



//DELETE CANDIDATE
//DELETE : api/candidates/:id
//PROTECTED (ADMIN ONLY)
const removeCandidate = async (req, res, next) => {
    try {
        // Only admin can add candidates
        if (!req.user.isAdmin) {
            return next(new HttpError("Only the admin is authorised to perform this action", 403));
        }

        const { id } = req.params;
        let currentCandidate = await candidateModel.findById(id).populate('election')
        if (!currentCandidate) {
            return next(new HttpError("Couldn't delete candidate", 422));

        } else {
            const sess = await mongoose.startSession()
            sess.startTransaction()
            await currentCandidate.deleteOne({ session: sess })
            currentCandidate.election.candidates.pull(currentCandidate);
            await currentCandidate.election.save({ session: sess })
            await sess.commitTransaction()

            res.status(200).json("Candidate deleted successfully.")
        }

    } catch (error) {
        return next(new HttpError(error))

    }
}

//VOTE CANDIDATE
//PATCH : api/candidates/:id
//PROTECTED (ADMIN ONLY)
const voteCandidate = async (req, res, next) => {
    try {
        const { id: candidateId } = req.params;
        const { currentVoterId, selectedElection } = req.body;

        // Validate inputs
        if (!candidateId || !currentVoterId || !selectedElection) {
            return next(new HttpError("Missing required data.", 400));
        }

        // Get the candidate
        const candidate = await candidateModel.findById(candidateId);
        if (!candidate) {
            return next(new HttpError("Candidate not found.", 404));
        }

        // Increment vote count
        const newVoteCount = candidate.voteCount + 1;
        await candidateModel.findByIdAndUpdate(candidateId, { voteCount: newVoteCount }, { new: true });

        // Start session for transaction
        const sess = await mongoose.startSession();
        sess.startTransaction();

        // Get the current voter
        const voter = await voterModel.findById(req.user.id);
        if (!voter) {
            await sess.abortTransaction();
            sess.endSession();
            return next(new HttpError("Voter not found.", 404));
        }

        // Get the selected election
        const election = await ElectionModel.findById(selectedElection);
        if (!election) {
            await sess.abortTransaction();
            sess.endSession();
            return next(new HttpError("Election not found.", 404));
        }

        // Check if voter has already voted in this election
        if (voter.votedElections.includes(selectedElection)) {
            await sess.abortTransaction();
            sess.endSession();
            return next(new HttpError("You have already voted in this election.", 403));
        }

        // Update election and voter relationships
        election.voters.push(voter._id);
        voter.votedElections.push(election._id);

        await election.save({ session: sess });
        await voter.save({ session: sess });

        // Commit transaction
        await sess.commitTransaction();
        sess.endSession();

        res.status(200).json(voter.votedElections);
    } catch (error) {
        console.error("Error in voteCandidate:", error);
        return next(new HttpError("An error occurred while processing your vote.", 500));
    }
};




module.exports = {
    addCandidate,
    getCandidate,
    removeCandidate,
    getCandidates,
    voteCandidate
}