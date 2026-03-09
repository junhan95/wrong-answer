import { lazy, Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  FolderTree,
  Brain,
  Search,
  Bolt,
  Shield,
  GitBranch,
  Star,
  BookOpen,
  Briefcase,
  GraduationCap,
  Upload,
  FileText,
  Table2,
  FileSpreadsheet,
  Globe,
  Lock,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "react-i18next";
import { PrefetchLink } from "@/components/prefetch-link";
import { useSearch, useLocation } from "wouter";
import { SectionSkeleton } from "@/components/landing/section-skeleton";

const FAQSection = lazy(() => import("@/components/landing/faq-section"));

export default function Landing() {
  const { t } = useTranslation();
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    if (params.get('scrollToBottom') === 'true') {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
        setLocation('/', { replace: true });
      }, 50);
    }
  }, [searchString, setLocation]);

  return (
    <div className="min-h-screen">
      <SEO path="/" />
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12">
          <a
            href="#"
            className="flex items-center gap-2 hover-elevate px-2 py-1 rounded-md"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            data-testid="link-logo-home"
          >
            <FolderTree className="h-6 w-6" />
            <span className="text-xl font-semibold">{t('landing.nav.appName')}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-features">
              {t('landing.nav.features')}
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-how-it-works">
              {t('landing.nav.howItWorks')}
            </a>
            <a href="#pricing" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-pricing">
              {t('landing.nav.pricing')}
            </a>
            <ThemeToggle />
            <LanguageToggle />
            <PrefetchLink href="/login" data-testid="link-sign-in">
              <Button variant="ghost" data-testid="button-sign-in">{t('landing.nav.signIn')}</Button>
            </PrefetchLink>
            <PrefetchLink href="/login" data-testid="link-get-started">
              <Button data-testid="button-get-started">{t('landing.nav.getStarted')}</Button>
            </PrefetchLink>
          </nav>
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('landing.nav.features')}
            </a>
            <a href="#how-it-works" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('landing.nav.howItWorks')}
            </a>
            <a href="#pricing" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('landing.nav.pricing')}
            </a>
            <div className="flex items-center gap-3 py-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <PrefetchLink href="/login">
                <Button variant="ghost" className="w-full justify-start">{t('landing.nav.signIn')}</Button>
              </PrefetchLink>
              <PrefetchLink href="/login">
                <Button className="w-full">{t('landing.nav.getStarted')}</Button>
              </PrefetchLink>
            </div>
          </div>
        )}
      </header>

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

      {/* How It Works Section (with file format badges) */}
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

      {/* Features Section */}
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

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 lg:py-32 bg-muted/30" data-testid="section-use-cases">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-semibold" data-testid="text-use-cases-title">
              {t('landing.useCases.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.useCases.subtitle')}
            </p>
          </div>
          <div className="space-y-20">
            {/* Research & Learning */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" data-testid="use-case-knowledge">
              <div className="space-y-4">
                <h3 className="text-3xl font-semibold">{t('landing.useCases.knowledge.title')}</h3>
                <p className="text-lg text-muted-foreground">
                  {t('landing.useCases.knowledge.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.knowledge.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.knowledge.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.knowledge.benefit3')}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-8 border">
                <div className="space-y-3 text-sm">
                  <div className="font-medium text-muted-foreground">{t('landing.useCases.knowledge.projectsLabel')}</div>
                  <div className="pl-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{t('landing.useCases.knowledge.researchPapers')}</span>
                    </div>
                    <div className="pl-6 space-y-1 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        {t('landing.useCases.knowledge.mlSurvey')}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        {t('landing.useCases.knowledge.ragReview')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{t('landing.useCases.knowledge.clientProjects')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{t('landing.useCases.knowledge.courseNotes')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business & Consulting */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" data-testid="use-case-development">
              <div className="order-2 lg:order-1 bg-muted/50 rounded-lg p-8 border">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-muted-foreground">{t('landing.useCases.development.demoLabel')}</div>
                  <div className="bg-background rounded p-3 text-sm">
                    "{t('landing.useCases.development.demoQuery')}"
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <GitBranch className="h-3 w-3" />
                    <span>{t('landing.useCases.development.demoContext')}</span>
                  </div>
                  <div className="bg-primary/10 rounded p-3 text-sm">
                    {t('landing.useCases.development.demoAnswer')}
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-4">
                <h3 className="text-3xl font-semibold">{t('landing.useCases.development.title')}</h3>
                <p className="text-lg text-muted-foreground">
                  {t('landing.useCases.development.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.development.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.development.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.development.benefit3')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Creative & Content (fixed visualization) */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" data-testid="use-case-team">
              <div className="space-y-4">
                <h3 className="text-3xl font-semibold">{t('landing.useCases.team.title')}</h3>
                <p className="text-lg text-muted-foreground">
                  {t('landing.useCases.team.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.team.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.team.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.team.benefit3')}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-8 border">
                <div className="space-y-4">
                  <div className="font-medium">{t('landing.useCases.team.projectLabel')}</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between bg-background rounded p-3">
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4" />
                        <span>{t('landing.useCases.team.project1')}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t('landing.useCases.team.project1Detail')}</span>
                    </div>
                    <div className="flex items-center justify-between bg-background rounded p-3">
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4" />
                        <span>{t('landing.useCases.team.project2')}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t('landing.useCases.team.project2Detail')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Security Section (moved before Pricing) */}
      <section className="py-20 lg:py-32" data-testid="section-data-security">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-semibold" data-testid="text-security-title">
              {t('landing.dataSecurity.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.dataSecurity.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover-elevate text-center" data-testid="card-security-encryption">
              <CardHeader>
                <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl">{t('landing.dataSecurity.encryption.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('landing.dataSecurity.encryption.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center" data-testid="card-security-retention">
              <CardHeader>
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl">{t('landing.dataSecurity.retention.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('landing.dataSecurity.retention.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center" data-testid="card-security-isolation">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl">{t('landing.dataSecurity.isolation.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('landing.dataSecurity.isolation.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-muted/30" data-testid="section-testimonials">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-semibold" data-testid="text-testimonials-title">
              {t('landing.testimonials.title')}
            </h2>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-medium">{t('landing.testimonials.rating')}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card data-testid="testimonial-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                    {t('landing.testimonials.alex.name').charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{t('landing.testimonials.alex.name')}</div>
                    <div className="text-sm text-muted-foreground">{t('landing.testimonials.alex.role')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "{t('landing.testimonials.alex.quote')}"
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardFooter>
            </Card>

            <Card data-testid="testimonial-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                    {t('landing.testimonials.maria.name').charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{t('landing.testimonials.maria.name')}</div>
                    <div className="text-sm text-muted-foreground">{t('landing.testimonials.maria.role')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "{t('landing.testimonials.maria.quote')}"
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardFooter>
            </Card>

            <Card data-testid="testimonial-3">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                    {t('landing.testimonials.david.name').charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{t('landing.testimonials.david.name')}</div>
                    <div className="text-sm text-muted-foreground">{t('landing.testimonials.david.role')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "{t('landing.testimonials.david.quote')}"
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

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

      {/* FAQ Section - Lazy Loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <FAQSection />
      </Suspense>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32" data-testid="section-final-cta">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold" data-testid="text-final-cta-title">
              {t('landing.finalCta.title')}
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.finalCta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrefetchLink href="/login" data-testid="link-final-cta-primary">
                <Button size="lg" className="text-lg px-12 py-6 h-auto" data-testid="button-final-cta">
                  {t('landing.finalCta.button')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </PrefetchLink>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>{t('landing.hero.noCreditCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>{t('landing.finalCta.setupTime')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>{t('landing.finalCta.cancelAnytime')}</span>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border/50 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground mb-3">{t('landing.newsletter.label')}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t('landing.newsletter.placeholder')}
                  className="flex-1 px-4 py-2 rounded-md border bg-background text-sm"
                  data-testid="input-newsletter-email"
                />
                <Button variant="outline" size="sm" data-testid="button-newsletter-submit">
                  {t('landing.newsletter.button')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 lg:py-16" data-testid="section-footer">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FolderTree className="h-6 w-6" />
                <span className="text-xl font-semibold">{t('landing.nav.appName')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('landing.footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.product')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-features">{t('landing.footer.features')}</a></li>
                <li><PrefetchLink href="/pricing" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-pricing">{t('landing.footer.pricing')}</PrefetchLink></li>
                <li><PrefetchLink href="/changelog" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-changelog">{t('landing.footer.changelog')}</PrefetchLink></li>
                <li><PrefetchLink href="/docs" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-docs">{t('landing.footer.documentation')}</PrefetchLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.company')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><PrefetchLink href="/about" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-about">{t('landing.footer.about')}</PrefetchLink></li>
                <li><PrefetchLink href="/blog" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-blog">{t('landing.footer.blog')}</PrefetchLink></li>
                <li><PrefetchLink href="/careers" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-careers">{t('landing.footer.careers')}</PrefetchLink></li>
                <li><PrefetchLink href="/contact" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-contact">{t('landing.footer.contact')}</PrefetchLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><PrefetchLink href="/privacy" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-privacy">{t('landing.footer.privacy')}</PrefetchLink></li>
                <li><PrefetchLink href="/terms" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-terms">{t('landing.footer.terms')}</PrefetchLink></li>
                <li><PrefetchLink href="/security" className="hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-footer-security">{t('landing.footer.security')}</PrefetchLink></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t('landing.footer.copyright')}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/junhan95/Wisequery" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" data-testid="link-social-github">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" data-testid="link-social-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" data-testid="link-social-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
