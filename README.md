# QR Code Generator

A modern, free QR code generator web application built with React. Generate QR codes for any URL instantly with customizable size options and download formats.

## Features

- Instant QR code generation for any HTTP/HTTPS URL
- Multiple size options (128px, 256px, 512px, 1024px)
- Download as PNG format
- Copy URL to clipboard
- Share functionality (on supported devices)
- Client-side generation (no data transmitted to servers)
- Responsive design with modern UI
- No sign-up required
- 100% free to use

## Technologies Used

This project is built with:

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **QRious** - QR code generation library (loaded via CDN)

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

## Installation

1. Clone or download this repository

2. Install dependencies:
   ```bash
   npm install
   ```

## How to Run

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

The dev server features:
- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- Automatic browser opening (optional)

## How to Build

Create a production build:

```bash
npm run build
```

This will:
- Bundle and optimize the application
- Generate static files in the `dist/` directory
- Minify JavaScript and CSS
- Optimize assets for production

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
QR-code-generator/
├── src/
│   ├── App.jsx          # Main QR code generator component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── README.md           # This file
```

## Usage

1. Open the application in your browser
2. Enter a valid HTTP or HTTPS URL in the input field
3. Select your desired QR code size
4. Click "Generate QR Code"
5. Download, copy, or share your generated QR code

## Privacy & Security

All QR code generation happens client-side in your browser. No data is stored or transmitted to any server, ensuring complete privacy for your URLs.

## License

This project is free to use and modify.