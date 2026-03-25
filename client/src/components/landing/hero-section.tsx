import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  BookOpen,
  MessageCircle,
  Sparkles,
  Users,
  FileText,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PrefetchLink } from "@/components/prefetch-link";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden" data-testid="section-hero">
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-emerald-400/8 blur-3xl" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: 텍스트 */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight" data-testid="text-hero-title">
                  {t('landing.hero.title')}
                  <br />
                  <span className="text-primary">{t('landing.hero.titleLine2')}</span>
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

            {/* Right: AI 챗봇 목업 */}
            <div className="relative" data-testid="container-hero-image">
              <div className="bg-card border rounded-2xl p-5 shadow-xl space-y-4">
                {/* 헤더바 */}
                <div className="flex items-center gap-2 pb-3 border-b">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{t('landing.hero.demoSubject')}</span>
                  <span className="ml-auto text-xs text-green-500 font-medium">● AI 분석 중</span>
                </div>

                {/* 채팅 대화 */}
                <div className="space-y-3 min-h-[140px]">
                  {/* 학생 질문 */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm max-w-[85%]">
                      {t('landing.hero.demoChatUser')}
                    </div>
                  </div>

                  {/* AI 응답 */}
                  <div className="flex gap-2 items-end">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm max-w-[85%] leading-relaxed">
                      {t('landing.hero.demoChatAI')}
                    </div>
                  </div>
                </div>

                {/* 유사 문제 버튼 */}
                <div className="pt-1">
                  <button className="w-full py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors border border-primary/20">
                    {t('landing.hero.demoSimilarBtn')} →
                  </button>
                </div>
              </div>

              {/* 플로팅 카드 */}
              <div className="absolute -bottom-4 -left-4 bg-card border shadow-lg rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-primary" />
                3개 유사 문제 준비됨
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
