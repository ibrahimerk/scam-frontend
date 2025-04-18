import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, User, Settings } from 'lucide-react';
import { api } from '@/lib/api';
import { Report } from '@/types';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const fetchedReports = await api.getReports();
        setReports(fetchedReports);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReports();
    }
  }, [user]);

  if (!user || loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="bg-brand-100 p-4 rounded-full mb-4">
                <User size={48} className="text-brand-600" />
              </div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              <div className="w-full border-t border-gray-200 my-4"></div>
              <div className="w-full space-y-3">
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <User size={18} className="mr-2" />
                    Profile Settings
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={18} className="mr-2" />
                  Account Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Your Reports</h3>
              <p className="text-3xl font-bold mb-4 text-brand-600">{reports.length}</p>
              {reports.length === 0 ? (
                <p className="text-gray-600 mb-4">You haven't submitted any scam reports yet.</p>
              ) : (
                <p className="text-gray-600 mb-4">You have submitted {reports.length} scam report(s).</p>
              )}
              <Link to="/report-scam">
                <Button className="w-full">Report a Scam</Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
              <div className="text-gray-600">
                {reports.length > 0 ? (
                  <ul className="space-y-2">
                    {reports.slice(0, 3).map(report => (
                      <li key={report.id} className="text-sm">
                        Reported: {report.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No recent activity to display.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold mb-4">Your Reported Scams</h3>
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-gray-500">
                      Reported on: {new Date(report.date_reported).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">You haven't reported any scams yet.</p>
                <Link to="/report-scam">
                  <Button>Report a Scam</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
            <AlertCircle size={24} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-blue-800 font-medium mb-1">Stay Informed</h4>
              <p className="text-blue-700">
                Browse the latest scam reports to stay informed about recent scam tactics and protect yourself.
              </p>
              <Link to="/reports" className="text-blue-800 font-medium underline mt-2 inline-block">
                View Latest Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
