// backend/models/Idea.js
const mongoose = require('mongoose');

const positionSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, default: 'Paid' }, // Paid, Equity, etc.
    skills: [String],
    salaryRange: String,
    equityOffered: String,
    questions: [String], // Custom questions for applicants
    isOpen: { type: Boolean, default: true },
});

const ideaSchema = mongoose.Schema({
    // --- Basic Info ---
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    problem: { type: String, required: true },
    buildingNow: { type: String, required: true }, // The Solution
    founderQuote: { type: String, required: true },
    
    // --- Founder Info ---
    founderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    founderName: { type: String }, // Optional, can be fetched from User
    founderEmail: { type: String }, 

    // --- Meta Info ---
    tags: [String],
    category: { type: String, required: true },
    businessModel: { type: String, required: true },
    workMode: { type: String, required: true },
    location: { type: String, required: true },
    websiteUrl: { type: String },
    
    // --- Visuals ---
    imageUrl: { type: String, required: true }, // Photo URL

    // --- Positions (Nested Array) ---
    positions: [positionSchema],

    // --- Extras ---
    postedDate: { type: Date, default: Date.now },
}, {
    timestamps: true, // CreatedAt automatically aa jayega
});

const Idea = mongoose.model('Idea', ideaSchema);
module.exports = Idea;