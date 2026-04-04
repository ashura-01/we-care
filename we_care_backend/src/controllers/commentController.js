const { default: mongoose } = require("mongoose");
const commentModel = require("../models/commentModel");

// Create Comment
exports.createComment = async (req, res) => {
    try {
        let { blogId, name, email, comment } = req.body;

        let data = await commentModel.create({
            blogId: new mongoose.Types.ObjectId(blogId),
            name,
            email,
            comment
        });

        res.status(200).json({
            success: true,
            message: "Comment added successfully",
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Comment creation failed",
        });
    }
};

// Get All Comments (debug)
exports.getAllComments = async (req, res) => {
    try {
        let data = await commentModel.find();

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Fetching comments failed",
        });
    }
};

// Get Single Comment
exports.getSingleComment = async (req, res) => {
    try {
        let { id } = req.params;

        let data = await commentModel.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Comment fetched successfully",
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Fetching single comment failed",
        });
    }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
    try {
        let { id } = req.params;

        let data = await commentModel.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Deleting comment failed",
        });
    }
};