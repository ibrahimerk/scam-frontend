import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertOctagon, CalendarClock, DollarSign } from 'lucide-react';
import { api } from '@/lib/api';
import { Report } from '@/types';

const ScamReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.getReports();
        setReports(data);
        setFilteredReports(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setFilteredReports(reports);
      return;
    }
    
    const filtered = reports.filter(report => 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.scam_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredReports(filtered);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Scam Reports</h1>
          <p className="text-gray-600">Browse reports submitted by users in our community</p>
        </div>
        
        <Link to="/report-scam">
          <Button className="mt-4 md:mt-0">
            <AlertOctagon size={18} className="mr-2" />
            Report a Scam
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>
      
      <div className="space-y-6">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <div key={report.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-brand-800">
                  <Link to={`/reports/${report.id}`} className="hover:underline">
                    {report.title}
                  </Link>
                </h2>
                {report.is_verified && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Verified
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <AlertOctagon size={16} className="mr-1" />
                  <span>{report.scam_type}</span>
                </div>
                <div className="flex items-center">
                  <CalendarClock size={16} className="mr-1" />
                  <span>{new Date(report.date_reported).toLocaleDateString()}</span>
                </div>
                {report.contact_info && report.contact_info.includes('Amount lost') && (
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-1" />
                    <span>{report.contact_info}</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-2">{report.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Location: {report.location}
                </div>
                <Link to={`/reports/${report.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all reports</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScamReports;
