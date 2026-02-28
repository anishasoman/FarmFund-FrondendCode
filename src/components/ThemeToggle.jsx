
import { HiSun, HiMoon } from "react-icons/hi";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg bg-amber-100 dark:bg-gray-800
                 text-amber-600 dark:text-amber-400
                 hover:scale-105 transition"
    >
      {dark ? <HiSun size={20} /> : <HiMoon size={20} />}
    </button>
  );
};
