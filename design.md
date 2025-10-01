# Visual Design Specification - Ethan Bober Portfolio Website

## Design Philosophy

### Color Palette
- **Primary Background**: Deep Black (#000000)
- **Grid Lines**: Pure White (#FFFFFF) with opacity variations
- **Text Primary**: White (#FFFFFF) for high contrast
- **Text Secondary**: Light Gray (#E0E0E0) for descriptions
- **Accent Color**: Soft Blue (#4A90E2) for interactive elements
- **Glass Bubble Borders**: Semi-transparent white with blur effects

### Typography
- **Primary Font**: Minion Pro (serif) - for headings and name
- **Secondary Font**: Inter or system sans-serif - for body text and descriptions
- **Font Hierarchy**:
  - Name: 48px, bold
  - Description: 24px, regular
  - Experience Titles: 18px, medium
  - Experience Details: 14px, regular
  - Body Text: 16px, regular

### Visual Language
- **Modern Tech Aesthetic**: Clean, minimal, sophisticated
- **Glass Morphism**: Translucent elements with backdrop blur
- **Geometric Precision**: Sharp grid lines, circular bubbles
- **Subtle Animations**: Smooth, purposeful motion
- **High Contrast**: White on black for maximum readability

## Visual Effects

### Background Grid System
- **Invisible Grid**: 20x20 pixel cells initially transparent
- **Hover Illumination**: White lines appear with 0.3 opacity on mouse over
- **Trail Effect**: Grid cells remain lit briefly after mouse passes
- **Responsive Grid**: Adapts to screen size while maintaining proportions

### Glassy Bubble Effects
- **Backdrop Blur**: 20px blur radius for glass effect
- **Border**: 1px solid rgba(255,255,255,0.2)
- **Inner Shadow**: Subtle inset shadow for depth
- **Transparency**: rgba(255,255,255,0.1) background
- **Hover State**: Increased opacity and subtle glow

### Animation Library Usage
- **Anime.js**: Primary animation engine
  - Bubble expansion/contraction
  - Grid illumination effects
  - Text fade-ins and transitions
  - Arrow drawing animations
- **CSS Transforms**: 3D rotations and scaling effects
- **Canvas API**: Grid interaction and particle effects

### Interactive Elements
- **Experience Bubbles**:
  - Default: 120px diameter, glassy appearance
  - Hover: Expands to 150px, reveals additional text
  - Click: Smooth transition to detail page
- **Arrows**:
  - Animated drawing effect from center to bubbles
  - Subtle pulse animation on hover
  - Dashed line style with arrowheads
- **Grid Cells**:
  - 20x20px squares
  - Fade-in/fade-out on mouse interaction
  - Smooth color transitions

### Header Effect
- **Central Focus**: Name and description prominently displayed
- **Subtle Glow**: Soft white glow around main text
- **Typewriter Animation**: Text appears letter by letter
- **Floating Effect**: Gentle vertical movement for visual interest

### Layout Structure
- **Full Screen Canvas**: Grid background covers entire viewport
- **Centered Content**: Main elements positioned in visual center
- **Radial Bubble Distribution**: Experience bubbles arranged in circular pattern
- **Responsive Breakpoints**: 
  - Desktop: Full bubble layout
  - Tablet: Stacked bubble arrangement
  - Mobile: Single column with smaller bubbles

### Hover Effects
- **Bubble Expansion**: Scale from 1.0 to 1.25 with smooth transition
- **Text Reveal**: Additional information fades in
- **Glow Enhancement**: Increased brightness and blur
- **Arrow Highlight**: Connected arrow brightens and thickens
- **Grid Response**: Surrounding grid cells light up

### Scroll Motion
- **Parallax Elements**: Subtle background movement (max 8% translation)
- **Reveal Animations**: Elements fade in as they enter viewport
- **Smooth Scrolling**: Eased transitions between sections
- **Sticky Elements**: Navigation and contact info remain accessible

### Image Treatment
- **Hero Image**: Abstract materials science visualization
- **Experience Images**: Clean, professional photos where applicable
- **Icon System**: Minimalist icons for skills and contact methods
- **Consistent Styling**: All images maintain glassy aesthetic

### Mobile Considerations
- **Touch-Friendly**: Minimum 44px touch targets
- **Simplified Grid**: Reduced complexity for performance
- **Stacked Layout**: Vertical arrangement of bubbles
- **Gesture Support**: Swipe navigation between experiences

## Technical Implementation
- **CSS Custom Properties**: For consistent theming
- **CSS Grid & Flexbox**: For responsive layouts
- **WebGL Canvas**: For high-performance grid rendering
- **Intersection Observer**: For scroll-triggered animations
- **RequestAnimationFrame**: For smooth 60fps animations