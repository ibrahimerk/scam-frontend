import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertOctagon,
  CalendarClock,
  DollarSign,
  Link as LinkIcon,
  User,
  Flag,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Report } from '@/types';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(0);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!id) return;
        const data = await api.getReport(parseInt(id));
        setReport(data);
        setHelpfulCount(0); // You might want to add a field for this in your backend
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load report details');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error || !report) {
    return <div className="container mx-auto px-4 py-8">Error: {error || 'Report not found'}</div>;
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setCommentSubmitted(true);
      setComment('');
      // TODO: Implement comment submission to backend when the feature is added
    }
  };
  
  const handleMarkHelpful = () => {
    if (!helpful) {
      setHelpful(true);
      setHelpfulCount(prevCount => prevCount + 1);
    } else {
      setHelpful(false);
      setHelpfulCount(prevCount => prevCount - 1);
    }
    // TODO: Implement helpful marking in backend when the feature is added
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/reports" className="inline-flex items-center text-brand-600 hover:text-brand-800 mb-4">
          <ArrowLeft size={18} className="mr-1" />
          Back to Reports
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{report.title}</h1>
          
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            {report.is_verified && (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Verified Report
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
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
              {report.evidence && (
                <div className="flex items-center">
                  <LinkIcon size={16} className="mr-1" />
                  <a href={report.evidence} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    View Evidence
                  </a>
                </div>
              )}
            </div>
            
            <div className="prose max-w-none mb-6">
              <p>{report.description}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant={helpful ? "default" : "outline"} 
                onClick={handleMarkHelpful}
                className={helpful ? "bg-brand-600 hover:bg-brand-700" : ""}
              >
                <ThumbsUp size={18} className="mr-2" />
                Helpful {helpfulCount > 0 && `(${helpfulCount})`}
              </Button>
              
              <Button variant="outline">
                <Flag size={18} className="mr-2" />
                Report Issue
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <MessageCircle size={20} className="mr-2" />
              Comments {commentSubmitted && '(1)'}
            </h3>
            
            <form onSubmit={handleSubmitComment} className="mb-6">
              <Input
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-2"
              />
              <Button type="submit" size="sm">Post Comment</Button>
            </form>
            
            {commentSubmitted && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <div className="bg-brand-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <User size={20} className="text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">You</h4>
                      <span className="text-xs text-gray-500">Just now</span>
                    </div>
                    <p className="text-gray-700 text-sm">Your comment has been submitted and is pending review.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Report Information</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                <p className="text-gray-800">{report.location}</p>
              </div>
              {report.contact_info && !report.contact_info.includes('Amount lost') && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                  <p className="text-gray-800">{report.contact_info}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
