const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user data - in a real app, this would come from a database
const mockUsers = [
  { id: 1, email: 'test@example.com', password: 'password123', name: 'Test User' }
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Find user
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  // Create token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '1h' }
  );
  
  // Return user data (without password) and token
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    token,
    user: userWithoutPassword
  });
});

// POST /api/auth/register (basic implementation)
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Basic validation
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }
  
  // Check if user already exists
  const userExists = mockUsers.some(u => u.email === email);
  
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user (in a real app, you'd hash the password and save to DB)
  const newUser = {
    id: mockUsers.length + 1,
    email,
    password, // In real app, hash this!
    name
  };
  
  mockUsers.push(newUser);
  
  // Create token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '1h' }
  );
  
  // Return user data (without password) and token
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    token,
    user: userWithoutPassword
  });
});

module.exports = router;