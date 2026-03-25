import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, MessageCircle, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PrefetchLink } from "@/components/prefetch-link";

export function SolutionSection() {
  const { t } = useTranslation();

  return (
    <section
      className="py-20 lg:py-32 relative overflow-hidden"
      data-testid="section-solution"
      style={{
        background: "linear-gradient(135deg, hsl(var(--primary)/0.06) 0%, hsl(172 60% 50%/0.08) 100%)",
      }}
    >
      {/* 배경 장식 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-8 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-8 w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: AI 챗봇 목업 */}
          <div className="relative" data-testid="solution-mockup">
            <div className="bg-card border rounded-2xl shadow-xl p-6 space-y-4 max-w-sm mx-auto lg:mx-0">
              {/* 헤더 */}
              <div className="flex items-center gap-2 pb-3 border-b">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">AI 오답노트 튜터</span>
                <span className="ml-auto text-xs text-green-500 font-medium">● 온라인</span>
              </div>

              {/* 채팅 UI */}
              <div className="space-y-3">
                {/* 학생 메시지 */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%]">
                    {t('landing.hero.demoChatUser')}
                  </div>
                </div>

                {/* AI 응답 */}
                <div className="flex gap-2 items-end">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[80%] leading-relaxed">
                    {t('landing.hero.demoChatAI')}
                  </div>
                </div>

                {/* 유사 문제 버튼 */}
                <div className="flex justify-center pt-2">
                  <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
                    {t('landing.hero.demoSimilarBtn')} →
                  </button>
                </div>
              </div>
            </div>

            {/* 플로팅 배지 */}
            <div className="absolute -top-4 -right-4 bg-card border shadow-lg rounded-xl px-3 py-2 text-xs font-medium hidden lg:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              24/7 AI 튜터
            </div>
          </div>

          {/* Right: 텍스트 */}
          <div className="space-y-6">
            <Badge variant="outline" className="text-primary border-primary/40">
              {t('landing.solution.badge')}
            </Badge>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              {t('landing.solution.title')}
            </h2>

            <p className="text-lg text-muted-foreground">
              {t('landing.solution.subtitle')}
            </p>

            <ul className="space-y-3">
              {(['feature1', 'feature2', 'feature3'] as const).map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </span>
                  <span className="font-medium">{t(`landing.solution.${f}`)}</span>
                </li>
              ))}
            </ul>

            <PrefetchLink href="/login" data-testid="link-solution-cta">
              <Button size="lg" className="text-base px-8 mt-2">
                {t('landing.solution.cta')}
              </Button>
            </PrefetchLink>
          </div>
        </div>
      </div>
    </section>
  );
}
