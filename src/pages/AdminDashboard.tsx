
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, Users, FileText, AlertTriangle, UserCog, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for admin dashboard
const mockStats = {
  totalReports: 156,
  pendingReports: 23,
  totalUsers: 482,
  flaggedUsers: 5
};

const mockRecentReports = [
  { id: '1', title: 'Fake Online Shopping Website', status: 'pending', date: '2025-04-10', reporter: 'jane_smith' },
  { id: '2', title: 'Bitcoin Investment Scheme', status: 'verified', date: '2025-04-09', reporter: 'john_doe' },
  { id: '3', title: 'Tech Support Phone Scam', status: 'pending', date: '2025-04-08', reporter: 'mike_jones' },
  { id: '4', title: 'Fake Job Offer', status: 'rejected', date: '2025-04-07', reporter: 'sarah_williams' },
  { id: '5', title: 'Phishing Email Claiming to be from Bank', status: 'pending', date: '2025-04-06', reporter: 'robert_brown' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReports, setFilteredReports] = useState(mockRecentReports);

  useEffect(() => {
    // Redirect if not admin
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Filter reports based on search term
    if (searchTerm.trim() === '') {
      setFilteredReports(mockRecentReports);
    } else {
      const filtered = mockRecentReports.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporter.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  }, [searchTerm]);

  if (!user?.isAdmin) {
    return null; // Don't render anything if not an admin
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage reports, users, and system settings</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <h3 className="text-3xl font-bold text-gray-800">{mockStats.totalReports}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Reports</p>
              <h3 className="text-3xl font-bold text-gray-800">{mockStats.pendingReports}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-800">{mockStats.totalUsers}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Flagged Users</p>
              <h3 className="text-3xl font-bold text-gray-800">{mockStats.flaggedUsers}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Reports</h2>
              <div className="w-1/3">
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{report.reporter}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{report.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${report.status === 'verified' ? 'bg-green-100 text-green-800' : 
                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button size="sm" variant="outline" className="mr-2">View</Button>
                        {report.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="mr-2">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredReports.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No reports found matching your search.
              </div>
            )}
            
            <div className="mt-4 text-right">
              <Button variant="outline">View All Reports</Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start pb-4 border-b border-gray-200">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <UserCog className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">User <span className="font-medium">robert_brown</span> submitted a new report</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start pb-4 border-b border-gray-200">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">Admin <span className="font-medium">admin_user</span> verified a report</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start pb-4 border-b border-gray-200">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">Admin <span className="font-medium">admin_user</span> rejected a report</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Button variant="outline">View All Activity</Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full justify-start">
                <FileText className="mr-2 h-5 w-5" />
                Manage Reports
              </Button>
              <Button className="w-full justify-start">
                <Users className="mr-2 h-5 w-5" />
                Manage Users
              </Button>
              <Button className="w-full justify-start">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Server Status</span>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Database</span>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">API Status</span>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Storage</span>
                  <span className="text-sm font-medium text-yellow-600">72% Used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Notes</h2>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500" 
              rows={4}
              placeholder="Add notes for other admins..."
            ></textarea>
            <div className="mt-4 text-right">
              <Button>Save Notes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
