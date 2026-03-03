import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import Space from './models/Space.js';
import Vote from './models/Vote.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected.');

    // 1. Clear existing data
    console.log('Wiping existing collections...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Space.deleteMany({});
    await Vote.deleteMany({});

    // 2. Seed Users
    console.log('Seeding Users...');
    const users = await User.insertMany([
      {
        username: 'tiamlee',
        email: 'tiamlee@dlsu.edu.ph',
        name: 'Thomas James C. Tiam-Lee',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tiamlee',
        bio: 'CS Student • Loves cats',
        location: 'Manila, PH'
      },
      {
        username: 'iloveapex',
        email: 'iloveapex@dlsu.edu.ph',
        name: 'Teehee',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iloveapex',
        bio: 'Frontend dev in training',
        location: 'QC, PH'
      },
      {
        username: 'pieisspy',
        email: 'pieisspy@dlsu.edu.ph',
        name: 'Sussus Amogus',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pieisspy',
        bio: 'Just vibing',
        location: 'Cavite, PH'
      },
      {
        username: 'callo',
        email: 'callo@dlsu.edu.ph',
        name: 'Floranaras',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=callo',
        bio: 'Commuter & gamer',
        location: 'Las Piñas, PH'
      },
      {
        username: 'taroramen',
        email: 'enzo.zinger@dlsu.edu.ph',
        name: 'Enzo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taroramen',
        bio: 'Zigger Enjoyer',
        location: 'Makati, PH'
      }
    ]);

    // 3. Seed Spaces
    console.log('Seeding Spaces...');
    const spaces = await Space.insertMany([
      {
        name: 'ccs-gov',
        displayName: 'CCS Student Gov',
        description: 'Official updates and support from the CCS Student Government.',
        category: 'Official',
        ownerId: users[0]._id,
        members: [users[0]._id, users[1]._id],
        rules: [{ title: 'Be Respectful', description: 'No hate speech.' }]
      },
      {
        name: 'freedom-wall',
        displayName: 'DLSU Freedom Wall',
        description: 'Express yourself anonymously. The pulse of the community.',
        category: 'Lifestyle',
        ownerId: users[1]._id,
        members: [users[1]._id, users[2]._id, users[3]._id],
        rules: [{ title: 'Anonymity', description: 'Do not dox other students.' }]
      },
      {
        name: 'the-lasallian',
        displayName: 'TheLasallian',
        description: 'The official student publication of DLSU.',
        category: 'Official',
        ownerId: users[3]._id,
        members: [users[3]._id, users[4]._id]
      },
      {
        name: 'pts',
        displayName: 'Paul Tan Society',
        description: 'Academic help and support for struggling students.',
        category: 'Academic',
        ownerId: users[0]._id,
        members: [users[0]._id, users[2]._id]
      },
      {
        name: 'rinaldoeats',
        displayName: 'RinaldoEats',
        description: 'Rinaldo\'s official food recommendations.',
        category: 'Lifestyle',
        ownerId: users[2]._id,
        members: [users[2]._id, users[4]._id]
      }
    ]);

    // 4. Seed Posts
    console.log('Seeding Posts...');
    const posts = await Post.insertMany([
      {
        title: 'ANNOUNCEMENT URGENT !!!',
        content: 'tama na pag breed ng mga kabayo oi',
        author: users[0]._id,
        space: 'ccs-gov',
        upvotes: 67,
        tags: ['CSINSTY', 'IMPORTANT']
      },
      {
        title: 'CAT GOT YOUR... MAIL??!!',
        content: 'As the day of hearts inches closer, a special delivery has been made just fur you~ 🌟💞',
        author: users[3]._id,
        space: 'freedom-wall',
        upvotes: 39,
        tags: ['catlovers']
      },
      {
        title: 'BREAKING NEWS: Local Shark terrorizes booths',
        content: 'In an unprecedented attack on romance, a land shark has emerged.',
        author: users[3]._id,
        space: 'the-lasallian',
        upvotes: 240,
        downvotes: 67,
        tags: ['SharkWeek']
      },
      {
        title: 'ST-MATH GOT HANDS',
        content: 'pleaase doc g my integrals is kinda homeless.',
        author: users[2]._id,
        space: 'pts',
        upvotes: 670,
        tags: ['1000Integrals']
      },
      {
        title: 'KFC, WORST FAST FOOD',
        content: 'Ok sge The context I love KFC Favorite Fastfood ko sya...',
        author: users[4]._id,
        space: 'rinaldoeats',
        upvotes: 167,
        tags: ['enzomeal']
      }
    ]);

    // 5. Seed Comments
    console.log('Seeding Comments...');
    const rootComment = await Comment.create({
      postId: posts[0]._id,
      authorId: users[4]._id,
      content: '??!?!?',
      depth: 0
    });

    await Comment.insertMany([
      {
        postId: posts[0]._id,
        authorId: users[0]._id,
        parentId: rootComment._id,
        content: 'you must stop breeding the horses',
        depth: 1
      },
      {
        postId: posts[1]._id,
        authorId: users[1]._id,
        content: 'meow meow',
        depth: 0
      },
      {
        postId: posts[4]._id,
        authorId: users[0]._id,
        content: 'Day 1 of getting an enzo meal out of spite',
        depth: 0
      }
    ]);

    // Update comment counts on posts
    await Post.findByIdAndUpdate(posts[0]._id, { commentCount: 2 });
    await Post.findByIdAndUpdate(posts[1]._id, { commentCount: 1 });
    await Post.findByIdAndUpdate(posts[4]._id, { commentCount: 1 });

    console.log('Database successfully seeded with Phase 1 data!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
