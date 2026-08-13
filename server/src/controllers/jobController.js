import mongoose from "mongoose";
import JobApplication from "../models/JobApplication.js";

export const createJob = async (req, res) => {
  try {
    const job = await JobApplication.create({
      ...req.body,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      sortBy = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      createdBy: req.user.userId,
    };

    if (search) {
      query.$or = [
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
        {
          role: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (priority && priority !== "All") {
      query.priority = priority;
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === "company-asc") {
      sortOptions = { company: 1 };
    } else if (sortBy === "company-desc") {
      sortOptions = { company: -1 };
    }

    const jobs = await JobApplication.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalJobs = await JobApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / limit),
      data: jobs,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobApplication.findOne({
      _id: id,
      createdBy: req.user.userId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const updatedJob = await JobApplication.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobApplication.findOne({
      _id: id,
      createdBy: req.user.userId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await JobApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getJobStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await JobApplication.aggregate([
      {
        $match: { createdBy: userId },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Assessment: 0,
      "HR Round": 0,
      Offer: 0,
      Rejected: 0,
    };

    let totalJobs = 0;
    stats.forEach((item) => {
      formattedStats[item._id] = item.count;
      totalJobs += item.count;
    });

    const monthlyStats = await JobApplication.aggregate([
      {
        $match: { createdBy: userId },
      },
      {
        $group: {
          _id: {
            year: { $year: "$appliedDate" },
            month: { $month: "$appliedDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 },
      },
      {
        $limit: 6,
      },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyApplications = monthlyStats
      .map((item) => {
        const monthName = monthNames[item._id.month - 1] || "Jan";
        return {
          month: `${monthName} ${item._id.year}`,
          count: item.count,
        };
      })
      .reverse();

    res.status(200).json({
      success: true,
      totalJobs,
      stats: formattedStats,
      monthlyApplications,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};