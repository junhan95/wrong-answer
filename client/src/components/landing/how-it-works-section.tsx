import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FileSpreadsheet,
  Table2,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PrefetchLink } from "@/components/prefetch-link";

export function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30" data-testid="section-how-it-works">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-semibold" data-testid="text-how-it-works-title">
            {t('landing.howItWorks.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.howItWorks.subtitle')}
          </p>
        </div>

        {/* Supported File Formats */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <FileText className="h-4 w-4 mr-2" /> PDF
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <FileText className="h-4 w-4 mr-2" /> Word (.docx)
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel (.xlsx)
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Table2 className="h-4 w-4 mr-2" /> CSV
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <FileText className="h-4 w-4 mr-2" /> Text (.txt)
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4" data-testid="step-1">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold">{t('landing.howItWorks.step1.title')}</h3>
            <p className="text-muted-foreground">{t('landing.howItWorks.step1.description')}</p>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center space-y-4" data-testid="step-2">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold">{t('landing.howItWorks.step2.title')}</h3>
            <p className="text-muted-foreground">{t('landing.howItWorks.step2.description')}</p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <ArrowRight className="h-8 w-8 text-muted-foreground rotate-90" />
        </div>

        <div className="max-w-md mx-auto mt-8">
          <div className="text-center space-y-4" data-testid="step-3">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold">{t('landing.howItWorks.step3.title')}</h3>
            <p className="text-muted-foreground">{t('landing.howItWorks.step3.description')}</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <PrefetchLink href="/login" data-testid="link-try-now">
            <Button size="lg" className="text-lg px-8">
              {t('landing.howItWorks.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </PrefetchLink>
        </div>
      </div>
    </section>
  );
}
