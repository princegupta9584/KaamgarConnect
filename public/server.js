const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kaamgarDB';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Error:', err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: { type: String, unique: true },
    aadhaar: { type: String, unique: true },
    password: { type: String, required: true },
    address: String,
    role: String,
    rating: { type: Number, default: 5 },
    totalRatings: { type: Number, default: 0 },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    }
});
userSchema.index({ location: '2dsphere' });
const User = mongoose.model('User', userSchema);

const jobSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: String,
    customerMobile: String, 
    title: String,
    description: String,
    category: String,
    budget: String,
    location: String,
    status: { type: String, default: 'active' }, 
    createdAt: { type: Date, default: Date.now }
});
const Job = mongoose.model('Job', jobSchema);

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

app.get('/api/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const completedJobs = await Job.countDocuments({ status: 'completed' });
        res.json({ totalUsers, activeJobs, completedJobs });
    } catch (error) {
        res.status(500).json({ error: "Stats fetch error" });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            aadhaar: req.body.aadhaar,
            password: req.body.password,
            address: req.body.address,
            role: req.body.role.toLowerCase(),
            location: {
                type: 'Point',
                coordinates: [parseFloat(req.body.lng) || 0, parseFloat(req.body.lat) || 0]
            }
        });
        await newUser.save();
        res.status(201).json({ message: "Registration Successful!" });
    } catch (error) {
        res.status(400).json({ error: "Mobile or Aadhaar already exists!" });
    }
});

app.post('/api/login', async (req, res) => {
    const { loginId, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ mobile: loginId }, { aadhaar: loginId }],
            password: password
        });
        if (user) {
            res.json({ message: "Login Successful", user });
        } else {
            res.status(401).json({ error: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const newMessage = new Contact(req.body);
        await newMessage.save();
        res.status(201).json({ message: "Message sent to database!" });
    } catch (error) {
        res.status(500).json({ error: "Message failed" });
    }
});

app.post('/api/post-job', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json({ message: "Job Posted Successfully!" });
    } catch (error) {
        res.status(400).json({ error: "Job post error" });
    }
});

app.get('/api/all-jobs', async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching jobs" });
    }
});

app.post('/api/rate-worker', async (req, res) => {
    const { workerId, rating, jobId } = req.body;
    try {
        const worker = await User.findById(workerId);
        if (!worker) return res.status(404).json({ error: "Worker not found" });

        const newTotal = (worker.totalRatings || 0) + 1;
        const currentRating = worker.rating || 5;
        const updatedRating = ((currentRating * (worker.totalRatings || 0)) + rating) / newTotal;

        await User.findByIdAndUpdate(workerId, { 
            rating: updatedRating, 
            totalRatings: newTotal 
        });

        await Job.findByIdAndUpdate(jobId, { status: 'completed' });

        res.json({ message: "Job completed and rating updated!" });
    } catch (error) {
        res.status(500).json({ error: "Rating update error" });
    }
});

app.delete('/api/delete-job/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Job delete error" });
    }
});

app.get('/api/workers-near-me', async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' });
        res.json(workers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching workers" });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 KaamgarConnect Server live on port ${PORT}`);
});
