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
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		fontSize: {
    			display: 'clamp(2rem, 5vw, 4.5rem)',
    			h1: 'clamp(2.2rem, 4vw, 3.8rem)',
    			h2: 'clamp(1.8rem, 3.5vw, 2.8rem)',
    			h3: 'clamp(1.6rem, 3vw, 2.2rem)',
    			h4: 'clamp(1.4rem, 2.5vw, 1.9rem)',
    			bodyLg: 'clamp(1.25rem, 1.5vw, 1.5rem)',
    			bodyMd: 'clamp(1.1rem, 1.25vw, 1.25rem)',
    			body: 'clamp(1rem, 1.25vw, 1.125rem)',
    			bodySm: 'clamp(0.9rem, 1vw, 1.1rem)',
    			bodyXs: 'clamp(0.8rem, 0.875vw, 1rem)',
    			displayHero: 'clamp(2.5rem, 6vw, 5.5rem)',
    			banner: 'clamp(0.75rem, 1vw, 1rem)'
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
