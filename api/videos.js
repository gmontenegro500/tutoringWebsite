const express = require('express');
const router = express.Router();

let Video = require('../models/video');

router.post('/', (req, res) => {

    let name = req.body.name;
    let description = req.body.description;
    let url = req.body.url;
    let category = req.body.category;
    let questions = req.body.questions;
    let level = req.body.level;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('url', 'Url is required').notEmpty();
    req.checkBody('category', 'Category is required').notEmpty();
    req.checkBody('level', 'Level is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json(errors);
    } else {
        let newVideo = new Video({
            name: name,
            description: description,
            url: url,
            category: category,
            questions: questions,
            level: level
        });

        Video.createVideo(newVideo, (err, video) => {
            if (err) throw err;

            res.status(200).json(video);
        });
    }
});

router.get('/', (req, res) => {
    
    Video.getVideos((err, videos) => {

        if (err) throw err;

        res.status(200).json(videos);
    });
});

router.get('/:id', (req, res) => {

    Video.getVideo(req.params.id, (err, video) => {

        if (err) throw err;

        res.status(200).json(video);
    });
});

router.delete('/:id', (req, res) => {

    Video.deleteVideo(req.params.id, (err, video) => {

        if (err) throw err;

        res.status(200).json(video);
        
    });
});

module.exports = router;