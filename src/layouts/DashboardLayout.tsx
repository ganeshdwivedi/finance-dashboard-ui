import { useAppSelector, useAppDispatch } from "../store/hooks";
import { toggleSidebar, toggleTheme, setRole } from "../store/slices/appSlice";
import { Menu, Sun, Moon, LayoutDashboard, Receipt } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const {
    sidebarOpen: isSidebarOpen,
    theme,
    role,
  } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: Receipt },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar Backdrop (Mobile Only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0 w-64 shadow-2xl md:shadow-none" : "-translate-x-full md:translate-x-0 md:w-20"}
          ${!isSidebarOpen && "md:w-20"}
          md:relative md:translate-x-0 ${isSidebarOpen ? "md:w-64" : "md:w-20"}
          bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col
        `}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl text-slate-800 dark:text-white transition-opacity duration-300">
                FinDash
              </span>
            )}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100"
                  }`
                }
                title={!isSidebarOpen ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-10 transition-colors duration-300">
          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Role Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              {(["Viewer", "Admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => dispatch(setRole(r))}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    role === r
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

            {/* User Avatar */}
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold shadow-sm">
                JD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  John Doe
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-none">
                  {role}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
