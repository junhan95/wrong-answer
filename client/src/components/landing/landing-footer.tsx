import { Button } from "@/components/ui/button";
import {
  Check,
  CheckSquare,
  ArrowRight,
  Github,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PrefetchLink } from "@/components/prefetch-link";

export function LandingFooter() {
  const { t } = useTranslation();

  return (
    <>
      {/* Final CTA Section */}
      <section className="py-24 lg:py-32 bg-primary/5 border-t" data-testid="section-final-cta">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight" data-testid="text-final-cta-title">
              틀린 이유 속에 <span className="text-primary">정답이 있습니다.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              더 이상 같은 문제를 틀리지 마세요.<br />
              지금 바로 나만의 AI 오답노트를 만드세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <PrefetchLink href="/login" data-testid="link-final-cta-primary">
                <Button size="lg" className="text-xl font-bold px-12 py-8 h-auto shadow-xl hover:scale-105 transition-transform" data-testid="button-final-cta">
                  무료로 AI 오답노트 시작하기
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </PrefetchLink>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground font-medium pt-8">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>신용카드 불필요</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>3초만에 카카오/구글 로그인</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>평생 무료 체험 제공</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 lg:py-16 bg-white dark:bg-slate-950" data-testid="section-footer">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-7 w-7 text-primary" />
                <span className="text-2xl font-bold tracking-tight">오답노트 AI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                모든 학생이 흔들림 없이 목표에<br />
                도달할 수 있도록 돕습니다.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">서비스</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors inline-block" data-testid="link-footer-features">기능 소개</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors inline-block" data-testid="link-footer-pricing">요금 안내</a></li>
                <li><PrefetchLink href="/changelog" className="hover:text-primary transition-colors inline-block" data-testid="link-footer-changelog">업데이트 노트</PrefetchLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">고객 지원</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><PrefetchLink href="/contact" className="hover:text-primary transition-colors inline-block" data-testid="link-footer-contact">1:1 문의</PrefetchLink></li>
                <li><a href="#faq" className="hover:text-primary transition-colors inline-block" data-testid="link-footer-faq">자주 묻는 질문 (FAQ)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">법적 고지</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><PrefetchLink href="/terms" className="hover:text-primary transition-colors inline-block" data-testid="link-footer-terms">이용약관</PrefetchLink></li>
                <li><PrefetchLink href="/privacy" className="hover:text-primary transition-colors inline-block font-semibold text-foreground" data-testid="link-footer-privacy">개인정보처리방침</PrefetchLink></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 오답노트 AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/junhan95/wrong-answer" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
