import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, MessageCircle, Sparkles } from "lucide-react";
import { PrefetchLink } from "@/components/prefetch-link";

export function SolutionSection() {
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
          <div className="relative order-2 lg:order-1" data-testid="solution-mockup">
            <div className="bg-card border rounded-3xl shadow-2xl p-6 flex flex-col h-full max-w-sm mx-auto lg:mx-0 transform transition-transform hover:-translate-y-2">
              {/* 헤더 */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm">AI 전담 선생님</div>
                  <div className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    온라인
                  </div>
                </div>
              </div>

              {/* 채팅 UI */}
              <div className="space-y-4 pt-4 flex-1">
                {/* 사진 업로드 흉내 */}
                <div className="flex justify-end">
                  <div className="bg-muted rounded-2xl rounded-tr-sm p-2 max-w-[80%] border">
                    <div className="w-full h-24 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                      📷 2024년 3월 모의고사.jpg
                    </div>
                  </div>
                </div>
                
                {/* 학생 메시지 */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%] shadow-md">
                    이 문제 해설을 봐도 3번 선지가 왜 틀렸는지 잘 모르겠어.
                  </div>
                </div>

                {/* AI 응답 */}
                <div className="flex gap-3 items-end">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%] leading-relaxed shadow-sm">
                    네, 3번 선지가 헷갈리기 쉬운 부분이죠!<br/>
                    본문의 두 번째 문단에서 'A는 B를 포함한다'고 했지만, 3번 선지는 반대로 설명하고 있어요. 그림으로 한번 더 설명해 드릴까요?
                  </div>
                </div>
              </div>
            </div>

            {/* 플로팅 배지 */}
            <div className="absolute -top-4 -right-4 bg-white dark:bg-card border shadow-xl rounded-2xl px-4 py-3 text-sm font-bold flex items-center gap-2 animate-bounce">
              <span className="text-xl">💡</span>
              완벽한 이해
            </div>
          </div>

          {/* Right: 텍스트 */}
          <div className="space-y-8 order-1 lg:order-2">
            <Badge variant="outline" className="text-primary border-primary/40 px-3 py-1 text-sm bg-primary/5">
              솔루션
            </Badge>

            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              언제 어디서나,<br />
              <span className="text-primary">나만의 AI 전담 선생님</span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed">
              사진 한 장으로 시작되는 완벽한 오답 분석.<br />
              모르는 부분만 골라서 콕 집어 설명해 줍니다.
            </p>

            <ul className="space-y-5 pt-4">
              {[
                '눈치 볼 필요 없는 무제한 질문',
                '내 수준에 딱 맞춘 1:1 맞춤 설명',
                '완전히 이해할 때까지 제공되는 유사 문제'
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-primary" />
                  </span>
                  <span className="font-semibold text-lg">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <PrefetchLink href="/login" data-testid="link-solution-cta">
                <Button size="lg" className="h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl transition-transform hover:translate-y-[-2px]">
                  지금 바로 질문하기
                </Button>
              </PrefetchLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
