import React from 'react';

export const GlobeAltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75A15.75 15.75 0 0 1 20.25 12c0 2.66-1.34 5.12-3.36 6.64" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12A15.75 15.75 0 0 1 12 3.75m0 16.5A15.75 15.75 0 0 1 3.75 12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75c-2.66 0-5.12 1.34-6.64 3.36" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 12c-1.52 2.02-3.98 3.36-6.64 3.36" />
    </svg>
);