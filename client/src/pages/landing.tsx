import { lazy, Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import {
  FolderTree,
  Menu,
  X,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "react-i18next";
import { PrefetchLink } from "@/components/prefetch-link";
import { useSearch, useLocation } from "wouter";
import { SectionSkeleton } from "@/components/landing/section-skeleton";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { LandingFooter } from "@/components/landing/landing-footer";

const FAQSection = lazy(() => import("@/components/landing/faq-section"));

export default function Landing() {
  const { t } = useTranslation();
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <PricingSection />

      {/* FAQ Section - Lazy Loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <FAQSection />
      </Suspense>

      <LandingFooter />
    </div>
  );
}
