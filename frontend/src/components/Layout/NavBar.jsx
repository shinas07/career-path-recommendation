"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { cn } from "../lib/utils";
import api from "../../service/api";
import { toast } from "sonner";

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <HomeIcon className="w-4 h-4" />,
  },
  {
    name: "Career Analysis",
    // link: "/analysis",
    link:'/fileupload',
    icon: <ChartBarIcon className="w-4 h-4" />,
  },
];

export const FloatingNav = ({ className }) => {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious();

      if (scrollYProgress.get() <= 0.0) { setVisible(true); 

      } else {
        if (direction < 5) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  const handleLogout = async () => {
    try {
      const response = await api.post('auth/logout/', {
        refresh_token: localStorage.getItem('refresh_token'), // Include refresh token if needed
      });

      // Check if the response is successful
      if (response.status === 200) {
        // Remove the access and refresh tokens from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Show success toast
        toast.success("Successfully logged out!");

        // Redirect to the login page
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show an error toast
      toast.error("Logout failed. Please try again.");
    }
  };

  const isLoggedIn = !!localStorage.getItem('access_token'); // Check if the access token exists

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}>
        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            to={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}>
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="group relative border text-sm font-medium border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full overflow-hidden"
          >
            <span className="relative z-10">Logout</span>
            {/* Hover effect */}
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out group-hover:w-full" />
            {/* Bottom border gradient */}
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </button>
        ) : (
          <Link
            to="/login"
            className="group relative border text-sm font-medium border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full overflow-hidden"
          >
            <span className="relative z-10">Login</span>
            {/* Hover effect */}
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out group-hover:w-full" />
            {/* Bottom border gradient */}
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingNav;
