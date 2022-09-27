import Link from 'next/link';
import React from 'react';
import { HiChevronRight } from 'react-icons/hi';

const links = [
  {
    title: 'About the Lily Pad',
    path: '/about',
  },
  {
    title: 'Meet the team',
    path: '/team',
  },
  {
    title: 'What is a Soulbound token?',
    path: '/sbt',
  },
  {
    title: 'The Lily Pad White Paper',
    path: '/whitepaper',
  },
];

const AboutHomeLinks = () => {
  return (
    <div className="flex h-full flex-col rounded-lg bg-main-gray-light p-6">
      {/* Heading and sub */}
      <div>
        <h1 className="mb-0 text-2xl">We help you grow, learn & excell</h1>
        <span className="text-sm font-light">
          Discover what we are all about
        </span>
      </div>
      {/* List */}
      <div className="mt-4 grid  w-[85%] grid-cols-2 gap-8 ">
        {links.map((l) => (
          <div key={l.path} className="flex space-x-2">
            {/* <Link href={l.path}>
              <a> */}
            <p className="mt-[0.1rem] text-2xl font-bold">
              <HiChevronRight />
            </p>
            <Link href={l.path}>
              <a>
                <p className="font-medium underline underline-offset-2">
                  About the Lily Pad
                </p>
              </a>
            </Link>
            {/* </a>
            </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutHomeLinks;
