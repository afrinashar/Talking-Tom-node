/* eslint-disable no-undef */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/process-audio', upload.single('audio'), (req, res) => {
  const { voiceOption } = req.body;
  const inputPath = req.file.path;
  const outputPath = `processed/${uuidv4()}.wav`;

  let ffmpegCommand = ffmpeg(inputPath).output(outputPath);

  switch (voiceOption) {
    case 'girlBaby':
      ffmpegCommand = ffmpegCommand.audioFilters('asetrate=44100*1.5,aresample=44100,atempo=1.25');
      break;
    case 'boyBaby1':
      ffmpegCommand = ffmpegCommand.audioFilters('asetrate=44100*0.75,aresample=44100,atempo=1.25');
      break;
    case 'boyBaby2':
      ffmpegCommand = ffmpegCommand.audioFilters('asetrate=44100*0.15,aresample=44100,atempo=1.15');
      break;
    case 'boyBaby3':
      ffmpegCommand = ffmpegCommand.audioFilters('asetrate=44100*0.29,aresample=44100,atempo=1.1');
      break;
  }

  ffmpegCommand.on('end', () => {
    fs.unlinkSync(inputPath);
    res.json({ audioUrl: `/${outputPath}` });
  }).run();
});

module.exports = router;
