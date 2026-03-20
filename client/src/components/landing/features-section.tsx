import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  Search,
  Bolt,
  Shield,
  FolderTree,
  GitBranch,
  Globe,
  Upload,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-20 lg:py-32" data-testid="section-features">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-semibold" data-testid="text-features-title">
            {t('landing.features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        {/* Core Features (4 large cards) */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="hover-elevate" data-testid="card-feature-rag">
            <CardHeader>
              <Brain className="h-12 w-12 mb-4 text-primary" />
              <CardTitle className="text-xl">{t('landing.features.rag.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {t('landing.features.rag.description')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-feature-organization">
            <CardHeader>
              <FolderTree className="h-12 w-12 mb-4 text-primary" />
              <CardTitle className="text-xl">{t('landing.features.explorer.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {t('landing.features.explorer.description')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-feature-search">
            <CardHeader>
              <Search className="h-12 w-12 mb-4 text-primary" />
              <CardTitle className="text-xl">{t('landing.features.search.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {t('landing.features.search.description')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-feature-multimodal">
            <CardHeader>
              <GitBranch className="h-12 w-12 mb-4 text-primary" />
              <CardTitle className="text-xl">{t('landing.features.multimodal.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {t('landing.features.multimodal.description')}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Features (compact) */}
        <h3 className="text-center text-lg font-medium text-muted-foreground mb-6">
          {t('landing.features.moreTitle')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Bolt, key: 'streaming' },
            { icon: Shield, key: 'security' },
            { icon: Globe, key: 'multilingual' },
            { icon: Upload, key: 'dragdrop' },
          ].map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-center gap-3 p-4 rounded-lg border bg-card hover-elevate">
              <Icon className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{t(`landing.features.${key}.title`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
