import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { HiArrowLeft } from "react-icons/hi";
import pnf from '../assets/pnf.png'
export default function PageNotFound() {
  return (
    <section className="max-h-screen flex flex-col items-center justify-center px-6 py-10 bg-gray-50 dark:bg-gray-900">
      

      <img
        src={pnf}
        alt="Not Found"
        className="w-85 max-w-md select-none"
      />

      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-green-700 dark:text-green-400">
        404
      </h1>
      
      {/* Subtitle */}
      <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white ">
        Page Not Found
      </p>

      <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md text-center">
        The page you're looking for seems to have wandered off the farm.  
        Let’s get you back to fresh produce & smart farming!
      </p>

      {/* Button */}
      <Link to="/" className="mt-6">
        <Button
          color="success"
          size="lg"
          className="flex items-center gap-2 px-6 py-2  dark:text-white rounded-full shadow-md hover:scale-105 transition-all"
        >
          <HiArrowLeft size={20} />
          Go Back Home
        </Button>
      </Link>
    </section>
  );
}
