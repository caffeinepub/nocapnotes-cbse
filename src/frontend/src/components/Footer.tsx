import { Link } from "@tanstack/react-router";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/app-icon.dim_512x512.png"
                alt="NoCapNotes icon"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <span className="font-extrabold text-white text-sm tracking-tight">
                NoCapNotes
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              CBSE Class 8 notes, no cap. Free notes, study guides, and exam
              papers to slay your exams. 🔥
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Subjects
            </h3>
            <ul className="space-y-2">
              {[
                "Mathematics",
                "Science",
                "English",
                "Social Studies",
                "Hindi",
                "Computers",
              ].map((s) => (
                <li key={s}>
                  <Link
                    to="/subjects"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" as const },
                { label: "Sample Papers", to: "/papers" as const },
                { label: "Search", to: "/search" as const },
                { label: "Admin", to: "/admin" as const },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Vibe With Us
            </h3>
            <div className="flex gap-3">
              {[
                {
                  Icon: SiFacebook,
                  label: "Facebook",
                  href: "https://facebook.com",
                },
                { Icon: SiX, label: "X", href: "https://x.com" },
                {
                  Icon: SiInstagram,
                  label: "Instagram",
                  href: "https://instagram.com",
                },
                {
                  Icon: SiYoutube,
                  label: "YouTube",
                  href: "https://youtube.com",
                },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-white/50 text-sm">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
