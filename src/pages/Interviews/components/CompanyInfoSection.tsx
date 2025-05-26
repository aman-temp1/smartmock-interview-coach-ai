
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormField from "./FormField";

interface CompanyInfoSectionProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  companyDescription: string;
  setCompanyDescription: (value: string) => void;
}

const CompanyInfoSection = ({
  companyName,
  setCompanyName,
  companyDescription,
  setCompanyDescription
}: CompanyInfoSectionProps) => {
  return (
    <>
      <FormField label="Company Name" htmlFor="company-name">
        <Input
          id="company-name"
          placeholder="e.g. Google, Microsoft, Startup Inc."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="transition-all duration-200 hover:border-brand-200 focus:scale-[1.01]"
        />
      </FormField>

      <FormField label="Company Description" htmlFor="company-description">
        <Textarea
          id="company-description"
          placeholder="Brief description of the company, its mission, products, or culture..."
          className="min-h-[80px] transition-all duration-200 hover:border-brand-200 focus:scale-[1.01]"
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1 transition-colors duration-200">
          Adding company details helps the interviewer ask questions about company fit and culture.
        </p>
      </FormField>
    </>
  );
};

export default CompanyInfoSection;
