import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  FolderTree,
  GitBranch,
  Star,
  Users,
  FileText,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PrefetchLink } from "@/components/prefetch-link";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32" data-testid="section-hero">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-hero-title">
                  {t('landing.hero.title')}
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground max-w-xl" data-testid="text-hero-subtitle">
                  {t('landing.hero.subtitle')}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <PrefetchLink href="/login" data-testid="link-hero-cta-primary">
                  <Button size="lg" className="text-lg px-8" data-testid="button-start-free">
                    {t('landing.hero.startTrial')}
                  </Button>
                </PrefetchLink>
                <a href="#how-it-works" data-testid="link-hero-cta-secondary">
                  <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-watch-demo">
                    {t('landing.hero.watchDemo')}
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{t('landing.hero.noCreditCard')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{t('landing.hero.freeForever')}</span>
                </div>
              </div>
            </div>
            <div className="relative" data-testid="container-hero-image">
              <div className="bg-card border rounded-lg p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FolderTree className="h-4 w-4" />
                    <span>{t('landing.hero.demoProject')}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      {t('landing.hero.demoQuestion')}
                    </div>
                    <div className="bg-primary/10 rounded-lg p-4 space-y-2">
                      <p className="text-sm">{t('landing.hero.demoAnswer')}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          <GitBranch className="h-3 w-3 mr-1" />
                          {t('landing.hero.demoContext')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <section className="py-8 border-y bg-muted/30" data-testid="section-social-proof">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <div className="text-2xl font-bold">{t('landing.socialProof.users')}</div>
                <div className="text-sm text-muted-foreground">{t('landing.socialProof.usersLabel')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <div className="text-2xl font-bold">{t('landing.socialProof.documents')}</div>
                <div className="text-sm text-muted-foreground">{t('landing.socialProof.documentsLabel')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <div className="text-2xl font-bold">{t('landing.socialProof.queries')}</div>
                <div className="text-sm text-muted-foreground">{t('landing.socialProof.queriesLabel')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-semibold">{t('landing.socialProof.rating')}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
