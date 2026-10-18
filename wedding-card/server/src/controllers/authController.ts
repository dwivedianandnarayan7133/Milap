import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { getStorageMode, getLocalUsers, saveLocalUsers } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vivahpatra_dev_secret_key_12345';

export const handleGuestSession = async (req: Request, res: Response) => {
  try {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    res.json({
      success: true,
      user: {
        id: guestId,
        guestSessionId: guestId,
        name: 'Guest Designer',
        isGuest: true,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const { isConnected } = getStorageMode();
    const passwordHash = await bcrypt.hash(password, 10);

    if (isConnected) {
      const existing = await UserModel.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already registered' });

      const newUser = new UserModel({
        name,
        email,
        passwordHash,
        isGuest: false,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      return res.status(201).json({
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, isGuest: false },
      });
    } else {
      const users = getLocalUsers();
      if (users.find((u) => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const id = `user_${Date.now()}`;
      const user = { id, _id: id, name, email, passwordHash, isGuest: false };
      users.push(user);
      saveLocalUsers(users);

      const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        token,
        user: { id, name, email, isGuest: false },
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { isConnected } = getStorageMode();
    let user: any = null;

    if (isConnected) {
      user = await UserModel.findOne({ email });
    } else {
      user = getLocalUsers().find((u) => u.email === email);
    }

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id || user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        isGuest: false,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
