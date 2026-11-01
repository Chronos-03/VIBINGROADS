# VIBING ROADS

A scroll-driven site that walks you through a few street scenes, then lets you pick a city and explore it by car or on foot.

## What it does

- Story flow: Notice -> Explore -> Choose
- Cities: Tokyo, Paris, New York, Istanbul, Mumbai
- Driving or walking mode
- Ambient sound and a local clock
- A few hidden details to find

## How it's built

- HTML, CSS and vanilla JS
- GSAP with ScrollTrigger and ScrollToPlugin
- Google Fonts: Cinzel, Playfair Display, Inter
- Mapbox GL for the 3D city view

### Scrolling

ScrollTrigger pins each scene and moves the camera through it as you scroll.

### Scenes

1. Hero: title and explore button
2. Notice: first street scene, journey steps and a detail card
3. Explore: pick driving or walking
4. Choose: city cards

### Interactions

- Hero background follows the mouse
- Soft trailing cursor with a golden glow that expands into a labeled ring over links
- Journey steps jump to a scene
- The detail card reveals hidden text
- Mode and city cards select
- Sound toggle for ambient audio
- Live clock

### Small screens

- Desktop keeps the pinned scroll effects, mobile switches to horizontal city scrolling
- Reduced motion settings are respected

### Loading

- Images are WebP, with smaller versions on mobile
- Mapbox loads when a city is opened
- Videos load when a tour starts

## Getting started

Open `index.html` in a browser. There is no build step.
