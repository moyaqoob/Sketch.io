import { envSiteUrl } from '@/config';

if (!envSiteUrl) {
  throw new Error(
    '❌ NEXT_PUBLIC_SITE_URL is missing or empty! Check your .env file.',
  );
}

const SITE_URL = envSiteUrl.replace(/\/$/, '');

const siteMetadata = {
  title: 'Sketch.io',
  description:
    'A real-time collaborative sketching tool for teams to brainstorm, draw, and create together.',

  header: 'Sketch.io',

  slogan: `Sketch Together, Think Better`,

  developer: 'Mohd Yaqoob',

  siteUrl: SITE_URL,

  language: 'en-US',
  locale: 'en-US',

  socialBanner: `${SITE_URL}/images/social-banner.png`,

  // social links
  linkedIn: 'https://www.linkedin.com/in/moyaqoob/',
  twitter: 'https://x.com/aliyaqoob_',

  // contacts
  email: 'moyaqoob28@gmail.com',
};

export default siteMetadata;
