# Penny More Dashboard

A modern, responsive dashboard application built with Next.js, React, and Tailwind CSS. This dashboard provides administrative interfaces for managing renters and property-related operations.

## 🚀 Features

- Modern, responsive UI built with Next.js 13+ and Tailwind CSS
- Admin dashboard with renter management
- Data visualization with Recharts
- State management with Redux Toolkit
- TypeScript support for type safety
- ESLint and Prettier for code quality

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.0.0 or later
- npm (comes with Node.js) or yarn
- Git (for version control)

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/penny-more-dashboard.git
   cd penny-more-dashboard
   ```

2. **Install dependencies**
   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Environment Setup**
   Copy the committed template and set the backend API URL for this environment:
   ```bash
   cp .env.example .env.local
   ```

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:7070/api/v1
   ```

## 🚦 Available Scripts

In the project directory, you can run:

- `npm run dev` or `yarn dev`

  - Runs the app in development mode.
  - Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
  - The page will reload when you make changes.

- `npm run build` or `yarn build`

  - Builds the app for production to the `.next` folder.
  - It correctly bundles React in production mode and optimizes the build for the best performance.

- `npm start` or `yarn start`

  - Starts the production server.
  - The app will be served at [http://localhost:3000](http://localhost:3000)

- `npm run lint` or `yarn lint`
  - Runs ESLint to check for code quality issues.

## 🏗 Project Structure

```
.
├── app/                    # App router directory
│   ├── (admin)/            # Admin routes group
│   │   └── renters/        # Renters management section
│   │       └── page.tsx    # Renters page component
│   └── ...
├── components/             # Reusable UI components
│   ├── AdminNavbar.tsx     # Navigation bar for admin section
│   └── ...
├── public/                 # Static files
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
├── .eslintrc.json          # ESLint configuration
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🎨 Styling

This project uses:

- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide React](https://lucide.dev/) for icons
- Custom CSS modules for component-specific styles

## 📦 Dependencies

### Main Dependencies

- Next.js 13+
- React 18
- TypeScript
- Redux Toolkit (for state management)
- Axios (for API requests)
- Recharts (for data visualization)
- Lucide React (for icons)

### Development Dependencies

- ESLint
- Prettier
- Tailwind CSS
- PostCSS
- TypeScript types

## 🌐 Environment Variables

Create a `.env.local` file in the root directory from `.env.example`.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:7070/api/v1
```

| Variable | Required | Description | Where to get it |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Public base URL the dashboard uses for API calls. Include the API prefix, usually `/api/v1`. This value is exposed to the browser and must not contain secrets. | Use the deployed backend API domain plus the backend `BASE_URL` value. For local development, use `http://localhost:7070/api/v1`. |

Because this is a `NEXT_PUBLIC_` variable, Next.js reads it during the build and includes it in the browser bundle. Set it before running `pnpm build`, Docker builds, or production deployments.

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Other Platforms

You can also deploy to other platforms that support Next.js applications, such as:

- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Heroku](https://www.heroku.com/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Recharts Documentation](https://recharts.org/)
