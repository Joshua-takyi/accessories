import type {Config} from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)'
            },
            fontSize: {
                display: 'clamp(2rem, 5vw, 4.5rem)', // Improved range for better scaling
                h1: 'clamp(2.2rem, 4vw, 3.8rem)', // A bit larger base for h1
                h2: 'clamp(1.8rem, 3.5vw, 2.8rem)', // Better scaling for h2
                h3: 'clamp(1.6rem, 3vw, 2.2rem)', // Adjusted for a more readable h3
                h4: 'clamp(1.4rem, 2.5vw, 1.9rem)', // Slightly larger for h4
                bodyLg: 'clamp(1.25rem, 1.5vw, 1.5rem)', // Increased legibility for body text
                bodyMd: 'clamp(1.1rem, 1.25vw, 1.25rem)', // Adjusted for body text on medium devices
                body: 'clamp(1rem, 1.25vw, 1.125rem)', // Default body text, compact but legible
                bodySm: 'clamp(0.9rem, 1vw, 1.1rem)', // Small text but legible
                bodyXs: 'clamp(0.8rem, 0.875vw, 1rem)', // Smaller text for very small screens
                displayHero: 'clamp(2.5rem, 6vw, 5.5rem)', // Larger font size for hero sections
                banner: 'clamp(0.75rem, 1vw, 1rem)', // Banner text, kept minimal
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
