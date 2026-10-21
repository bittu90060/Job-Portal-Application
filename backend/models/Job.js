const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time",
    },
    category: { type: String, trim: true, default: "General" },
    salary: { type: String, trim: true, default: "Not disclosed" },
    description: { type: String, required: true, maxlength: 12000 },
    requirements: { type: String, default: "", maxlength: 8000 },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

jobSchema.index({
  title: "text",
  company: "text",
  description: "text",
  category: "text",
});
module.exports = mongoose.model("Job", jobSchema);
