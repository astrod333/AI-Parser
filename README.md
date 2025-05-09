# AI Parser

AI Parser is a powerful tool to extract structured data and insights from unstructured text and files using advanced AI models.

![AI Parser](https://byiy0cu7m2.ufs.sh/f/Luc8xnAhTG7INjjx6QhlwjF13QBzmD9ZcIPMbxeOf5tnqH2r)

## Features

- Upload and analyze images, PDFs, Word documents, and plain text files
- Extract structured data and insights using AI
- Supports multiple file types and large files (up to 10MB)
- Built with Next.js, React, and modern UI components

## Usage
1. Enter your prompt in the provided text area.
2. Upload one or more files (images, PDFs, Word docs, or text files).
3. Click to analyze and receive AI-generated insights or structured data.

## Project Structure

```
├── app/                # Next.js app directory (pages, layouts, entry points)
│   ├── layout.tsx      # Root layout for the app
│   └── page.tsx        # Main page component
├── components/         # Reusable React components
│   ├── file-upload.tsx # File upload and prompt UI
│   └── ui/             # UI primitives (Button, Card, Alert, Progress, Textarea, etc.)
├── server/             # Server-side logic (AI integration)
│   └── ai.ts           # AI result fetching logic
├── public/             # Static assets (images, icons, etc.)
├── styles/ or app/globals.css # Global styles (Tailwind CSS)
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
├── next.config.ts      # Next.js configuration
└── README.md           # Project documentation
```
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

