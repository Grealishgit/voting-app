const { Schema, model, Types } = require('mongoose');

const electionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    candidates: [{ type: Types.ObjectId, ref: "Candidate" }], // Removed required constraint
    voters: [{ type: Types.ObjectId, ref: "Voter" }], // Removed required constraint
}, { timestamps: true });

module.exports = model("Election", electionSchema); // Corrected model name
