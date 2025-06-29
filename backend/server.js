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
  donatedItems: [{
    title: String,
    description: String,
    status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }]
});
const User = mongoose.model('User', userSchema);

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

// Create donated item (add to user's donatedItems array)
app.post('/api/donated-items', async (req, res) => {
  const { title, description, userId } = req.body;
  if (!title || !description || !userId) return res.status(400).json({ error: 'Missing fields' });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.donatedItems.push({ title, description });
    await user.save();
    
    res.status(201).json({ message: 'Donated item created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: list all donated items with user info
app.get('/api/admin/donated-items', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ 'donatedItems.0': { $exists: true } }, 'firstName lastName email donatedItems');
    
    const allItems = [];
    users.forEach(user => {
      user.donatedItems.forEach(item => {
        allItems.push({
          _id: item._id,
          title: item.title,
          description: item.description,
          status: item.status,
          createdAt: item.createdAt,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }
        });
      });
    });
    
    // Sort by creation date (newest first)
    allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allItems);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: approve donated item
app.put('/api/admin/donated-items/:itemId/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await User.updateOne(
      { 'donatedItems._id': req.params.itemId },
      { $set: { 'donatedItems.$.status': 'approved' } }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: deny donated item
app.put('/api/admin/donated-items/:itemId/deny', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await User.updateOne(
      { 'donatedItems._id': req.params.itemId },
      { $set: { 'donatedItems.$.status': 'denied' } }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User: get their own donated items
app.get('/api/my-donated-items', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, 'donatedItems');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Sort by creation date (newest first)
    const sortedItems = user.donatedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(sortedItems);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint
app.get('/', (req, res) => res.send('Knights Pantry Auth API running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 