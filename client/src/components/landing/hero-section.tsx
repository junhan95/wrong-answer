import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles, ScanLine, ArrowRight } from "lucide-react";
import { PrefetchLink } from "@/components/prefetch-link";

export function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950" data-testid="section-hero">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute inset-0 -z-20 opacity-20 dark:opacity-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--primary)/0.15),transparent)]" />

        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Typography & CTA */}
            <div className="flex flex-col items-start text-left space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span>AI 전담 선생님과 함께하는 진짜 공부</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl/tight font-extrabold tracking-tight text-slate-900 dark:text-white" data-testid="text-hero-title">
                중학교 때까진 잘 하던 우리 아이,<br />
                <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-500">고등학교 첫 모의고사</span>에 당황하셨나요?
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg" data-testid="text-hero-subtitle">
                남들처럼 학원도 열심히 다니는데 제자리걸음인 성적.<br />
                단순한 '양치기' 공부법의 한계, 이제는 <strong>메타인지 오답노트</strong>로 바꿔야 할 때입니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <PrefetchLink href="/login" data-testid="link-hero-cta-primary" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-all hover:scale-105 hover:shadow-primary/20" data-testid="button-start-free">
                    무료 체험 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </PrefetchLink>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><ScanLine className="h-4 w-4" /> 사진 1장으로 끝</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span>매일 3회 무료 분석</span>
              </div>
            </div>

            {/* Right Column: Mobile App Mockup */}
            <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[400px] lg:ml-auto perspective-[1000px]">
              {/* Decorative blur blobs behind mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/30 blur-3xl rounded-full mix-blend-multiply filter" />
              <div className="absolute top-1/4 -right-10 w-[60%] h-[60%] bg-teal-400/20 blur-3xl rounded-full mix-blend-multiply filter" />
              
              {/* Phone Frame */}
              <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-200 dark:border-slate-800 transform rotate-[-2deg] transition-transform duration-700 hover:rotate-0 hover:-translate-y-2">
                {/* Screen Content */}
                <div className="relative rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  
                  {/* Top Bar Navigation (Mock) */}
                  <div className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10 relative">
                    <span className="text-sm font-bold text-slate-400">9:41</span>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      <div className="w-5 h-4 rounded-sm bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  </div>

                  {/* App UI Payload */}
                  <div className="p-5 h-[500px] overflow-hidden bg-slate-50 flex flex-col gap-4 relative">
                    
                    {/* Header: Class / Diagnosis */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">수학</span>
                        <span className="text-slate-600 text-sm font-medium">수열</span>
                      </div>
                      <span className="text-xs font-medium text-slate-400">오늘 복습</span>
                    </div>

                    {/* Image Mock */}
                    <div className="w-full h-32 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm overflow-hidden relative">
                      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSIjY2RkNWUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]"></div>
                      <span className="font-mono text-slate-500 font-medium z-10 scale-125">aₙ = a₁ + (n-1)d</span>
                    </div>

                    {/* AI Diagnosis Card */}
                    <div className="bg-white border-l-4 border-l-red-500 p-4 rounded-r-xl rounded-l-sm shadow-sm space-y-2 mt-2">
                      <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                        ⚠️ 개념 미숙지 (등차수열)
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        공차 d를 더하는 위치를 혼동했습니다. n-1에 d를 곱해야 하는데, n에 직접 곱하는 오류가 발생했어요.
                      </p>
                    </div>

                    {/* CTA Buttons Mock */}
                    <div className="mt-auto space-y-3 pb-4">
                      <div className="w-full bg-teal-600 rounded-xl h-12 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        💬 AI 튜터와 풀이 대화하기
                      </div>
                      <div className="w-full bg-white border border-slate-200 rounded-xl h-12 flex items-center justify-center text-slate-700 font-bold text-sm">
                        🎯 유사 문제 도전 (3문제)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <a href="#agitation" className="text-slate-400 hover:text-primary transition-colors p-2">
            <ChevronDown className="h-6 w-6" />
          </a>
        </div>
      </section>
    </>
  );
}
