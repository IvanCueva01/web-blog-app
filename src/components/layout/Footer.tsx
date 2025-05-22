import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Github, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  solutions: [
    { name: "Marketing", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Automation", href: "#" },
    { name: "Commerce", href: "#" },
    { name: "Insights", href: "#" },
  ],
  support: [
    { name: "Submit ticket", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "/posts" }, // Link to actual blog posts page
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
  ],
  legal: [
    { name: "Terms of service", href: "#" },
    { name: "Privacy policy", href: "#" },
    { name: "License", href: "#" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" }, // X icon might be an alternative if available and preferred
  { name: "Github", icon: Github, href: "#" },
  { name: "Youtube", icon: Youtube, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top section: Links and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Link Columns - Grouped for layout */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Solutions
              </h3>
              <ul className="space-y-3">
                {footerLinks.solutions.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-orange-500 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-orange-500 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-orange-500 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-orange-500 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1 mt-8 md:mt-0">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Subscribe to our newsletter
            </h3>
            <p className="mb-4 text-gray-400">
              The latest news, articles, and resources, sent to your inbox
              weekly.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <Input
                type="email"
                id="email-address"
                autoComplete="email"
                required
                className="w-full bg-slate-800 border-slate-700 placeholder-gray-500 text-white focus:ring-orange-500 focus:border-orange-500 min-w-0 flex-auto rounded-md px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:flex-none"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar: Copyright and Social links */}
        <div className="mt-12 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} DevLog. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
