import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-calm">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-ocean-deep">404</h1>
        <p className="mb-4 text-xl text-ocean-medium">Oops! This tide took you off course</p>
        <a href="/" className="text-primary underline hover:text-primary-glow transition-colors">
          Return to TaskTide
        </a>
      </div>
    </div>
  );
};

export default NotFound;
