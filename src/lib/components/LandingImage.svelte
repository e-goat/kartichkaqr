<svg
    viewBox="0 0 400 280"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-full"
>
    <defs>
        <!-- Enhanced gradients with more contrast -->
        <linearGradient id="leftCardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ffede4;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#ffede4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e8d1b8;stop-opacity:1" />
        </linearGradient>

        <linearGradient
            id="rightCardGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
        >
            <stop offset="0%" style="stop-color:#e8d1b8;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#ffede4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffede4;stop-opacity:1" />
        </linearGradient>

        <!-- Strong shadow gradient -->
        <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#917319;stop-opacity:0.4" />
            <stop offset="50%" style="stop-color:#caa74e;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#917319;stop-opacity:0.4" />
        </linearGradient>

        <!-- Pattern for card texture -->
        <pattern
            id="cardPattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
        >
            <circle cx="10" cy="10" r="1" fill="#ffde82" opacity="0.1" />
        </pattern>
    </defs>

    <!-- Enhanced Card Shadow -->
    <ellipse cx="200" cy="260" rx="150" ry="20" fill="#917319" opacity="0.4" />
    <ellipse cx="200" cy="256" rx="140" ry="16" fill="#caa74e" opacity="0.3" />

    <!-- Left Card Panel with stronger borders -->
    <path
        d="M 40 64 L 190 48 L 190 224 L 40 240 Z"
        fill="url(#leftCardGradient)"
        stroke="#917319"
        stroke-width="2"
    />
    <path d="M 40 64 L 190 48 L 190 224 L 40 240 Z" fill="url(#cardPattern)" />

    <!-- Right Card Panel with stronger borders -->
    <path
        d="M 210 48 L 360 64 L 360 240 L 210 224 Z"
        fill="url(#rightCardGradient)"
        stroke="#917319"
        stroke-width="2"
    />
    <path
        d="M 210 48 L 360 64 L 360 240 L 210 224 Z"
        fill="url(#cardPattern)"
    />

    <!-- Enhanced Center Fold/Crease -->
    <line
        x1="200"
        y1="48"
        x2="200"
        y2="224"
        stroke="#917319"
        stroke-width="3"
        opacity="1"
    />
    <rect x="197" y="48" width="6" height="176" fill="url(#shadowGradient)" />

    <!-- Strong decorative borders -->
    <path
        d="M 48 72 L 182 58 L 182 216 L 48 230 Z"
        fill="none"
        stroke="#caa74e"
        stroke-width="1.5"
        opacity="1"
    />
    <path
        d="M 218 58 L 352 72 L 352 230 L 218 216 Z"
        fill="none"
        stroke="#caa74e"
        stroke-width="1.5"
        opacity="1"
    />

    <!-- Inner accent borders -->
    <path
        d="M 56 80 L 174 67 L 174 208 L 56 221 Z"
        fill="none"
        stroke="#ffde82"
        stroke-width="1"
        opacity="0.8"
    />
    <path
        d="M 226 67 L 344 80 L 344 221 L 226 208 Z"
        fill="none"
        stroke="#ffde82"
        stroke-width="1"
        opacity="0.8"
    />

    <!-- Left Panel Content with enhanced decorations -->
    <g transform="translate(115, 128)">
        <!-- Enhanced decorative elements -->
        <g fill="#caa74e" opacity="0.8">
            <polygon
                points="0,0 2,8 10,8 4,13 6,21 0,16 -6,21 -4,13 -10,8 -2,8"
                transform="scale(0.6) translate(-20, -40)"
            />
            <polygon
                points="0,0 2,8 10,8 4,13 6,21 0,16 -6,21 -4,13 -10,8 -2,8"
                transform="scale(0.4) translate(28, -56)"
            />
            <polygon
                points="0,0 2,8 10,8 4,13 6,21 0,16 -6,21 -4,13 -10,8 -2,8"
                transform="scale(0.5) translate(-28, 40)"
            />
        </g>

        <!-- Ornamental flourishes -->
        <g stroke="#917319" stroke-width="1.5" fill="none" opacity="0.6">
            <path d="M -32 -8 Q -24 -16 -16 -8 Q -8 0 0 -8" />
            <path d="M 0 8 Q 8 16 16 8 Q 24 0 32 8" />
        </g>

        <!-- Left panel text with text shadow effect -->
        <text
            x="1"
            y="-15"
            font-family="serif"
            font-size="22"
            font-weight="bold"
            text-anchor="middle"
            fill="#caa74e"
            opacity="0.3"
            transform="skewX(-5)"
        >
            Happy
        </text>
        <text
            x="0"
            y="-16"
            font-family="serif"
            font-size="22"
            font-weight="bold"
            text-anchor="middle"
            fill="#917319"
            transform="skewX(-5)"
        >
            Happy
        </text>
    </g>

    <!-- Right Panel Content with enhanced decorations -->
    <g transform="translate(285, 128)">
        <!-- Enhanced decorative elements -->
        <g fill="#93e0a2" opacity="0.9">
            <circle cx="-20" cy="-28" r="3" />
            <circle cx="24" cy="-36" r="2.5" />
            <circle cx="-24" cy="32" r="3" />
            <rect
                x="20"
                y="28"
                width="3"
                height="3"
                rx="1"
                transform="rotate(45)"
            />
            <rect
                x="-28"
                y="-32"
                width="4"
                height="4"
                rx="1"
                transform="rotate(30)"
            />
        </g>

        <!-- Additional teal accents -->
        <g fill="#92da9f" opacity="0.7">
            <circle cx="0" cy="-48" r="1.5" />
            <circle cx="-12" cy="48" r="2" />
            <circle cx="16" cy="44" r="1.5" />
        </g>

        <!-- Ornamental flourishes -->
        <g stroke="#917319" stroke-width="1.5" fill="none" opacity="0.6">
            <path d="M -32 -8 Q -24 -16 -16 -8 Q -8 0 0 -8" />
            <path d="M 0 8 Q 8 16 16 8 Q 24 0 32 8" />
        </g>

        <!-- Right panel text with shadow effect -->
        <text
            x="1"
            y="-15"
            font-family="serif"
            font-size="22"
            font-weight="bold"
            text-anchor="middle"
            fill="#caa74e"
            opacity="0.3"
            transform="skewX(5)"
        >
            New Year
        </text>
        <text
            x="0"
            y="-16"
            font-family="serif"
            font-size="22"
            font-weight="bold"
            text-anchor="middle"
            fill="#917319"
            transform="skewX(5)"
        >
            New Year
        </text>

        <!-- Year with shadow -->
        <text
            x="1"
            y="17"
            font-family="serif"
            font-size="16"
            font-weight="normal"
            text-anchor="middle"
            fill="#ffde82"
            opacity="0.5"
            transform="skewX(5)"
        >
            2025
        </text>
        <text
            x="0"
            y="16"
            font-family="serif"
            font-size="16"
            font-weight="normal"
            text-anchor="middle"
            fill="#caa74e"
            transform="skewX(5)"
        >
            2025
        </text>
    </g>

    <!-- Enhanced fireworks with more contrast -->
    <g stroke="#ffde82" stroke-width="2" fill="none" opacity="0.8">
        <circle cx="96" cy="32" r="12" />
        <line x1="96" y1="20" x2="96" y2="12" />
        <line x1="108" y1="32" x2="116" y2="32" />
        <line x1="96" y1="44" x2="96" y2="52" />
        <line x1="84" y1="32" x2="76" y2="32" />
        <line x1="104.5" y1="23.5" x2="110.2" y2="17.8" />
        <line x1="104.5" y1="40.5" x2="110.2" y2="46.2" />
        <line x1="87.5" y1="40.5" x2="81.8" y2="46.2" />
        <line x1="87.5" y1="23.5" x2="81.8" y2="17.8" />
    </g>

    <g stroke="#93e0a2" stroke-width="2" fill="none" opacity="0.8">
        <circle cx="304" cy="28" r="10" />
        <line x1="304" y1="18" x2="304" y2="12" />
        <line x1="314" y1="28" x2="320" y2="28" />
        <line x1="304" y1="38" x2="304" y2="44" />
        <line x1="294" y1="28" x2="288" y2="28" />
    </g>

    <!-- Enhanced confetti with more visibility -->
    <g fill="#92da9f" opacity="0.8">
        <rect
            x="80"
            y="20"
            width="4"
            height="4"
            rx="1"
            transform="rotate(45)"
        />
        <rect
            x="320"
            y="24"
            width="5"
            height="5"
            rx="1"
            transform="rotate(60)"
        />
        <rect
            x="144"
            y="12"
            width="3"
            height="3"
            rx="1"
            transform="rotate(30)"
        />
        <rect
            x="240"
            y="20"
            width="4"
            height="4"
            rx="1"
            transform="rotate(75)"
        />
    </g>

    <g fill="#ffde82" opacity="0.8">
        <rect
            x="256"
            y="16"
            width="4"
            height="4"
            rx="1"
            transform="rotate(15)"
        />
        <rect
            x="120"
            y="28"
            width="5"
            height="5"
            rx="1"
            transform="rotate(75)"
        />
        <rect
            x="64"
            y="16"
            width="3"
            height="3"
            rx="1"
            transform="rotate(45)"
        />
    </g>

    <!-- Corner decorative elements -->
    <g fill="#917319" opacity="0.6">
        <circle cx="24" cy="24" r="2.5" />
        <circle cx="376" cy="24" r="2.5" />
        <circle cx="24" cy="256" r="2.5" />
        <circle cx="376" cy="256" r="2.5" />
    </g>
</svg>
