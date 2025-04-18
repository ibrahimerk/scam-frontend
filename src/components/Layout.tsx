
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ShieldAlert, User, LogOut, FileText, BarChart3 } from "lucide-react";

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ShieldAlert size={24} className="text-brand-600" />
              <span className="text-xl font-bold text-brand-800">Scam Guardian</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-brand-600">Home</Link>
              <Link to="/reports" className="text-gray-600 hover:text-brand-600">Reports</Link>
              <Link to="/report-scam" className="text-gray-600 hover:text-brand-600">Report Scam</Link>
              
              {user?.isAdmin && (
                <Link to="/admin" className="text-gray-600 hover:text-brand-600">Admin</Link>
              )}
            </nav>
            
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User size={18} />
                      <span>{user?.name}</span>
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={logout}>
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Scam Report Guardian</h3>
              <p className="text-gray-600">
                Helping protect internet users from scams and fraud through community reporting.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/" className="hover:text-brand-600">Home</Link></li>
                <li><Link to="/reports" className="hover:text-brand-600">Reports</Link></li>
                <li><Link to="/report-scam" className="hover:text-brand-600">Report a Scam</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-brand-600">Scam Prevention Tips</a></li>
                <li><a href="#" className="hover:text-brand-600">FAQ</a></li>
                <li><a href="#" className="hover:text-brand-600">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Scam Report Guardian. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
