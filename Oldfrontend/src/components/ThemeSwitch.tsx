import React from "react";
import {
  Dropdown,
  DropdownAction,
  DropdownContent,
  DropdownItem,
} from "keep-react";
import { MoonStars, SunDim } from "phosphor-react";
import { useTheme } from "./Theme-provider.tsx";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  // Fonction pour appliquer les thèmes au niveau de la classe body
  const handleThemeChange = (theme) => {
    setTheme(theme);

    // Appliquer la classe sur le `body` pour changer le fond
    document.body.classList.remove("light-theme", "dark-theme");
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else if (theme === "dark") {
      document.body.classList.add("dark-theme");
    }
  };

  return (
    <Dropdown placement="bottom-start">
      <DropdownAction asChild>
        <button className="rounded-lg bg-primary-25 p-2.5 dark:bg-white">
          <MoonStars size={20} color="#1C222B" className="hidden dark:block" />
          <SunDim size={20} color="#444" className="block dark:hidden" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownAction>
      <DropdownContent
        align="start"
        className="w-[180px] border border-metal-100 dark:border-metal-800 dark:bg-metal-900"
      >
        <DropdownItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownItem>
        <DropdownItem onClick={() => handleThemeChange("dark")}>
          Dark
          </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};

export default ThemeSwitcher;
