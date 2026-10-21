const router = require("express").Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const { protect, allowRoles } = require("../middleware/auth");

router.post("/:jobId", protect, allowRoles("seeker"), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, isActive: true });
    if (!job)
      return res
        .status(404)
        .json({ message: "This job is no longer available." });
    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter || "",
      resumeUrl: req.body.resumeUrl || "",
    });
    res
      .status(201)
      .json({ application, message: "Application submitted successfully." });
  } catch (err) {
    if (err.code === 11000)
      return res
        .status(409)
        .json({ message: "You have already applied for this job." });
    res.status(400).json({ message: "Could not submit application." });
  }
});

router.get("/my", protect, allowRoles("seeker"), async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate("job")
    .sort({ createdAt: -1 });
  res.json({ applications });
});

router.get("/employer", protect, allowRoles("employer"), async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).select(
    "_id title company",
  );
  const applications = await Application.find({
    job: { $in: jobs.map((j) => j._id) },
  })
    .populate("job", "title company")
    .populate("applicant", "name email")
    .sort({ createdAt: -1 });
  res.json({ applications });
});

router.put("/:id/status", protect, allowRoles("employer"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Under Review", "Shortlisted", "Rejected", "Hired"].includes(status))
      return res.status(400).json({ message: "Invalid status." });
    const application = await Application.findById(req.params.id).populate(
      "job",
    );
    if (!application)
      return res.status(404).json({ message: "Application not found." });
    if (String(application.job.employer) !== String(req.user._id))
      return res.status(403).json({ message: "Not your applicant." });
    application.status = status;
    await application.save();
    res.json({ application, message: "Application status updated." });
  } catch (err) {
    res.status(400).json({ message: "Could not update application status." });
  }
});

module.exports = router;
