import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//signup logic
// 1. Defines and exports an asynchronous function named 'signup'.
export const signup = async (req, res) => {
  // 2. Extracts name, email, and password from the incoming request's body.
  const { name, email, password } = req.body;
  // 3. Starts a 'try' block to handle potential errors gracefully.
  try {
    // 4. Searches the database for a user with the provided email. It waits for this operation to complete.
    const existingUser = await User.findOne({ where: { email } });
    // 5. Checks if a user with that email was found.
    if (existingUser) {
      // 6. If the user exists, it stops and sends a 400 (Bad Request) error response.
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // 7. A comment explaining that password hashing is handled automatically before creating the user.
    // The password will be hashed by the model's beforeCreate hook
    
    // 8. Creates a new user record in the database with the provided details and waits for it to complete.
    const user = await User.create({ name, email, password });

    // 9. Creates a 'payload' object containing the new user's ID to be encoded in the token.
    const payload = { user: { id: user.id } };
    
    // 10. Generates a JSON Web Token (JWT).
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      // 11. Checks for an error during token creation. If there is one, it's thrown to the 'catch' block.
      if (err) throw err;
      // 12. If successful, it sends a 201 (Created) response with the new token.
      res.status(201).json({ token });
    });
  // 13. This 'catch' block will execute if any error occurred inside the 'try' block.
  } catch (err) {
    // 14. Logs the detailed error message to the server console for debugging.
    console.error(err.message);
    // 15. Sends a generic 500 (Server Error) response to the client.
    res.status(500).send('Server Error');
  }
};

//login logic
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and return JWT token
    const payload = { user: { id: user.id } };
    
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};