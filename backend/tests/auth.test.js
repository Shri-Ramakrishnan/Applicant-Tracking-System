const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Applicant = require('../models/Applicant');

const MONGO_TEST_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/ats_test';

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI);
});

afterEach(async () => {
  await User.deleteMany({});
  await Recruiter.deleteMany({});
  await Applicant.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

describe('Auth Routes', () => {
  it('should register a recruiter', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Recruiter',
      email: 'rec@test.com',
      password: 'pass1234',
      role: 'recruiter',
      organization: 'TestCorp'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.role).toBe('recruiter');
  });

  it('should register an applicant', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Applicant',
      email: 'app@test.com',
      password: 'pass1234',
      role: 'applicant',
      skills: 'React,Node.js',
      experience: 2
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.role).toBe('applicant');
  });

  it('should not register duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'User',
      email: 'dup@test.com',
      password: 'pass1234',
      role: 'applicant'
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'User2',
      email: 'dup@test.com',
      password: 'pass1234',
      role: 'applicant'
    });
    expect(res.statusCode).toBe(400);
  });

  it('should login with valid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@test.com',
      password: 'pass1234',
      role: 'applicant'
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'pass1234'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'wrong@test.com',
      password: 'wrongpass'
    });
    expect(res.statusCode).toBe(401);
  });
});
