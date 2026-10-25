# VIBING ROADS

A cinematic, scroll-driven web experience that takes you on a journey through atmospheric streets of cities around the world. Built with smooth  animations and a story-like progression that guides users from exploration to city selection and they can listen local radio and enjoy the view either by car or walking.

## What is it?

VIBING ROADS is an immersive single-page website that simulates the feeling of wandering through real streets. It features:

- **Cinematic storytelling** - A multi-step journey through different scenes (Notice → Explore → Choose)
- **GSAP-powered animations** - Smooth scroll-triggered transitions with camera-like zoom effects
- **City selection** - Choose from Tokyo, Paris, New York, Istanbul, or Mumbai
- **Mode selection** - Pick between driving or walking perspectives
- **Ambient experience** - Local time display and optional ambient sound
- **Interactive details** - Revealing hidden elements as you explore

## How it's made

### Technologies Used

- **HTML5** - Semantic structure with multiple scroll sections
- **CSS3** - Modern styling with flexbox/grid, backdrop filters, animations
- **Vanilla JavaScript** - Interactive elements and logic
- **GSAP (GreenSock)** - Animation library with ScrollTrigger, ScrollToPlugin
- **Google Fonts** - Cinzel, Playfair Display, Inter

### Key Features

#### Cinematic Scroll Experience
The site uses GSAP ScrollTrigger to create a pinned scroll experience where the camera "zooms" through different locations. Each scene transitions smoothly into the next as you scroll.

#### Scene Progression
1. **Hero Section** - Landing page with title "VIBING ROADS" and "Explore" button
2. **Scroll One (Notice)** - First street scene with a journey step indicator and a detail card
3. **Scroll Two (Explore)** - Mode selection (Driving vs Walking)
4. **Scroll Three (Choose)** - City selection grid

#### Interactive Elements
- **Mouse parallax** on hero background
- **Journey step navigation** - Click to jump to different stages
- **Detail reveal** - Click to uncover hidden text
- **Mode cards** - Toggle between driving and walking
- **City cards** - Select a city
- **Sound toggle** - Play/pause ambient audio
- **Live clock** - Shows local time in multiple sections

#### Responsive Design
- Desktop-optimized cinematic experience with GSAP animations
- Mobile-friendly layout with horizontal scrolling for city selection
- Respects `prefers-reduced-motion` for accessibility

## Getting Started

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Scroll to experience the cinematic journey, or use the navigation links to jump between sections
No build step required - it's pure HTML, CSS, and JavaScript.