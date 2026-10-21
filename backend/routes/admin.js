const router = require("express").Router();
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect, allowRoles } = require("../middleware/auth");

router.use(protect, allowRoles("admin"));

router.get("/dashboard", async (req, res) => {
  const [users, employers, seekers, jobs, applications] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "employer" }),
    User.countDocuments({ role: "seeker" }),
    Job.countDocuments(),
    Application.countDocuments(),
  ]);
  res.json({ stats: { users, employers, seekers, jobs, applications } });
});

router.get("/users", async (req, res) => {
  const users = await User.find()
    .select("name email role company createdAt")
    .sort({ createdAt: -1 })
    .limit(500);
  res.json({ users });
});

router.get("/jobs", async (req, res) => {
  const jobs = await Job.find()
    .populate("employer", "name email")
    .sort({ createdAt: -1 })
    .limit(500);
  res.json({ jobs });
});

router.delete("/users/:id", async (req, res) => {
  if (String(req.params.id) === String(req.user._id))
    return res
      .status(400)
      .json({ message: "You cannot delete your own admin account." });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  if (user.role === "admin")
    return res
      .status(403)
      .json({ message: "Deleting another admin is disabled." });
  const jobs = await Job.find({ employer: user._id }).select("_id");
  await Application.deleteMany({
    $or: [{ applicant: user._id }, { job: { $in: jobs.map((j) => j._id) } }],
  });
  await Job.deleteMany({ employer: user._id });
  await User.deleteOne({ _id: user._id });
  res.json({ message: "User and related records deleted." });
});

module.exports = router;
