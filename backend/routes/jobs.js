const router = require("express").Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect, allowRoles } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { q = "", location = "", type = "" } = req.query;
    const filter = { isActive: true };
    if (q.trim())
      filter.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { company: { $regex: q.trim(), $options: "i" } },
        { category: { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
      ];
    if (location.trim())
      filter.location = { $regex: location.trim(), $options: "i" };
    if (type && type !== "All types") filter.type = type;
    const jobs = await Job.find(filter)
      .populate("employer", "name company")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Could not load jobs." });
  }
});

router.get("/mine", protect, allowRoles("employer"), async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ jobs });
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("employer", "name company");
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json({ job });
  } catch (err) {
    res.status(400).json({ message: "Invalid job ID." });
  }
});

router.post("/", protect, allowRoles("employer"), async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      category,
      salary,
      description,
      requirements,
    } = req.body;
    if (!title || !company || !location || !description)
      return res
        .status(400)
        .json({
          message: "Title, company, location, and description are required.",
        });
    const job = await Job.create({
      title,
      company,
      location,
      type,
      category,
      salary,
      description,
      requirements,
      employer: req.user._id,
    });
    res.status(201).json({ job });
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Could not create job. Check the fields and try again.",
      });
  }
});

router.put("/:id", protect, allowRoles("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (String(job.employer) !== String(req.user._id))
      return res
        .status(403)
        .json({ message: "You can only edit your own jobs." });
    const fields = [
      "title",
      "company",
      "location",
      "type",
      "category",
      "salary",
      "description",
      "requirements",
      "isActive",
    ];
    fields.forEach((key) => {
      if (req.body[key] !== undefined) job[key] = req.body[key];
    });
    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(400).json({ message: "Could not update job." });
  }
});

router.delete(
  "/:id",
  protect,
  allowRoles("employer", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found." });
      if (
        req.user.role !== "admin" &&
        String(job.employer) !== String(req.user._id)
      )
        return res
          .status(403)
          .json({ message: "You can only delete your own jobs." });
      await Application.deleteMany({ job: job._id });
      await job.deleteOne();
      res.json({ message: "Job deleted." });
    } catch (err) {
      res.status(400).json({ message: "Could not delete job." });
    }
  },
);

module.exports = router;
