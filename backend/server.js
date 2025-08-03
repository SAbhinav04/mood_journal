import express from 'express';
import mongoose from 'mongoose';
import Sentiment from 'sentiment';
import cors from 'cors';

const app = express();
const PORT = 3000;
const sentiment = new Sentiment();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('../frontend'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moodjournal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose schema and model
const entrySchema = new mongoose.Schema({
    text: String,
    mood: String,
    timestamp: { type: Date, default: Date.now }
});
const Entry = mongoose.model('Entry', entrySchema);

// POST /entry - Add a new journal entry
app.post('/entry', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    // Analyze mood
    const result = sentiment.analyze(text);
    let mood = 'neutral';
    if (result.score > 1) mood = 'positive';
    else if (result.score < -1) mood = 'negative';
    // Save entry
    const entry = new Entry({ text, mood });
    await entry.save();
    res.status(201).json({ message: 'Entry saved', entry });
});

// GET /entries - Get all journal entries
app.get('/entries', async (req, res) => {
    const entries = await Entry.find().sort({ timestamp: 1 });
    res.json(entries);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
