import { envSiteUrl } from '@/config';

if (!envSiteUrl) {
  throw new Error(
    '❌ NEXT_PUBLIC_SITE_URL is missing or empty! Check your .env file.',
  );
}

const SITE_URL = envSiteUrl.replace(/\/$/, '');

const siteMetadata = {
  title: 'COSKETCH',
  description:
    'A real-time collaborative sketching tool for teams to brainstorm, draw, and create together.',

  header: 'COSKETCH',

  slogan: `Sketch Together, Think Better`,

  developer: 'Narsi Bhati',

  siteUrl: SITE_URL,

  language: 'en-US',
  locale: 'en-US',

  socialBanner: `${SITE_URL}/images/social-banner.webp`,

  // social links
  github: 'https://github.com/NarsiBhati-Dev/CoSketch.git',
  linkedIn: 'https://www.linkedin.com/in/narsi-bhati-b43459224/',
  twitter: 'https://x.com/NarsiBhati31',

  // contacts
  email: 'narsibhati2000@gmail.com',
};

export default siteMetadata;
