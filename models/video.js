const mongoose = require('mongoose');

let VideoSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    description: {
        type: String
    },
    url: {
        type: String
    },
    category: {
        type: String
    },
    questions: {
        type: Array
    },
    level: {
        type: Number
    }
});

let Video = mongoose.model('videos', VideoSchema);

Video.createVideo = (newVideo, cb) => {
    newVideo.save(cb);
};

Video.getVideos = (cb) => {
    Video.find(cb);
};

Video.getVideo = (id, cb) => {
    Video.findById(id, cb);
};

Video.deleteVideo = (id, cb) => {
    Video.findByIdAndRemove(id, cb);
}

module.exports = Video;