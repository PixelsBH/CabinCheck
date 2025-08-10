import { NavLink } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The page you are looking for does not exist.</p>
        <NavLink to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Go back to Home
        </NavLink>
      </div>
    </div>
  );
}