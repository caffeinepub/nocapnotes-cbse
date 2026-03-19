import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const isLoggedIn = loginStatus === "success" && !!identity;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate({ to: "/search", search: { q: searchQ.trim() } });
      setSearchQ("");
    }
  };

  const navLinks = [
    { to: "/" as const, label: "Home" },
    { to: "/subjects" as const, label: "Subjects" },
    { to: "/papers" as const, label: "Sample Papers" },
    { to: "/admin" as const, label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/app-icon.dim_512x512.png"
              alt="NoCapNotes icon"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="font-extrabold text-sm sm:text-base tracking-tight nocapnotes-gradient">
              NoCapNotes
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{
                  className: "text-sm font-semibold text-primary",
                }}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search... fr fr 🔍"
                className="pl-3 pr-9 py-1.5 text-sm border border-border rounded-full w-44 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                data-ocid="nav.search_input"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                className="rounded-full border-border text-sm"
                data-ocid="nav.logout_button"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => login()}
                  className="rounded-full border-border text-sm"
                  data-ocid="nav.login_button"
                >
                  Student Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => login()}
                  className="rounded-full bg-primary text-white text-sm hover:bg-primary/90"
                  data-ocid="nav.signup_button"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-2 py-1.5 text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clear()}
                  className="rounded-full text-sm"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => login()}
                    className="rounded-full text-sm"
                  >
                    Student Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => login()}
                    className="rounded-full text-sm"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
