import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  FileText,
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

        {/* Supported Input Formats */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Camera className="h-4 w-4 mr-2" /> 사진 촬영 (OCR)
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <FileText className="h-4 w-4 mr-2" /> 텍스트 직접 입력
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <FileText className="h-4 w-4 mr-2" /> PDF / Word 업로드
          </Badge>
        </div>

        {/* 4-Step Grid */}
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { key: 'step1', num: 1, testId: 'step-1' },
            { key: 'step2', num: 2, testId: 'step-2' },
            { key: 'step3', num: 3, testId: 'step-3' },
            { key: 'step4', num: 4, testId: 'step-4' },
          ].map((step, idx) => (
            <div key={step.key} className="relative">
              <div className="text-center space-y-4" data-testid={step.testId}>
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold">{t(`landing.howItWorks.${step.key}.title`)}</h3>
                <p className="text-muted-foreground text-sm">{t(`landing.howItWorks.${step.key}.description`)}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:flex absolute top-8 -right-3 z-10">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
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
