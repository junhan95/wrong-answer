import { lazy, Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import {
  CheckSquare,
  Menu,
  X,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { PrefetchLink } from "@/components/prefetch-link";
import { useSearch, useLocation } from "wouter";
import { SectionSkeleton } from "@/components/landing/section-skeleton";
import { HeroSection } from "@/components/landing/hero-section";
import { AgitationSection } from "@/components/landing/agitation-section";
import { CauseSection } from "@/components/landing/cause-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { LandingFooter } from "@/components/landing/landing-footer";

const FAQSection = lazy(() => import("@/components/landing/faq-section"));

export default function Landing() {
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
        "오답노트",
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
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">오답노트</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors hover:text-primary">
              기능 소개
            </a>
            <a href="#pricing" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors hover:text-primary">
              요금 안내
            </a>
            <PrefetchLink href="/login" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors hover:text-primary">
              로그인
            </PrefetchLink>
            <div className="flex items-center gap-2 ml-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            <PrefetchLink href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-md transition-transform hover:scale-105">
                무료로 시작하기
              </Button>
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
              기능 소개
            </a>
            <a href="#pricing" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              요금 안내
            </a>
            <PrefetchLink href="/login">
              <a className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                로그인
              </a>
            </PrefetchLink>
            <div className="flex items-center gap-3 py-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            <div className="pt-4 border-t">
              <PrefetchLink href="/login">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md" onClick={() => setMobileMenuOpen(false)}>
                  무료로 시작하기
                </Button>
              </PrefetchLink>
            </div>
          </div>
        )}
      </header>

      <HeroSection />
      <AgitationSection />
      <CauseSection />
      <SolutionSection />
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
