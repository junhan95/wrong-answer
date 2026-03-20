import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PrefetchLink } from "@/components/prefetch-link";

export function PricingSection() {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <>
      {/* Competitor Comparison Section */}
      <section className="py-20 lg:py-32 bg-muted/30" data-testid="section-comparison">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-4xl font-semibold" data-testid="text-comparison-title">
              {t('landing.comparison.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('landing.comparison.subtitle')}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">{t('landing.comparison.feature')}</th>
                        <th className="text-center p-4 font-semibold">WiseQuery</th>
                        <th className="text-center p-4 font-semibold text-muted-foreground">{t('landing.comparison.generalAI')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['context', 'projectOrg', 'docAnalysis', 'semanticSearch', 'dataRetention', 'privacy'].map((key) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="p-4 font-medium">{t(`landing.comparison.rows.${key}`)}</td>
                          <td className="p-4 text-center">
                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                          </td>
                          <td className="p-4 text-center text-muted-foreground">
                            {t(`landing.comparison.general.${key}`)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section (with annual toggle) */}
      <section id="pricing" className="py-20 lg:py-32" data-testid="section-pricing">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-semibold" data-testid="text-pricing-title">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('landing.pricing.subtitle')}
            </p>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('landing.pricing.monthly')}
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('landing.pricing.yearly')}
              <Badge className="ml-2 text-xs">{t('landing.pricing.savePercent')}</Badge>
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <Card data-testid="pricing-free">
              <CardHeader>
                <CardTitle className="text-xl">{t('landing.pricing.free.title')}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{t('landing.pricing.free.price')}</span>
                  <span className="text-muted-foreground">{t('landing.pricing.free.period')}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.free.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.free.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.free.feature3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.free.feature4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t('landing.pricing.free.retention')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <PrefetchLink href="/pricing" className="w-full" data-testid="link-pricing-free">
                  <Button variant="outline" className="w-full" data-testid="button-pricing-free">
                    {t('landing.pricing.free.cta')}
                  </Button>
                </PrefetchLink>
              </CardFooter>
            </Card>

            {/* Basic (Most Popular) */}
            <Card className="border-primary relative" data-testid="pricing-basic">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t('landing.pricing.basic.badge')}</Badge>
              <CardHeader>
                <CardTitle className="text-xl">{t('landing.pricing.basic.title')}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {isYearly ? t('landing.pricing.basic.yearlyPrice') : t('landing.pricing.basic.price')}
                  </span>
                  <span className="text-muted-foreground">{t('landing.pricing.basic.period')}</span>
                  {isYearly && (
                    <div className="text-xs text-muted-foreground mt-1">{t('landing.pricing.billedAnnually')}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.basic.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.basic.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.basic.feature3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.basic.feature4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t('landing.pricing.basic.retention')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <PrefetchLink href="/pricing" className="w-full" data-testid="link-pricing-basic">
                  <Button className="w-full" data-testid="button-pricing-basic">
                    {t('landing.pricing.basic.cta')}
                  </Button>
                </PrefetchLink>
              </CardFooter>
            </Card>

            {/* Pro */}
            <Card data-testid="pricing-pro">
              <CardHeader>
                <CardTitle className="text-xl">{t('landing.pricing.pro.title')}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {isYearly ? t('landing.pricing.pro.yearlyPrice') : t('landing.pricing.pro.price')}
                  </span>
                  <span className="text-muted-foreground">{t('landing.pricing.pro.period')}</span>
                  {isYearly && (
                    <div className="text-xs text-muted-foreground mt-1">{t('landing.pricing.billedAnnually')}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.pro.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.pro.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.pro.feature3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.pro.feature4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.pro.feature5')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.pro.feature6')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t('landing.pricing.pro.retention')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <PrefetchLink href="/pricing" className="w-full" data-testid="link-pricing-pro">
                  <Button variant="outline" className="w-full" data-testid="button-pricing-pro">
                    {t('landing.pricing.pro.cta')}
                  </Button>
                </PrefetchLink>
              </CardFooter>
            </Card>

            {/* Custom */}
            <Card data-testid="pricing-custom">
              <CardHeader>
                <CardTitle className="text-xl">{t('landing.pricing.custom.title')}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{t('landing.pricing.custom.price')}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.custom.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.custom.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.custom.feature3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.custom.feature4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{t('landing.pricing.custom.feature5')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t('landing.pricing.custom.retention')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <PrefetchLink href="/contact" className="w-full" data-testid="link-pricing-custom">
                  <Button variant="outline" className="w-full" data-testid="button-pricing-custom">
                    {t('landing.pricing.custom.cta')}
                  </Button>
                </PrefetchLink>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
