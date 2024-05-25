import { v4 as uuidv4 } from 'uuid';
import { Post, Site } from '@src/types';

export const site1: Site = {
  id: uuidv4(),
  name: 'Tech News Daily',
  url: 'https://technewsdaily.com',
  favicon: 'https://technewsdaily.com/favicon.ico',
  articleSelector: '.article',
  titleSelector: { selector: '.title', property: 'innerText' },
  urlSelector: { selector: 'a', property: 'href' },
  createdAtSelector: { selector: '.date', property: 'innerText' },
};

export const site2: Site = {
  id: uuidv4(),
  name: 'Health & Wellness Journal',
  url: 'https://healthwellnessjournal.com',
  favicon: 'https://healthwellnessjournal.com/favicon.ico',
  articleSelector: '.article',
  titleSelector: { selector: '.title', property: 'innerText' },
  urlSelector: { selector: 'a', property: 'href' },
  createdAtSelector: { selector: '.date', property: 'innerText' },
};

export const posts: Post[] = [
  {
    site: site1,
    title: 'New AI Technology Revolutionizes the Tech Industry',
    url: 'https://technewsdaily.com/post/1',
    createdAt: new Date('2024-05-25T12:00:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site1,
    title: 'Top 10 Gadgets to Watch Out for in 2024',
    url: 'https://technewsdaily.com/post/2',
    createdAt: new Date('2024-05-24T15:00:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site1,
    title: '5G Networks: What You Need to Know',
    url: 'https://technewsdaily.com/post/3',
    createdAt: new Date('2024-05-23T10:30:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'How Quantum Computing Will Change the Future',
    url: 'https://technewsdaily.com/post/4',
    createdAt: new Date('2024-05-22T09:15:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'The Rise of Electric Vehicles',
    url: 'https://technewsdaily.com/post/5',
    createdAt: new Date('2024-05-21T08:45:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'Smart Homes: The Next Big Thing?',
    url: 'https://technewsdaily.com/post/6',
    createdAt: new Date('2024-05-20T11:20:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site1,
    title: 'The Future of Wearable Technology',
    url: 'https://technewsdaily.com/post/7',
    createdAt: new Date('2024-05-19T14:40:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site1,
    title: 'Virtual Reality: Beyond Gaming',
    url: 'https://technewsdaily.com/post/8',
    createdAt: new Date('2024-05-18T10:00:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Impact of Blockchain Technology',
    url: 'https://technewsdaily.com/post/9',
    createdAt: new Date('2024-05-17T17:30:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'Cybersecurity in the Modern Age',
    url: 'https://technewsdaily.com/post/10',
    createdAt: new Date('2024-05-16T08:00:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Role of AI in Healthcare',
    url: 'https://technewsdaily.com/post/11',
    createdAt: new Date('2024-05-15T13:50:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'Advancements in Renewable Energy',
    url: 'https://technewsdaily.com/post/12',
    createdAt: new Date('2024-05-14T16:25:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Future of Autonomous Vehicles',
    url: 'https://technewsdaily.com/post/13',
    createdAt: new Date('2024-05-13T11:35:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'How 3D Printing is Transforming Industries',
    url: 'https://technewsdaily.com/post/14',
    createdAt: new Date('2024-05-12T09:00:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Growth of E-Commerce',
    url: 'https://technewsdaily.com/post/15',
    createdAt: new Date('2024-05-11T10:45:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site1,
    title: 'The Importance of Data Privacy',
    url: 'https://technewsdaily.com/post/16',
    createdAt: new Date('2024-05-10T12:00:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site1,
    title: 'The Evolution of Mobile Technology',
    url: 'https://technewsdaily.com/post/17',
    createdAt: new Date('2024-05-09T15:30:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'Artificial Intelligence in Education',
    url: 'https://technewsdaily.com/post/18',
    createdAt: new Date('2024-05-08T14:15:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'The Role of Robotics in Manufacturing',
    url: 'https://technewsdaily.com/post/19',
    createdAt: new Date('2024-05-07T11:50:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Future of Smart Cities',
    url: 'https://technewsdaily.com/post/20',
    createdAt: new Date('2024-05-06T10:25:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site2,
    title: 'The Benefits of a Balanced Diet',
    url: 'https://healthwellnessjournal.com/post/1',
    createdAt: new Date('2024-05-25T08:30:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site2,
    title: 'Top 5 Exercises for a Healthy Heart',
    url: 'https://healthwellnessjournal.com/post/2',
    createdAt: new Date('2024-05-24T17:45:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site2,
    title: 'Meditation for Stress Relief',
    url: 'https://healthwellnessjournal.com/post/3',
    createdAt: new Date('2024-05-23T14:10:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site2,
    title: 'The Importance of Sleep',
    url: 'https://healthwellnessjournal.com/post/4',
    createdAt: new Date('2024-05-22T21:30:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site2,
    title: 'Healthy Eating on a Budget',
    url: 'https://healthwellnessjournal.com/post/5',
    createdAt: new Date('2024-05-21T09:15:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site1,
    title: 'New AI Technology Revolutionizes the Tech Industry',
    url: 'https://technewsdaily.com/post/1',
    createdAt: new Date('2024-05-25T12:00:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site1,
    title: 'Top 10 Gadgets to Watch Out for in 2024',
    url: 'https://technewsdaily.com/post/2',
    createdAt: new Date('2024-05-24T15:00:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site1,
    title: '5G Networks: What You Need to Know',
    url: 'https://technewsdaily.com/post/3',
    createdAt: new Date('2024-05-23T10:30:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'How Quantum Computing Will Change the Future',
    url: 'https://technewsdaily.com/post/4',
    createdAt: new Date('2024-05-22T09:15:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'The Rise of Electric Vehicles',
    url: 'https://technewsdaily.com/post/5',
    createdAt: new Date('2024-05-21T08:45:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'Smart Homes: The Next Big Thing?',
    url: 'https://technewsdaily.com/post/6',
    createdAt: new Date('2024-05-20T11:20:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site1,
    title: 'The Future of Wearable Technology',
    url: 'https://technewsdaily.com/post/7',
    createdAt: new Date('2024-05-19T14:40:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site1,
    title: 'Virtual Reality: Beyond Gaming',
    url: 'https://technewsdaily.com/post/8',
    createdAt: new Date('2024-05-18T10:00:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Impact of Blockchain Technology',
    url: 'https://technewsdaily.com/post/9',
    createdAt: new Date('2024-05-17T17:30:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'Cybersecurity in the Modern Age',
    url: 'https://technewsdaily.com/post/10',
    createdAt: new Date('2024-05-16T08:00:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Role of AI in Healthcare',
    url: 'https://technewsdaily.com/post/11',
    createdAt: new Date('2024-05-15T13:50:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'Advancements in Renewable Energy',
    url: 'https://technewsdaily.com/post/12',
    createdAt: new Date('2024-05-14T16:25:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Future of Autonomous Vehicles',
    url: 'https://technewsdaily.com/post/13',
    createdAt: new Date('2024-05-13T11:35:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'How 3D Printing is Transforming Industries',
    url: 'https://technewsdaily.com/post/14',
    createdAt: new Date('2024-05-12T09:00:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Growth of E-Commerce',
    url: 'https://technewsdaily.com/post/15',
    createdAt: new Date('2024-05-11T10:45:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site1,
    title: 'The Importance of Data Privacy',
    url: 'https://technewsdaily.com/post/16',
    createdAt: new Date('2024-05-10T12:00:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site1,
    title: 'The Evolution of Mobile Technology',
    url: 'https://technewsdaily.com/post/17',
    createdAt: new Date('2024-05-09T15:30:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'Artificial Intelligence in Education',
    url: 'https://technewsdaily.com/post/18',
    createdAt: new Date('2024-05-08T14:15:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site1,
    title: 'The Role of Robotics in Manufacturing',
    url: 'https://technewsdaily.com/post/19',
    createdAt: new Date('2024-05-07T11:50:00Z'),
    read: false,
    marked: false,
  },
  {
    site: site1,
    title: 'The Future of Smart Cities',
    url: 'https://technewsdaily.com/post/20',
    createdAt: new Date('2024-05-06T10:25:00Z'),
    read: true,
    marked: true,
  },
  {
    site: site2,
    title: 'The Benefits of a Balanced Diet',
    url: 'https://healthwellnessjournal.com/post/1',
    createdAt: new Date('2024-05-25T08:30:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site2,
    title: 'Top 5 Exercises for a Healthy Heart',
    url: 'https://healthwellnessjournal.com/post/2',
    createdAt: new Date('2024-05-24T17:45:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site2,
    title: 'Meditation for Stress Relief',
    url: 'https://healthwellnessjournal.com/post/3',
    createdAt: new Date('2024-05-23T14:10:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site2,
    title: 'The Importance of Sleep',
    url: 'https://healthwellnessjournal.com/post/4',
    createdAt: new Date('2024-05-22T21:30:00Z'),
    read: true,
    marked: false,
  },
  {
    site: site2,
    title: 'Healthy Eating on a Budget',
    url: 'https://healthwellnessjournal.com/post/5',
    createdAt: new Date('2024-05-21T09:15:00Z'),
    read: false,
    marked: true,
  },
  {
    site: site2,
    title: 'The Benefits of Yoga',
    url: 'https://healthwellnessjournal.com',
    createdAt: new Date('2024-05-21T08:45:00Z'),
    read: false,
    marked: false,
  },
];
