import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/posts", label: "POSTS" },
  { href: "/works", label: "WORKS" },
  { href: "/features", label: "FEATURES" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

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
          {navLinks.map((link) => (
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
                <NavLink
                  to="/"
                  className="text-2xl font-bold self-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  (W) <span className="font-normal">the blog</span>
                </NavLink>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
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
