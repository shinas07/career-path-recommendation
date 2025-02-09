import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import FloatingNav from '../components/Layout/NavBar';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CareerButton from '../components/CareerButton';

// Enhanced Card Component with animations
const Card = motion(React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border-2 bg-opacity-20 backdrop-blur-lg text-card-foreground shadow-2xl ${className}`}
    {...props}
  />
)));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

const FileUploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState({
    gradeCard: null,
    certifications: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Animation variants
  const cardVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    drag: { scale: 1.05 }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const validateFile = (file, type) => {
    const allowedTypes = ['application/json', 'text/csv'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [type]: 'Only JSON/CSV files allowed' }));
      return false;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, [type]: 'Max file size 5MB' }));
      return false;
    }

    setErrors(prev => ({ ...prev, [type]: undefined }));
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e, type) => {
    handleFiles(e.target.files, type);
  };

  const handleFiles = (files, type) => {
    Array.from(files).forEach(file => {
      const fileType = type || (file.name.toLowerCase().includes('grade') ? 'gradeCard' : 'certifications');
      if (validateFile(file, fileType)) {
        setFiles(prev => ({ ...prev, [fileType]: file }));
        toast.success(`${file.name} uploaded successfully!`);
      }
    });
  };

  const removeFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setErrors(prev => ({ ...prev, [type]: undefined }));
  };

  const handleSubmit = async () => {
    if (!files.gradeCard || !files.certifications) {
      toast.error('Please upload both files to continue');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('gradeCard', files.gradeCard);
    formData.append('certifications', files.certifications);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post("http://localhost:8000/api/upload-documents/", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success('Analysis complete! Redirecting...');
        setTimeout(() => navigate('/career-recommendations'), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-opacity-95 bg-grid-white/[0.02] relative p-8 flex flex-col items-center justify-center">
      {/* Add subtle animated gradient overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0A0A0A] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <FloatingNav />
      
      <div className="max-w-4xl w-full mt-32 space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-400 to-blue-600 bg-clip-text text-transparent mb-4">
            Career Path Analyzer
          </h1>
          <p className="text-gray-400 text-lg">
            Upload your academic records to discover your perfect career path
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {['gradeCard', 'certifications'].map((type) => (
            <Card
              key={type}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className={`bg-black/40 backdrop-blur-sm border ${
                errors[type] ? 'border-red-500' : 'border-gray-800'
              } hover:border-gray-700 transition-colors duration-300`}
            >
              <CardContent className="relative">
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <button 
                    onClick={() => removeFile(type)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="group relative">
                    <Info className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-help" />
                    <div className="hidden group-hover:block absolute right-0 w-64 p-3 bg-gray-800 rounded-lg text-sm text-gray-300 shadow-xl">
                      {type === 'gradeCard' 
                        ? 'Upload your subject-wise scores (CSV/JSON format)'
                        : 'Upload certifications/completed courses (CSV/JSON format)'}
                    </div>
                  </div>
                </div>

                <div
                  className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all
                    ${dragActive ? 'border-blue-400 bg-black/50' : 'border-gray-800'} 
                    ${files[type] ? 'bg-green-900/20 border-green-500/50' : ''}
                    hover:bg-gray-900/30 transition-all duration-300`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id={type}
                    className="hidden"
                    accept=".csv,.json"
                    onChange={(e) => handleFileSelect(e, type)}
                  />
                  <label
                    htmlFor={type}
                    className="cursor-pointer block"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <AnimatePresence mode='wait'>
                        {files[type] ? (
                          <motion.div
                            key="uploaded"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full"
                          >
                            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                            <div className="space-y-2">
                              <p className="text-white font-medium truncate">{files[type].name}</p>
                              <p className="text-gray-400 text-sm">
                                {(files[type].size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <div className="animate-pulse">
                              <Upload className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                            </div>
                            <p className="text-xl font-semibold text-gray-200">
                              {type === 'gradeCard' ? 'Grade Card' : 'Certifications'}
                            </p>
                            <p className="text-gray-400 mt-2">Drag & Drop or Click to Upload</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </label>

                  <AnimatePresence>
                    {errors[type] && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 flex items-center justify-center text-red-400 text-sm"
                      >
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {errors[type]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleSubmit}
            disabled={!files.gradeCard || !files.certifications || isSubmitting}
            className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all
              ${
                (files.gradeCard && files.certifications) 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/20'
                : 'bg-gray-900 text-gray-500 cursor-not-allowed border border-gray-800'
              }
              ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Analyzing...
              </div>
            ) : (
              <>
                Continue to Analysis
                <span className="absolute -right-4 -top-4 bg-white text-blue-600 px-3 py-1 rounded-full text-sm shadow-md">
                  {files.gradeCard && files.certifications ? '✨ Ready!' : '2 Files'}
                </span>
              </>
            )}
          </button>
        </motion.div>

        {/* Add divider and CareerButton */}
        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-[#0A0A0A] text-gray-400 text-sm">or view existing analysis</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CareerButton />
        </motion.div>
      </div>
    </div>
  );
};

export default FileUploadSection;