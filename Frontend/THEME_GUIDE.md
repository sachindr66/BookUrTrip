# 🎨 Maitai Theme Guide

## Overview
Your project now uses a custom **Maitai Theme** built with Tailwind CSS, featuring three main colors and a comprehensive design system.

## 🎯 Main Colors

### Primary (Blue)
- **Main**: `primary-500` (#0ea5e9)
- **Light**: `primary-100` to `primary-400`
- **Dark**: `primary-600` to `primary-900`
- **Usage**: Main actions, links, primary buttons

### Secondary (Yellow/Amber)
- **Main**: `secondary-500` (#eab308)
- **Light**: `secondary-100` to `secondary-400`
- **Dark**: `secondary-600` to `secondary-900`
- **Usage**: Secondary actions, highlights, warnings

### Accent (Pink/Magenta)
- **Main**: `accent-500` (#ec4899)
- **Light**: `accent-100` to `accent-400`
- **Dark**: `accent-600` to `accent-900`
- **Usage**: Special elements, CTAs, emphasis

## 🧩 Component Classes

### Buttons
```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-accent">Accent Button</button>
<button className="btn-outline">Outline Button</button>
```

### Cards
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

### Input Fields
```jsx
<input className="input-field" placeholder="Enter text..." />
```

### Layout
```jsx
<div className="section-padding">
  <div className="container-custom">
    <h2>Section Title</h2>
    <p>Section content</p>
  </div>
</div>
```

## 🎨 Utility Classes

### Text Gradients
```jsx
<h1 className="text-gradient">Gradient Text</h1>
```

### Background Gradients
```jsx
<div className="bg-gradient-primary">Primary Gradient</div>
<div className="bg-gradient-secondary">Secondary Gradient</div>
<div className="bg-gradient-accent">Accent Gradient</div>
```

### Shadows
```jsx
<div className="shadow-soft">Soft Shadow</div>
<div className="shadow-medium">Medium Shadow</div>
<div className="shadow-strong">Strong Shadow</div>
<div className="shadow-custom">Custom Shadow</div>
```

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+
- **2xl**: 1536px+

### Example
```jsx
<div className="text-lg md:text-xl lg:text-2xl">
  Responsive text size
</div>
```

## 🔤 Typography

### Font Families
- **Default**: `font-sans` (Inter)
- **Headings**: `font-heading` (Poppins)

### Text Sizes
```jsx
<h1>H1 - 4xl to 6xl</h1>
<h2>H2 - 3xl to 5xl</h2>
<h3>H3 - 2xl to 4xl</h3>
<h4>H4 - xl to 3xl</h4>
<h5>H5 - lg to 2xl</h5>
<h6>H6 - base to xl</h6>
```

## 🎯 Best Practices

1. **Use semantic colors**: `primary-500` for main actions, `secondary-500` for secondary
2. **Maintain consistency**: Use the same color variants throughout components
3. **Leverage the design system**: Use predefined component classes when possible
4. **Responsive first**: Always consider mobile, tablet, and desktop layouts
5. **Accessibility**: Ensure sufficient contrast between text and background colors

## 🚀 Quick Start Examples

### Hero Section
```jsx
<section className="section-padding bg-gradient-primary text-white">
  <div className="container-custom text-center">
    <h1 className="mb-6">Welcome to SeeMyTrip</h1>
    <p className="text-xl mb-8">Your perfect travel companion</p>
    <button className="btn-secondary">Get Started</button>
  </div>
</section>
```

### Feature Card
```jsx
<div className="card text-center">
  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <span className="text-2xl">✈️</span>
  </div>
  <h3 className="mb-3">Easy Booking</h3>
  <p className="text-neutral-600">Book your flights and hotels with just a few clicks</p>
</div>
```

### Form Section
```jsx
<div className="section-padding bg-neutral-100">
  <div className="container-custom max-w-2xl">
    <h2 className="text-center mb-8">Contact Us</h2>
    <form className="space-y-6">
      <input className="input-field" placeholder="Your Name" />
      <input className="input-field" placeholder="Your Email" />
      <textarea className="input-field" rows="4" placeholder="Your Message"></textarea>
      <button className="btn-primary w-full">Send Message</button>
    </form>
  </div>
</div>
```

## 🔧 Customization

To modify the theme, edit `tailwind.config.js`:
- **Colors**: Update the color values in the `extend.colors` section
- **Spacing**: Add custom spacing values
- **Shadows**: Modify or add new shadow definitions
- **Fonts**: Change font families

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v3 Guide](https://tailwindcss.com/docs/installation)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
