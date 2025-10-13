import siteMetadata from '@/lib/siteMetadata';
import React from 'react';
import CardSocial from './card-social';
import Logo from './logo';

const Footer = () => {
  const links = [
    { name: 'About Us', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <footer className='border-t border-gray-300 bg-gradient-to-br from-gray-50 via-white to-gray-200 text-gray-700'>
      <section className='mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-10 md:flex-row'>
        {/* Left Section - Logo & Socials */}
        <section className='flex w-full flex-col items-start justify-start md:w-40'>
          <Logo />
          <section className='mt-8 flex justify-between gap-4'>
            <CardSocial title='Twitter' href={siteMetadata.twitter} />
            <CardSocial title='LinkedIn' href={siteMetadata.linkedIn} />
          </section>
        </section>

        {/* Center Section - Quick Links */}
        <section className='mt-8 md:mt-0'>
          <h3 className='mb-2 text-center text-xl font-semibold text-black'>
            Quick Links
          </h3>
          <ul className='flex items-center gap-3 text-lg'>
            {links.map((link, idx) => (
              <React.Fragment key={link.name}>
                <li className='flex items-center'>
                  <a
                    href={link.href}
                    className='hover:text-primary cursor-pointer font-medium transition duration-300 focus:underline focus:outline-none'
                    aria-label={link.name}
                  >
                    {link.name}
                  </a>
                </li>
                {idx < links.length - 1 && (
                  <span
                    className='mx-1 h-5 w-px bg-gray-300'
                    aria-hidden='true'
                  ></span>
                )}
              </React.Fragment>
            ))}
          </ul>
        </section>

        {/* Right Section - Contact Info */}
        <section className='mt-8 md:mt-0'>
          <h3 className='mb-2 text-xl font-semibold text-black'>Contact Us</h3>
          <ul className='space-y-2 text-lg font-medium'>
            <li>
              <a
                href={`mailto:${siteMetadata.email}`}
                className='hover:text-primary focus:underline focus:outline-none'
                aria-label='Email'
              >
                <span>{siteMetadata.email}</span>
              </a>
            </li>
          </ul>
          <div className='mt-4 text-sm text-gray-500'>
            <span>
              Made with{' '}
              <span aria-label='love' role='img'>
                ❤️
              </span>{' '}
              by the mohd yaqoob
            </span>
          </div>
        </section>
      </section>

      {/* Footer Credit */}
      <section className='py-4 text-center text-sm font-medium text-gray-500'>
        <p className='py-2'>
          &copy; {new Date().getFullYear()} <span>{siteMetadata.header}</span>.
          All rights reserved.
        </p>
      </section>
    </footer>
  );
};

export default Footer;
