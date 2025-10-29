import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 0 9 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.375c0-1.32-1.005-2.433-2.343-2.599a1.04 1.04 0 0 0-.825.228 9.043 9.043 0 0 0-3.332 0 1.04 1.04 0 0 0-.825-.228C10.005 12.942 9 14.055 9 15.375v1.125c0 .621.504 1.125 1.125 1.125h7.75c.621 0 1.125-.504 1.125-1.125v-1.125Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 0-1.04.228a1.04 1.04 0 0 0-.825.228 9.043 9.043 0 0 0-3.332 0 1.04 1.04 0 0 0-.825-.228A1.04 1.04 0 0 0 5.25 5.25v2.25m6.75-2.25 1.04-.228a1.04 1.04 0 0 1 .825.228 9.043 9.043 0 0 1 3.332 0 1.04 1.04 0 0 1 .825-.228c.27.057.488.29.53.571v2.25m-6.75-2.25-1.04.228" />
    </svg>
);
