const { Schema, model, Types } = require('mongoose');

const candidateSchema = new Schema({
    fullName: { type: String, required: true },
    image: { type: String, required: true },
    voteCount: { type: Number, default: 0 },
    election: { type: Types.ObjectId, required: true, ref: "Election" },
    motto: { type: String, required: false } // Add motto field, making it optional
}, { timestamps: true });

module.exports = model("Candidate", candidateSchema);
