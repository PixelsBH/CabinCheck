export default function Loading({isDark}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={isDark? "CClogoB.jpg": "CClogoW.jpg"}
          alt="Cabin Check Logo"
          className="w-36 mb-4"
        />
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Please wait...
        </p>
        <div className="w-12 h-12 border-4 border-t-transparent border-gray-700 dark:border-gray-200 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
