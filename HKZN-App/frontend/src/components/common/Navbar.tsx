import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import Logo from './Logo';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import useAuth from '@/contexts/auth/useAuth'; // Corrected import path

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  // Use updated auth context values
  const { user, loading, logout, isAdmin, isAgent } = useAuth(); // Replaced profile, signOut with user, loading, logout

  // Define links in the desired display order
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    // Placeholder for Services dropdown
    { name: 'Services', type: 'dropdown' }, 
    { name: 'Contact', path: '/contact' },
  ];

  const serviceLinks = [
    { name: 'Web Design', path: '/web-design' },
    { name: 'Hosting', path: '/hosting' },
    { name: 'Cloud Services', path: '/cloud-services' },
    { name: 'Connectivity', path: '/connectivity' },
    { name: 'Email & Automation', path: '/email-automation' },
    { name: 'Fibre Prepaid', path: '/fibre-prepaid' },
    { name: 'Security', path: '/security' },
    { name: 'VPN Services', path: '/vpn-services' },
    { name: 'Solar Solutions', path: '/solar-solutions' },
    { name: 'Microsoft Business', path: '/microsoft-business' }, // Added link
    { name: 'VoIP', path: '/voip' }, // Added link
    { name: 'IT Support', path: '/it-support' }, // Added link
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          
          <nav className="hidden md:flex space-x-8 items-center"> {/* Added items-center */}
            {navLinks.map((link) => {
              if (link.type === 'dropdown') {
                // Render Services Dropdown
                return (
                  <DropdownMenu key="services-dropdown">
                    <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-hosting-orange text-hosting-dark-gray flex items-center">
                      Services <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white w-56 z-[100]">
                      <DropdownMenuGroup>
                        {serviceLinks.map((service) => (
                          <DropdownMenuItem key={service.path} asChild>
                            <Link 
                              to={service.path}
                              className={`w-full px-2 py-2 hover:bg-gray-100 ${
                                location.pathname === service.path
                                  ? 'text-hosting-orange'
                                  : 'text-hosting-dark-gray'
                              }`}
                            >
                              {service.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              } else {
                // Render regular links
                return (
                  <Link
                    key={link.path}
                    to={link.path!} // Added non-null assertion as path is guaranteed here
                    className={`text-sm font-medium transition-colors hover:text-hosting-orange ${
                      location.pathname === link.path
                        ? 'text-hosting-orange'
                        : 'text-hosting-dark-gray'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }
            })}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* Use placeholder initials or generic icon if name isn't available */}
                  <Button variant="ghost" className="relative flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground">
                     {user?.email?.charAt(0).toUpperCase() || <User size={18} />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="font-normal">
                      {/* Display email as primary identifier for now */}
                      <p className="text-sm font-medium leading-none">
                        {user?.email}
                      </p>
                      {/* Display role from user object */}
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {/* Use isAdmin/isAgent flags from the updated context */}
                    {/* Link to the external backend dashboard URL */}
                    {isAdmin ? (
                      <DropdownMenuItem asChild>
                        {/* Use <a> tag for external link */}
                        <a href="http://localhost:5173/admin" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center w-full">
                          <User className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </a>
                      </DropdownMenuItem>
                    ) : isAgent ? ( // Use isAgent flag from context
                      <DropdownMenuItem asChild>
                         {/* Use <a> tag for external link */}
                        <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center w-full">
                          <User className="mr-2 h-4 w-4" />
                          <span>Agent Dashboard</span>
                        </a>
                      </DropdownMenuItem>
                    ) : null /* Add case for regular 'user' if needed */}
                    <DropdownMenuSeparator />
                    {/* Call the logout function from the context */}
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative flex items-center justify-center mr-2 h-8 w-8 rounded-full bg-primary text-primary-foreground">
                     {user?.email?.charAt(0).toUpperCase() || <User size={14} />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                   <DropdownMenuLabel>
                     <div className="font-normal">
                      <p className="text-sm font-medium leading-none">{user?.email}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.role}</p>
                    </div>
                   </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     {/* Link to the external backend dashboard URL */}
                     {isAdmin ? (
                      <DropdownMenuItem asChild>
                        <a href="http://localhost:5173/admin" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center w-full">
                          <User className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </a>
                      </DropdownMenuItem>
                    ) : isAgent ? ( // Use isAgent flag from context
                       <DropdownMenuItem asChild>
                         <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center w-full">
                          <User className="mr-2 h-4 w-4" />
                          <span>Agent Dashboard</span>
                        </a>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-hosting-dark-gray" />
              ) : (
                <Menu className="h-6 w-6 text-hosting-dark-gray" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md animate-fade-in">
          <div className="container mx-auto py-4">
            <nav className="flex flex-col space-y-4">
              {/* Mobile Nav - Keep original logic for simplicity or refactor similarly if needed */}
              {navLinks.filter(link => link.type !== 'dropdown').map((link) => (
                <Link
                  key={link.path}
                  to={link.path!} // Added non-null assertion
                  className={`text-base py-2 px-4 transition-colors ${
                    location.pathname === link.path
                      ? 'text-hosting-orange font-medium'
                      : 'text-hosting-dark-gray'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="px-4 py-2"> {/* Keep Services dropdown separate in mobile */}
                <h3 className="text-base font-medium text-hosting-dark-gray mb-2">Services</h3>
                <div className="pl-4 flex flex-col space-y-2">
                  {serviceLinks.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className={`text-sm py-1 transition-colors ${
                        location.pathname === service.path
                          ? 'text-hosting-orange font-medium'
                          : 'text-hosting-dark-gray'
                      }`}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {!user && (
                <div className="flex flex-col space-y-2 px-4 pt-2">
                  <Link
                    to="/auth/login"
                    className="w-full py-2 px-4 text-center rounded-md border border-gray-300 text-hosting-dark-gray"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="w-full py-2 px-4 text-center rounded-md bg-hosting-orange text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
