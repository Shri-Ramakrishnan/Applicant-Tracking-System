const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Recruiter.deleteMany({});
    await Applicant.deleteMany({});
    await Job.deleteMany({});

    // Create recruiter user
    const recruiterUser = await User.create({
      name: 'Alice Johnson',
      email: 'recruiter@ats.com',
      password: 'password123',
      role: 'recruiter'
    });

    const recruiter = await Recruiter.create({
      user: recruiterUser._id,
      organization: 'TechCorp Inc.'
    });

    // Create applicant user
    const applicantUser = await User.create({
      name: 'Bob Smith',
      email: 'applicant@ats.com',
      password: 'password123',
      role: 'applicant'
    });

    await Applicant.create({
      user: applicantUser._id,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      experience: 3
    });

    // Create sample jobs
    await Job.create([
      {
        recruiter: recruiter._id,
        title: 'Full Stack Developer',
        description: 'We are looking for an experienced full stack developer to join our team.',
        requirements: 'JavaScript React Node.js MongoDB Express REST API Git',
        location: 'New York, NY',
        status: 'active'
      },
      {
        recruiter: recruiter._id,
        title: 'Frontend Developer',
        description: 'Join our frontend team to build amazing user interfaces.',
        requirements: 'React JavaScript TypeScript CSS HTML Tailwind UI/UX',
        location: 'Remote',
        status: 'active'
      },
      {
        recruiter: recruiter._id,
        title: 'Backend Engineer',
        description: 'Build and maintain our backend services and APIs.',
        requirements: 'Node.js Express MongoDB PostgreSQL REST API Docker AWS',
        location: 'San Francisco, CA',
        status: 'active'
      }
    ]);

    console.log('Seed data created successfully!');
    console.log('Recruiter: recruiter@ats.com / password123');
    console.log('Applicant: applicant@ats.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
