/* eslint-disable no-undef */
const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
 const mongoose = require('mongoose');

const dotenv = require("dotenv");
 const pathToFfmpeg = require('ffmpeg-static');

ffmpeg.setFfmpegPath(pathToFfmpeg);

dotenv.config();
mongoose.connect('mongodb+srv://afrin:961215106001@cluster0.hbkqtqv.mongodb.net/talking-tom', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(
    cors()
  );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

dotenv.config();


const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/api/process-audio', upload.single('audio'), (req, res) => {
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
        ffmpegCommand = ffmpegCommand.audioFilters('asetrate=44100*0.85,aresample=44100,atempo=1.15');
        break;
      case 'boyBaby3':
        ffmpegCommand = ffmpegCommand.audioFilters('asetrate=44100*0.9,aresample=44100,atempo=1.1');
        break;
    }
  
    ffmpegCommand.on('end', () => {
      console.log(`Audio processed and saved to ${outputPath}`);
      fs.unlinkSync(inputPath);
      res.json({ audioUrl: `/${outputPath}` });
    }).run();
  });
  app.use('/processed', express.static(path.join(__dirname, 'processed')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
