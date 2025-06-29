const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

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
    category: { 
      type: String, 
      enum: ['Food', 'Clothing', 'School Supplies', 'Toiletries', 'Other'],
      default: 'Other'
    },
    status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }]
});
const User = mongoose.model('User', userSchema);

// Function to add approved item to exampleProducts.json
async function addToExampleProducts(title, description, category) {
  try {
    console.log('Attempting to add item to exampleProducts.json:', { title, description, category });
    
    const filePath = path.join(__dirname, '../knights-pantry/assets/exampleProducts.json');
    console.log('File path:', filePath);
    
    // Check if file exists
    try {
      await fs.access(filePath);
      console.log('File exists and is accessible');
    } catch (error) {
      console.error('File does not exist or is not accessible:', error);
      return;
    }
    
    const fileContent = await fs.readFile(filePath, 'utf8');
    console.log('File content length:', fileContent.length);
    
    const products = JSON.parse(fileContent);
    console.log('Current products count:', products.length);
    
    // Add the new approved item
    const newItem = {
      title: title,
      category: category,
      description: description
    };
    
    products.push(newItem);
    console.log('Added new item, total products now:', products.length);
    
    // Write back to file
    const updatedContent = JSON.stringify(products, null, 2);
    await fs.writeFile(filePath, updatedContent);
    console.log(`Successfully added approved item "${title}" to exampleProducts.json`);
  } catch (error) {
    console.error('Error updating exampleProducts.json:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
  }
}

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
  const { title, description, category, userId } = req.body;
  if (!title || !userId) return res.status(400).json({ error: 'Title and userId required' });
  
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Use description if provided, otherwise use a default
    const itemDescription = description || 'No description provided';
    
    // Validate category or use default
    const validCategories = ['Food', 'Clothing', 'School Supplies', 'Toiletries', 'Other'];
    const itemCategory = validCategories.includes(category) ? category : 'Other';
    
    user.donatedItems.push({ 
      title, 
      description: itemDescription,
      category: itemCategory
    });
    await user.save();
    
    res.status(201).json({ message: 'Donated item created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: list all donated items with user info
app.get('/api/admin/donated-items', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ 'donatedItems.0': { $exists: true } }, 'firstName lastName email ucfId donatedItems');
    
    const allItems = [];
    users.forEach(user => {
      user.donatedItems.forEach(item => {
        allItems.push({
          _id: item._id,
          title: item.title,
          description: item.description,
          category: item.category,
          status: item.status,
          createdAt: item.createdAt,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            ucfId: user.ucfId
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
    console.log('Approval request received for item ID:', req.params.itemId);
    
    // First, find the item to get its details
    const user = await User.findOne({ 'donatedItems._id': req.params.itemId });
    if (!user) {
      console.log('User not found for item ID:', req.params.itemId);
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = user.donatedItems.id(req.params.itemId);
    if (!item) {
      console.log('Item not found in user donations:', req.params.itemId);
      return res.status(404).json({ error: 'Item not found' });
    }
    
    console.log('Found item to approve:', {
      title: item.title,
      description: item.description,
      category: item.category
    });
    
    // Update the item status
    const result = await User.updateOne(
      { 'donatedItems._id': req.params.itemId },
      { $set: { 'donatedItems.$.status': 'approved' } }
    );
    
    if (result.modifiedCount === 0) {
      console.log('Failed to update item status');
      return res.status(404).json({ error: 'Item not found' });
    }
    
    console.log('Item status updated successfully, now adding to exampleProducts.json');
    
    // Add to exampleProducts.json
    await addToExampleProducts(item.title, item.description, item.category);
    
    console.log('Approval process completed successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('Error in approval process:', err);
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