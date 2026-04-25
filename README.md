# Personal Portfolio

A professional portfolio website built with React, TypeScript, and Tailwind CSS. Featuring dynamic GitHub project integration and a secure Admin dashboard powered by Supabase.

## Features

- **Dynamic Projects:** Automatically fetches public repositories from GitHub.
- **Private Projects:** Showcase private/manual projects via a secure Supabase integration.
- **Admin Dashboard:** Manage project overrides, featured items, and private projects.
- **Modern UI:** Built with Framer Motion for smooth animations and shadcn/ui for components.
- **Responsive Design:** Fully optimized for all screen sizes.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Framer Motion
- **Database/Auth:** Supabase
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/mujthabasalim/my-portfolio.git
   cd my-portfolio
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```

## Deployment

Build the project for production:

```sh
npm run build
```

The output will be in the `dist/` directory, ready to be deployed to platforms like Vercel, Netlify, or GitHub Pages.
