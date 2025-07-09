import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				weather: {
					sunny: 'hsl(var(--sunny))',
					'sunny-glow': 'hsl(var(--sunny-glow))',
					cloudy: 'hsl(var(--cloudy))',
					rainy: 'hsl(var(--rainy))',
					stormy: 'hsl(var(--stormy))',
					snowy: 'hsl(var(--snowy))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'weather-bounce': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'weather-pulse': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'weather-spin': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'forecast-slide': {
					'0%': {
						transform: 'translateX(20px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'weather-bounce': 'weather-bounce 2s ease-in-out infinite',
				'weather-pulse': 'weather-pulse 2s ease-in-out infinite',
				'weather-spin': 'weather-spin 1s linear infinite',
				'forecast-slide': 'forecast-slide 0.5s ease-out forwards'
			},
			backgroundImage: {
				'weather-gradient': 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))',
				'premium-gradient': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary-glow)) 100%)',
				'sunny-gradient': 'linear-gradient(135deg, hsl(var(--sunny)), hsl(var(--sunny-glow)))',
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
				'warm-gradient': 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent-warm)))',
				'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
				'hero-gradient': 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.1), hsl(var(--primary-glow) / 0.12))'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
