
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <Link 
          to="/" 
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-gradient-to-br from-dpc-pink to-dpc-coral hover:opacity-90 transition-opacity"
          )}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
