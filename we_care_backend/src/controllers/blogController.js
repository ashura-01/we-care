const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const doctorModel = require("../models/doctorModel");
const commentModel = require("../models/commentModel"); 

// ----------------- CREATE BLOG -----------------
exports.createBlog = async (req, res) => {
  try {

    const isDoctor = await doctorModel.findOne({ userId: req.user._id });
    if (!isDoctor) {
      return res.status(403).json({ success: false, message: "Access denied. Only doctors can post blogs." });
    }

    let { title, category, image, description, shortDescription } = req.body;


    let data = await blogModel.create({
      title,
      category,
      image,
      description,
      shortDescription,
      authorId: req.user._id,
    });

    res.status(200).json({ success: true, message: "Blog created successfully", data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString(), message: "Failed to create blog" });
  }
};

// ----------------- GET ALL BLOGS -----------------
exports.getAllBlogs = async (req, res) => {
  try {
    let pageNo = Number(req.query.pageNo) || 1;
    let perpage = Number(req.query.perpage) || 10;
    let skipRow = (pageNo - 1) * perpage;

    let facetStage = {
      $facet: {
        totalCount: [{ $count: "count" }],
        blogs: [
          { $sort: { createdAt: -1 } },
          { $skip: skipRow },
          { $limit: perpage },

          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },
          { $unwind: "$author" },
          {
            $project: {
              title: 1, image: 1, category: 1, shortDescription: 1, createdAt: 1,
              "author.name": 1,
            },
          },
        ],
      },
    };

    let blogs = await blogModel.aggregate([facetStage]);

    res.status(200).json({ success: true, message: "Blogs fetched successfully", data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString(), message: "Failed to fetch blogs" });
  }
};

// ----------------- GET SINGLE BLOG -----------------
exports.getSingleBlog = async (req, res) => {
  try {
    let { id } = req.params;

    let blog = await blogModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author" },
      {
        $project: {
          title: 1,
          category: 1,
          image: 1,
          description: 1,
          shortDescription: 1,
          createdAt: 1,
          "author.name": 1
        }
      }
    ]);

    if (!blog || blog.length === 0) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    let comments = await commentModel.aggregate([
      { $match: { blogId: new mongoose.Types.ObjectId(id) } },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          comment: 1,
          name: 1,        
          email: 1,       
          createdAt: 1,
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: {
        blog: blog[0],
        comments: comments  
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Failed to fetch single blog",
    });
  }
};

// ----------------- UPDATE BLOG -----------------
exports.updateBlog = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, category, image, description, shortDescription } = req.body;


    const blog = await blogModel.findOne({ _id: id, authorId: req.user._id });
    if (!blog) {
      return res.status(403).json({ success: false, message: "You can only edit your own blogs." });
    }

    let data = await blogModel.findByIdAndUpdate(
      id,
      { title, category, image, description, shortDescription },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Blog updated successfully", data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString(), message: "Failed to update blog" });
  }
};

// ----------------- DELETE BLOG -----------------
exports.deleteBlog = async (req, res) => {
  try {
    let { id } = req.params;


    const blog = await blogModel.findOne({ _id: id, authorId: req.user._id });
    if (!blog) {
      return res.status(403).json({ success: false, message: "You can only delete your own blogs." });
    }

    let data = await blogModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Blog deleted successfully", data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString(), message: "Failed to delete blog" });
  }
};

// ------------ GET BLOGS BY SPECIFIC DOCTOR -------------

exports.getBlogsByDoctor = async (req, res) => {
  try {
    let { doctorId } = req.params;
    let pageNo = Number(req.query.pageNo) || 1;
    let perpage = Number(req.query.perpage) || 10;
    let skipRow = (pageNo - 1) * perpage;

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    let matchStage = { $match: { authorId: new mongoose.Types.ObjectId(doctor.userId) } };

    let facetStage = {
      $facet: {
        totalCount: [{ $count: "count" }],
        blogs: [
          { $sort: { createdAt: -1 } },
          { $skip: skipRow },
          { $limit: perpage },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },
          { $unwind: "$author" },
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "blogId",
              as: "comments",
            },
          },
          {
            $addFields: {
              commentCount: { $size: "$comments" }
            }
          },
          {
            $project: {
              title: 1,
              image: 1,
              category: 1,
              shortDescription: 1,
              createdAt: 1,
              commentCount: 1,  // ← ADD THIS
              "author.name": 1,
            },
          },
        ],
      },
    };

    let blogs = await blogModel.aggregate([matchStage, facetStage]);

    res.status(200).json({
      success: true,
      message: "Doctor's blogs fetched successfully",
      data: blogs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Failed to fetch doctor's blogs"
    });
  }
};