import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, FileUp, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ScamReportFormData } from '@/types';
import { api } from '@/lib/api';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters long' }),
  scamType: z.string().min(1, { message: 'Please select a scam type' }),
  scamUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  amount: z.number().positive({ message: 'Amount must be a positive number' }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ReportScam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      scamType: '',
      scamUrl: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please log in to submit a scam report.',
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Transform data to match the backend Report model
      const reportData = {
        title: data.title,
        description: data.description,
        scam_type: data.scamType,
        location: 'Unknown', // Required field in backend
        evidence: data.scamUrl || '',
        contact_info: data.amount ? `Amount lost: $${data.amount}` : '',
        is_verified: false
      };

      console.log('Sending report data:', reportData); // Debug log
      const response = await api.createReport(reportData);
      
      toast({
        title: 'Report submitted',
        description: 'Your scam report has been submitted successfully.',
      });
      
      navigate(`/reports/${response.id}`);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const scamTypes = [
    'Phishing',
    'Online Shopping Scam',
    'Investment Fraud',
    'Romance Scam',
    'Tech Support Scam',
    'Employment Scam',
    'Cryptocurrency Scam',
    'Identity Theft',
    'Lottery/Prize Scam',
    'Fake Charity',
    'Other'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Report a Scam</h1>
          <p className="text-gray-600">
            Share your experience to help others avoid similar scams
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
          <div className="flex items-start p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-blue-800 font-medium mb-1">Why report scams?</h4>
              <p className="text-blue-700 text-sm">
                Your report helps others avoid falling victim to the same scam. It also helps authorities
                track and take action against scammers. All personal information will be kept confidential.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Scam Title *
              </label>
              <Input
                id="title"
                placeholder="E.g., Fake Online Store Scam"
                {...register('title')}
                className={errors.title ? 'border-red-300' : ''}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="scamType" className="block text-sm font-medium text-gray-700 mb-1">
                Scam Type *
              </label>
              <select
                id="scamType"
                {...register('scamType')}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.scamType ? 'border-red-300' : ''
                }`}
              >
                <option value="">Select a scam type</option>
                {scamTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.scamType && (
                <p className="mt-1 text-sm text-red-600">{errors.scamType.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe your experience with the scam in detail..."
                {...register('description')}
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.description ? 'border-red-300' : ''
                }`}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Include details like how you were contacted, what was promised, and any warning signs you noticed.
              </p>
            </div>
            
            <div>
              <label htmlFor="scamUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Scam Website or Link (Optional)
              </label>
              <Input
                id="scamUrl"
                placeholder="E.g., https://fake-website.com"
                {...register('scamUrl')}
                className={errors.scamUrl ? 'border-red-300' : ''}
              />
              {errors.scamUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.scamUrl.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount Lost
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount in USD"
                {...register('amount', { valueAsNumber: true })}
                className={errors.amount ? 'border-red-300' : ''}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Evidence Files (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileUp className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Screenshots, emails, or documents (Max 5MB each)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
                  <ul className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-yellow-800 font-medium mb-1">Important Notice</h4>
                <p className="text-yellow-700 text-sm">
                  By submitting this report, you confirm that the information provided is accurate to the best
                  of your knowledge. False reporting is prohibited and may have legal consequences.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
            <div className="flex justify-center mt-10">
  <form action="https://www.paypal.com/donate" method="post" target="_top">
    <input type="hidden" name="business" value="C9A942AUE8HLW" />
    <input type="hidden" name="no_recurring" value="0" />
    <input type="hidden" name="currency_code" value="USD" />
    <input
      type="image"
      src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
      style={{ border: 0 }}
      name="submit"
      title="PayPal - The safer, easier way to pay online!"
      alt="Donate with PayPal button"
    />
    <img
      alt=""
      style={{ border: '0' }}
      src="https://www.paypal.com/en_US/i/scr/pixel.gif"
      width="1"
      height="1"
    />
    <h3 className="text-center text-lg font-semibold mb-2">
  Thanks For All Your Help! ❤️
</h3>
  </form>
</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportScam;
