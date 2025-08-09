'use server';

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function authenticateUser(email: string, password: string) {
  const mockDB = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@demo.com',
      role: 'admin',
      password: '123456'
    },
    {
      id: '2',
      name: 'Manager User',
      email: 'manager@demo.com',
      role: 'manager',
      password: '123456'
    },
    {
      id: '3',
      name: 'Support User',
      email: 'support@demo.com',
      role: 'support',
      password: '123456'
    },
    {
      id: '4',
      name: 'Regular User',
      email: 'user@demo.com',
      role: 'user',
      password: '123456'
    }
  ];

  const user = mockDB.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: accessToken,
    refreshToken
  };
}
