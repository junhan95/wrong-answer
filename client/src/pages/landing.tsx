import { lazy, Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import {
  FolderTree,
  Menu,
  X,
  Download,
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
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running as installed PWA
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );

    const handler = (e: Event) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setPwaInstallPrompt(null);
      setIsStandalone(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleDownload = async () => {
    if (pwaInstallPrompt) {
      // PWA install prompt available → install app (creates desktop shortcut with icon)
      pwaInstallPrompt.prompt();
      const result = await pwaInstallPrompt.userChoice;
      if (result.outcome === "accepted") {
        setPwaInstallPrompt(null);
        setIsStandalone(true);
      }
    } else if (isStandalone) {
      // Already installed → just navigate to home
      window.location.href = "/";
    } else {
      // Fallback: open in standalone-like new window (simulates app experience)
      const width = 1200;
      const height = 800;
      const left = (screen.width - width) / 2;
      const top = (screen.height - height) / 2;
      window.open(
        window.location.origin + "/",
        "WiseQuery",
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
      );
    }
  };

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
            <Button data-testid="button-download" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              {t('landing.nav.download')}
            </Button>
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
              <Button className="w-full" onClick={() => { setMobileMenuOpen(false); handleDownload(); }}>
                <Download className="h-4 w-4 mr-2" />
                {t('landing.nav.download')}
              </Button>
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
