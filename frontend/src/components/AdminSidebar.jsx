import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiSettings,
  FiBarChart2,
  FiMessageSquare,
  FiPackage,
  FiChevronRight,
  FiChevronDown,
  FiGrid,
  FiBook,
  FiClock,
  FiHelpCircle,
  FiLifeBuoy,
  FiFileText,
  FiUserPlus,
  FiShield,
  FiActivity,
  FiHeart,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import { MdOutlineSportsGymnastics } from "react-icons/md";

function AdminSidebar({ isOpen }) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    users: true,
    instructors: true,
    classes: false,
    finance: false,
    reports: false,
  });

  // Determine user role based on URL path
  const getRole = () => {
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/gym-owner")) return "gym-owner";
    if (location.pathname.startsWith("/instructor")) return "instructor";
    return "admin";
  };

  const role = getRole();

  // Menu items for different roles
  const menuItems = {
    admin: [
      {
        title: "Dashboard",
        icon: FiHome,
        path: "/admin",
      },
      {
        title: "Instructors",
        icon: FiUserPlus,
        submenu: true,
        items: [
          { title: "Applications", path: "/admin/instructor-applications" },
          {
            title: "Verified Instructors",
            path: "/admin/verified-instructors",
          },
        ],
      },
      {
        title: "Users",
        icon: FiUsers,
        submenu: true,
        items: [
          { title: "All Users", path: "/admin/users" },
          { title: "Gym Owners", path: "/admin/users/gym-owners" },
          { title: "Customers", path: "/admin/users/customers" },
          { title: "Receptionists", path: "/admin/users/receptionists" },
        ],
      },
      {
        title: "Gym Registrations",
        icon: MdOutlineSportsGymnastics,
        path: "/admin/gym-registrations",
      },
      // {
      //   title: "Classes",
      //   icon: FiCalendar,
      //   submenu: true,
      //   items: [
      //     { title: "Schedule", path: "/admin/classes" },
      //     { title: "Add Class", path: "/admin/classes/add" },
      //   ],
      // },
      {
        title: "Finance",
        icon: FiDollarSign,
        submenu: true,
        items: [
          { title: "Payments", path: "/admin/finance" },
          // { title: "Invoices", path: "/admin/invoices" },
          // { title: "Subscriptions", path: "/admin/subscriptions" },
        ],
      },
      {
        title: "Reports",
        icon: FiBarChart2,
        submenu: true,
        items: [
          { title: "Analytics", path: "/admin/analytics" },
          { title: "Financial Reports", path: "/admin/reports/financial" },
          { title: "Member Reports", path: "/admin/reports/members" },
        ],
      },
      {
        title: "Messages",
        icon: FiMessageSquare,
        path: "/admin/messages",
        badge: "3",
      },
      {
        title: "Documents",
        icon: FiFileText,
        path: "/admin/documents",
      },
      {
        title: "Facilities",
        icon: FiFileText,
        path: "/admin/facilities",
      },
    ],
    "gym-owner": [
      {
        title: "Dashboard",
        icon: FiHome,
        path: "/gym-owner",
      },
      {
        title: "Members",
        icon: FiUsers,
        path: "/gym-owner/members",
      },
      {
        title: "Your Gym's Instructors",
        icon: FiUserPlus,
        path: "/gym-owner/instructors",
      },
      // {
      //   title: "Classes",
      //   icon: FiCalendar,
      //   path: "/gym-owner/classes",
      // },
      {
        title: "Apply to Instructor",
        icon: MdOutlineSportsGymnastics,
        path: "/gym-owner/apply-to-instructor",
      },
      {
        title: "Gym Requests",
        icon: FiCheckCircle,
        path: "/gym-owner/verify-reject-gym",
      },
      // {
      //   title: "Verify or Reject Instructors",
      //   icon: FiCheckCircle,
      //   path: "/gym-owner/verify-reject-instructor",
      // },
      {
        title: "Finance",
        icon: FiDollarSign,
        path: "/gym-owner/finance",
      },
      {
        title: "Reports",
        icon: FiBarChart2,
        path: "/gym-owner/reports",
      },
      {
        title: "Messages",
        icon: FiMessageSquare,
        path: "/gym-owner/messages",
        badge: "5",
      },
    ],
    instructor: [
      {
        title: "Dashboard",
        icon: FiHome,
        path: "/instructor",
      },
      {
        title: "My Classes",
        icon: FiCalendar,
        path: "/instructor/classes",
      },
      {
        title: "Students",
        icon: FiUsers,
        submenu: true,
        items: [
          { title: "Gym Students", path: "/instructor/gym-students" },
          {
            title: "Freelance Students",
            path: "/instructor/freelance-students",
          },
        ],
      },
      // {
      //   title: "Schedule",
      //   icon: FiClock,
      //   path: "/instructor/schedule",
      // },
      {
        title: "Workout Plans",
        icon: FiActivity,
        path: "/instructor/workout-plans",
      },
      {
        title: "Gym Requests",
        icon: MdOutlineSportsGymnastics,
        path: "/instructor/gym-requests",
      },
      {
        title: "Verify or Reject Gym",
        icon: FiCheckCircle,
        path: "/instructor/verify-reject-gym",
      },
      {
        title: "Messages",
        icon: FiMessageSquare,
        path: "/instructor/messages",
        badge: "2",
      },
    ],
  };

  const bottomMenuItems = [
    {
      title: "Settings",
      icon: FiSettings,
      path: `/${role}/settings`,
    },
    {
      title: "Help Center",
      icon: FiHelpCircle,
      path: `/${role}/help`,
    },
    {
      title: "Support",
      icon: FiLifeBuoy,
      path: `/${role}/support`,
    },
  ];

  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSubmenuActive = (items) => {
    return items.some((item) => location.pathname === item.path);
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gray-800/80 backdrop-blur-xl border-r border-gray-700/50 h-[calc(100vh-4rem)] flex flex-col transition-all duration-300`}
    >
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-1">
          {menuItems[role].map((item, index) => (
            <div key={index} className="py-1">
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title.toLowerCase())}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-all duration-300 ${
                      isSubmenuActive(item.items)
                        ? "bg-violet-500/10 text-violet-400"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 min-w-[1.25rem]" />
                      {isOpen && <span className="ml-3">{item.title}</span>}
                    </div>
                    {isOpen &&
                      (expandedMenus[item.title.toLowerCase()] ? (
                        <FiChevronDown className="h-4 w-4 transition-transform duration-200" />
                      ) : (
                        <FiChevronRight className="h-4 w-4 transition-transform duration-200" />
                      ))}
                  </button>
                  {isOpen && expandedMenus[item.title.toLowerCase()] && (
                    <div className="mt-2 space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className={`block pl-12 pr-4 py-2 rounded-lg text-sm ${
                            isActive(subItem.path)
                              ? "text-violet-400 bg-violet-500/10"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                          } transition-all duration-300`}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                    isActive(item.path)
                      ? "bg-violet-500/10 text-violet-400"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  } transition-all duration-300`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 min-w-[1.25rem]" />
                    {isOpen && <span className="ml-3">{item.title}</span>}
                  </div>
                  {isOpen && item.badge && (
                    <span className="bg-violet-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-gray-700/50">
          <nav className="space-y-1">
            {bottomMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isActive(item.path)
                    ? "bg-violet-500/10 text-violet-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                } transition-all duration-300`}
              >
                <item.icon className="h-5 w-5 min-w-[1.25rem]" />
                <span className="ml-3 text-sm">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
}

export default AdminSidebar;
