import '@/styles/globals.css';
import type { Metadata } from 'next';

import { space_grotesk } from '@/data/fonts';
import ReactQueryProvider from '@/lib/react-query';
import siteMetadata from '@/lib/siteMetadata';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: 'Sketch.io | Sketch Together, Think Better',
    template: `%s | ${siteMetadata.title}`,
  },

  description: siteMetadata.description,

  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* Favicons */}
      <link rel='icon' type='image/png' href='/images/social-banner.png' sizes='96x96' />
      <link rel='icon' type='image/svg+xml' href='/images/social-banner.svg' />
      <link rel='shortcut icon' href='/images/logo.png' />
      <link rel='apple-touch-icon' sizes='180x180' href='/images/logo.png' />
      <meta name='apple-mobile-web-app-title' content='Sketch.io' />
      <link rel='manifest' href='/favicons/site.webmanifest' />
      <meta property='og:image' content='/images/social-banner.png' />
      <meta name='twitter:image' content='/images/social-banner.png' />

      <body className={`${space_grotesk.className} scroll-smooth antialiased`}>
        <ReactQueryProvider>
          {children}
          <Toaster position='top-right' reverseOrder={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
