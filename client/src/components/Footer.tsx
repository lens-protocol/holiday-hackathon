import { Twitter, Github } from 'lucide-react';

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

interface SocialLinkProps {
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

const FooterSection = ({ title, children }: FooterSectionProps) => (
  <div className="space-y-4 z-0">
    <h3 className="text-white font-semibold">{title}</h3>
    <div className="space-y-3 z-0">
      {children}
    </div>
  </div>
);

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <a
    href={href}
    className="block text-gray-400 hover:text-white transition-colors opacity-50 z-0 cursor-not-allowed"
  >
    {children}
  </a>
);

const SocialLink = ({ href, icon: Icon }: SocialLinkProps) => (
  <a
    href={href}
    className="text-gray-400 hover:text-violet-400 transition-colors"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className="w-5 h-5" />
  </a>
);

const Footer = () => {
  return (
    <footer className="border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-violet-500 font-bold text-2xl">ResolutionDAO</h2>
            <p className="text-gray-400">
              Transform your resolutions into reality through blockchain-powered accountability.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#twitter" icon={Twitter} />
              <SocialLink href="https://github.com/ikunal-04/holiday-hackathon/tree/v1.0" icon={Github} />
            </div>
          </div>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <FooterLink href="#about">About Us</FooterLink>
            <FooterLink href="#how">How It Works</FooterLink>
            <FooterLink href="#challenges">Active Challenges</FooterLink>
            <FooterLink href="#community">Community</FooterLink>
          </FooterSection>

          {/* Resources */}
          <FooterSection title="Resources">
            <FooterLink href="#docs">Documentation</FooterLink>
            <FooterLink href="#blog">Blog</FooterLink>
            <FooterLink href="#whitepaper">Whitepaper</FooterLink>
            <FooterLink href="#faq">FAQ</FooterLink>
          </FooterSection>

          {/* Stay Updated */}
          {/* <div className="space-y-4">
            <h3 className="text-white font-semibold">Stay Updated</h3>
            <p className="text-gray-400">
              Get the latest updates and news directly to your inbox.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="submit"
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div> */}
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-800">
          <p className="text-gray-400">© 2025 ResolutionDAO. All rights reserved.</p>
          <div className="flex gap-6">
            <FooterLink href="#privacy">Privacy Policy</FooterLink>
            <FooterLink href="#terms">Terms of Service</FooterLink>
            <FooterLink href="#cookies">Cookie Policy</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;