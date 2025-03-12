const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (!envSiteUrl) {
  throw new Error(
    "❌ NEXT_PUBLIC_SITE_URL is missing or empty! Check your .env file."
  );
}

const SITE_URL = envSiteUrl.replace(/\/$/, "");

const siteMetadata = {
  title: "CoSketch",
  description:
    "A real-time collaborative sketching tool for teams to brainstorm, draw, and create together.",

  slogan: `Sketch Together, Think Better.`,

  developer: "Narsi Bhati",

  siteUrl: SITE_URL,

  language: "en-US",
  locale: "en-US",

  socialBannerOne: `${SITE_URL}/social-banner-1.jpeg`,
  socialBannerTwo: `${SITE_URL}/social-banner-2.jpeg`,
  socialBannerThree: `${SITE_URL}/social-banner-3.jpeg`,
  socialBannerFour: `${SITE_URL}/social-banner-4.jpeg`,
};

export default siteMetadata;
