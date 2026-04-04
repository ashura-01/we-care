const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema(
    {
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },

    },
    {
        versionKey: false,
        timestamps: true
    },
)
const commentModel = mongoose.model('comment', DataSchema);
module.exports = commentModel;