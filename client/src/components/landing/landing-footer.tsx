import { Button } from "@/components/ui/button";
import {
  Check,
  BookOpen,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PrefetchLink } from "@/components/prefetch-link";

export function LandingFooter() {
  const { t } = useTranslation();

  return (
    <>
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
                <BookOpen className="h-6 w-6" />
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
    </>
  );
}
