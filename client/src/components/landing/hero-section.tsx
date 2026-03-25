import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { PrefetchLink } from "@/components/prefetch-link";

export function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 lg:py-32 overflow-hidden" data-testid="section-hero">
        {/* 배경: 라이트/다크 그라디언트 */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 dark:from-slate-950 dark:via-blue-950/40 dark:to-indigo-950/60" />
        <div className="absolute inset-0 -z-20 opacity-20 dark:opacity-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--primary)/0.25),transparent)]" />

        <div className="container mx-auto px-6 lg:px-12 relative flex flex-col items-center text-center space-y-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI 전담 선생님과 함께하는 진짜 공부</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight md:leading-tight text-foreground max-w-4xl" data-testid="text-hero-title">
            중학교 때까진 곧잘 하던 우리 아이,<br />
            <span className="text-primary">고등학교 첫 모의고사 성적표</span>에 당황하셨나요?
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed" data-testid="text-hero-subtitle">
            남들처럼 학원도 열심히 다니는데 제자리걸음인 성적.<br />
            단순한 '양치기' 공부법의 한계, 이제는 바꿔야 할 때입니다.
          </p>

          <PrefetchLink href="/login" data-testid="link-hero-cta-primary">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-transform hover:translate-y-[-2px]" data-testid="button-start-free">
              AI 오답노트 무료 체험하기
            </Button>
          </PrefetchLink>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#agitation" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronDown className="h-8 w-8" />
          </a>
        </div>
      </section>
    </>
  );
}
