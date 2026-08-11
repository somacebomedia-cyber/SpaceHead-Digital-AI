import { useState } from "react";
import { Code, BookOpen, User, LayoutDashboard, LogOut, Menu, X, Layers, Briefcase, Mail } from "lucide-react";
import SpaceHeadLogo from "./SpaceHeadLogo";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

export default function Navbar({ currentTab, onTabChange, user, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Layers },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "projects", label: "Portfolio", icon: Code },
    { id: "blogs", label: "Blog", icon: BookOpen },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <nav id="app-navbar" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <button 
              id="nav-logo-btn"
              onClick={() => { onTabChange("home"); setIsMobileMenuOpen(false); }}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md py-1 px-2"
              aria-label="SpaceHead AI Home"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <SpaceHeadLogo size={40} className="text-purple-600 hover:scale-105 transition-transform" />
              </div>
              <span className="font-sans font-bold text-lg tracking-tight text-slate-900">
                SpaceHead <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">AI</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="h-4 w-[1px] bg-slate-200 mx-2" />

            {user ? (
              <div className="flex items-center space-x-3 pl-2">
                <button
                  id="nav-item-admin"
                  onClick={() => onTabChange("admin")}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 ${
                    currentTab === "admin"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <div className="flex items-center space-x-2 bg-slate-50 rounded-full pl-2 pr-4 py-1 border border-slate-100">
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold font-mono">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                    {user.email}
                  </span>
                  <button
                    id="nav-btn-logout"
                    onClick={onLogout}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-100 transition-colors"
                    title="Log Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="nav-item-auth"
                onClick={() => onTabChange("auth")}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 ${
                  currentTab === "auth"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-item-${item.id}`}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2.5 w-full px-4 py-3 rounded-lg font-sans text-base font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="h-[1px] bg-slate-100 my-2" />

          {user ? (
            <div className="space-y-2 pt-1">
              <button
                id="mobile-nav-item-admin"
                onClick={() => {
                  onTabChange("admin");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2.5 w-full px-4 py-3 rounded-lg font-sans text-base font-medium transition-colors ${
                  currentTab === "admin"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </button>
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
                <button
                  id="mobile-btn-logout"
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              id="mobile-nav-item-auth"
              onClick={() => {
                onTabChange("auth");
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2.5 w-full px-4 py-3 rounded-lg font-sans text-base font-medium transition-colors ${
                currentTab === "auth"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Sign In Workspace</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
