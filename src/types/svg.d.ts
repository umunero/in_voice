// Default: Import SVG as React component (handled by SVGR)
declare module '*.svg' {
    import React from 'react';
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}

// Import SVG as a URL string (handled by asset/resource via ?url)
declare module '*.svg?url' {
    const content: string; // The URL string
    export default content;
}

// Import SVG as a raw string (handled by asset/source via ?raw)
declare module '*.svg?raw' {
    const content: string; // The raw SVG content string
    export default content;
}