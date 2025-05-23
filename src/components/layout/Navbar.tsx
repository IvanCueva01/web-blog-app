import { useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  MenuIcon,
  SearchIcon,
  XIcon,
  LogOut,
  User,
  SettingsIcon,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavLinkItem {
  href: string;
  label: string;
}

const baseNavLinks: NavLinkItem[] = [
  { href: "/", label: "HOME" },
  { href: "/posts", label: "POSTS" },
  { href: "/features", label: "FEATURES" },
];

const getInitials = (name: string = "") => {
  const names = name.split(" ");
  let initials = names[0] ? names[0][0] : "";
  if (names.length > 1 && names[names.length - 1]) {
    initials += names[names.length - 1][0];
  }
  return initials.toUpperCase() || "U"; // Default to 'U' if no name
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout, loading } = useAuth();

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>,
    query: string
  ) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/posts?q=${encodeURIComponent(query.trim())}`);
      setSearchQuery("");
      if (isMobileMenuOpen) {
        setMobileSearchQuery("");
        setIsMobileMenuOpen(false);
      }
    }
  };

  const dynamicNavLinks: NavLinkItem[] = currentUser
    ? [...baseNavLinks, { href: "/my-works", label: "MY WORKS" }]
    : baseNavLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={
        isScrolled
          ? "fixed top-0 left-0 right-0 bg-slate-900 bg-opacity-30 z-50 text-gray-300 p-4 md:p-6 transition-all duration-300 ease-in-out"
          : "absolute top-0 left-0 right-0 z-50 text-gray-300 p-4 md:p-6"
      }
    >
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to="/" className="text-2xl font-bold">
          (D) <span className="font-normal">DevLog</span>
        </NavLink>

        <nav className="hidden md:flex items-center space-x-6">
          {dynamicNavLinks.map((link: NavLinkItem) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500"
                  : "hover:text-orange-500 transition-colors"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <form
            onSubmit={(e) => handleSearchSubmit(e, searchQuery)}
            className="relative"
          >
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-white hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500 text-white placeholder-gray-400 pr-10 h-9 text-sm"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </form>
          {!loading && currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-2 h-9 text-white hover:bg-slate-700 hover:text-orange-500"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={currentUser.avatar_url || undefined}
                      alt={currentUser.username}
                    />
                    <AvatarFallback className="text-slate-900">
                      {getInitials(currentUser.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">
                    {currentUser.username}
                  </span>
                  <ChevronDown className="h-4 w-4 hidden sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-slate-800 border-slate-700 text-gray-200"
                align="end"
              >
                <DropdownMenuLabel className="font-normal flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={currentUser.avatar_url || undefined}
                      alt={currentUser.username}
                    />
                    <AvatarFallback className="text-slate-900">
                      {getInitials(currentUser.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.username}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  asChild
                  className="text-orange-500 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white cursor-pointer"
                >
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="text-orange-500 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white cursor-pointer"
                >
                  <Link to="/settings" className="flex items-center">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !loading && (
              <>
                <Button
                  onClick={() => navigate("/auth?view=login")}
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm h-9"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/auth?view=signup")}
                  variant="default"
                  className="bg-orange-500 text-white hover:bg-white text-sm h-9 border-orange-500 hover:text-orange-500 hover:border-orange-600"
                >
                  Sign Up
                </Button>
              </>
            )
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isMobileMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-slate-900 text-white p-6 flex flex-col"
            >
              <div className="flex flex-col space-y-6 flex-grow">
                <Link
                  to="/"
                  className="text-2xl font-bold self-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  (D) <span className="font-normal">DevLog</span>
                </Link>
                {/* Mobile User Info and Actions */}
                {!loading && currentUser && (
                  <div className="pt-4 pb-2 border-b border-t border-gray-700 mb-4 flex flex-col">
                    <div className="flex items-center space-x-3 px-1 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={currentUser.avatar_url || undefined}
                          alt={currentUser.username}
                        />
                        <AvatarFallback className="text-slate-900">
                          {getInitials(currentUser.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-medium leading-none text-white">
                          {currentUser.username}
                        </p>
                        <p className="text-sm leading-none text-gray-400 mt-1">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `block w-full text-left py-2 px-3 text-lg rounded-md hover:bg-slate-700 hover:text-orange-500 transition-colors ${
                            isActive ? "text-orange-500" : ""
                          }`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="mr-2 h-5 w-5 inline-block" /> Profile
                      </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                          `block w-full text-left py-2 px-3 text-lg rounded-md hover:bg-slate-700 hover:text-orange-500 transition-colors ${
                            isActive ? "text-orange-500" : ""
                          }`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <SettingsIcon className="mr-2 h-5 w-5 inline-block" />{" "}
                        Settings
                      </NavLink>
                    </SheetClose>
                  </div>
                )}

                <nav className="flex flex-col space-y-4">
                  {dynamicNavLinks.map((link: NavLinkItem) => (
                    <SheetClose asChild key={link.label}>
                      <NavLink
                        to={link.href}
                        className={({ isActive }) =>
                          `text-lg py-2 transition-colors ${
                            isActive
                              ? "text-orange-500"
                              : "hover:text-orange-500"
                          }`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>
              </div>
              <div className="mt-auto space-y-4 pt-6 border-t border-gray-700">
                {!loading && currentUser ? (
                  <Button
                    onClick={handleLogout} // handleLogout already closes sheet
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white w-full flex items-center justify-center space-x-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Button>
                ) : (
                  !loading && (
                    <>
                      <Button
                        onClick={() => {
                          navigate("/auth?view=login");
                          setIsMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white w-full"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => {
                          navigate("/auth?view=signup");
                          setIsMobileMenuOpen(false);
                        }}
                        variant="default"
                        className="bg-orange-500 text-white hover:bg-orange-600 w-full border-orange-500 hover:border-orange-600"
                      >
                        Sign Up
                      </Button>
                    </>
                  )
                )}
                <form
                  onSubmit={(e) => handleSearchSubmit(e, mobileSearchQuery)}
                  className="relative"
                >
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    className="bg-slate-800 border-slate-700 focus:ring-orange-500 w-full pr-10"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <SearchIcon className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
