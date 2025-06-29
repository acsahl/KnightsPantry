const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const MONGO_URI = 'mongodb+srv://lukoseacsah:Designer1@cluster0.xrp25pf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  ucfId: String,
  isAdmin: { type: Boolean, default: false },
});
const User = mongoose.model('User', userSchema);

// Donated Item Schema
const donatedItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approved: { type: Boolean, default: false },
  denied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const DonatedItem = mongoose.model('DonatedItem', donatedItemSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { email, password, firstName, lastName, ucfId } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, firstName, lastName, ucfId });
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user object and token similar to login
    res.status(201).json({ 
      message: 'User created',
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        ucfId: user.ucfId,
        isAdmin: user.isAdmin,
        _id: user._id,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        ucfId: user.ucfId,
        isAdmin: user.isAdmin,
        _id: user._id,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Middleware to check admin (uses JWT token)
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  
  User.findById(req.user.userId).then(user => {
    if (user && user.isAdmin) return next();
    res.status(403).json({ error: 'Admin access required' });
  }).catch(() => res.status(500).json({ error: 'Server error' }));
}

// Create donated item (user must be logged in, pass userId)
app.post('/api/donated-items', async (req, res) => {
  const { title, description, userId } = req.body;
  if (!title || !description || !userId) return res.status(400).json({ error: 'Missing fields' });
  try {
    const item = new DonatedItem({ title, description, user: userId });
    await item.save();
    res.status(201).json({ message: 'Donated item created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: list all donated items with user info
app.get('/api/admin/donated-items', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const items = await DonatedItem.find().populate('user', 'firstName lastName email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: approve donated item
app.put('/api/admin/donated-items/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await DonatedItem.findByIdAndUpdate(req.params.id, { approved: true, denied: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: deny donated item
app.put('/api/admin/donated-items/:id/deny', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await DonatedItem.findByIdAndUpdate(req.params.id, { approved: false, denied: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint
app.get('/', (req, res) => res.send('Knights Pantry Auth API running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 