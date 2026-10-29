import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdHome,
  MdPerson,
  MdWork,
  MdBusiness,
  MdArticle,
  MdReviews,
  MdDescription,
  MdMiscellaneousServices, // 👈 NEW
  MdLibraryBooks,
} from "react-icons/md";
import { ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

const navItems = [
  // { name: "Home", icon: <MdHome />, path: "/" },
  {
    name: "Features",            // 👈 NEW
    icon: <MdMiscellaneousServices />,
    path: "/mainservices",
  },
  { 
    name: "Services", 
    icon: <MdWork />, 
    path: "/services" 
  },
  { name: "FAQ", icon: <MdArticle />, path: "/faq" },

  {
    name: "Reviews",
    icon: <MdReviews />,
    path: "/reviews",
  },
  {
    name: "Blogs",
    icon: <MdLibraryBooks />,
    path: "/blogs",
  },
  { name: "Contact", icon: <MdDescription />, path: "/form" },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();

  // order nav items alphabetically by name
  function getSortedNavItems(items) {
    return [...items].sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const isActive = useCallback(
    (path) => path === "/" ? location.pathname === "/" : location.pathname === path || location.pathname.startsWith(path + "/"),
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : navItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prev) => (prev && prev.index === index ? null : { index }));
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-[100000] mt-0 flex h-[100dvh] flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0   ${
        isExpanded || isMobileOpen
          ? "w-[min(310px,85vw)] lg:w-[290px]"
          : isHovered
          ? "w-[min(310px,85vw)] lg:w-[290px]"
          : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex shrink-0 items-center justify-center py-7 lg:py-8">
        <button type="button" aria-label="Close sidebar" onClick={toggleMobileSidebar}
          className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 lg:hidden">
          <span className="text-2xl leading-none">←</span>
        </button>
        <Link to="/" onClick={() => { if (isMobileOpen) toggleMobileSidebar(); }}>
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className
                src="/images/logo/dolphin.svg"
                alt="logo2"
                width={90}
                height={35}
              />
            </>
          ) : (
            <img
              src="/images/logo/dolphin.svg"
              alt="logo2"
              width={150}
              height={120}
            />
          )}
        </Link>
      </div>

      <nav className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto pb-8 duration-300 ease-linear">
        <ul className="flex flex-col gap-4">
          {getSortedNavItems(navItems).map((nav, index) => (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={() => handleSubmenuToggle(index)}
                  className={`menu-item group ${
                    openSubmenu?.index === index
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  } cursor-pointer ${
                    !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      openSubmenu?.index === index
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                        openSubmenu?.index === index ? "text-brand-500 rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    onClick={() => { if (isMobileOpen) toggleMobileSidebar(); }}
                    className={`menu-item group ${
                      isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                    }`}
                  >
                    <span
                      className={`menu-item-icon-size ${
                        isActive(nav.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )
              )}

              {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    display: openSubmenu?.index === index ? "block" : "none",
                  }}
                >
                  <ul className="mt-2 ml-9 space-y-1">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="ml-auto flex items-center gap-1">
                            {subItem.new && (
                              <span className="menu-dropdown-badge">new</span>
                            )}
                            {subItem.pro && (
                              <span className="menu-dropdown-badge">pro</span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </nav>
    </aside>
  );
};

export default AppSidebar;
