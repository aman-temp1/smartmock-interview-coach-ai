
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, X } from "lucide-react";
import FormField from "./FormField";

interface ResumeUploadSectionProps {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
}

const ResumeUploadSection = ({
  resumeFile,
  setResumeFile
}: ResumeUploadSectionProps) => {
  const { toast } = useToast();

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setResumeFile(file);
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully",
      });
    }
  };

  const removeResume = () => {
    setResumeFile(null);
  };

  return (
    <FormField label="Resume (Optional)" htmlFor="resume-upload">
      <div className="space-y-3">
        {!resumeFile ? (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center transition-all duration-300 hover:border-brand-300 hover:bg-brand-50/50 animate-fade-in">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2 transition-colors duration-200" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload your resume for better interview context
            </p>
            <label htmlFor="resume-upload" className="cursor-pointer">
              <Button 
                type="button" 
                variant="outline" 
                className="transition-all duration-200 hover:scale-105"
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                Choose File
              </Button>
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Supports PDF, DOC, DOCX (max 10MB)
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200 animate-scale-in">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">{resumeFile.name}</span>
              <span className="text-xs text-green-600 ml-2">
                ({(resumeFile.size / 1024 / 1024).toFixed(1)}MB)
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeResume}
              className="text-green-600 hover:text-green-800 hover:bg-green-100 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1 transition-colors duration-200">
        Your resume will help the AI interviewer ask more relevant questions based on your background.
      </p>
    </FormField>
  );
};

export default ResumeUploadSection;
