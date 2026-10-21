const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: { type: String, default: "", maxlength: 5000 },
    resumeUrl: { type: String, default: "", maxlength: 1000 },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Shortlisted", "Rejected", "Hired"],
      default: "Submitted",
    },
  },
  { timestamps: true },
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
module.exports = mongoose.model("Application", applicationSchema);
