import { TrendingDown, AlertCircle } from "lucide-react";

export function AgitationSection() {
  return (
    <section id="agitation" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/50" data-testid="section-agitation">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: 카피 */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-destructive bg-destructive/10 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span>학습 골든타임 경고</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
              틀린 문제를 또 틀리는 악순환,<br />
              <span className="text-destructive">골든타임이 지나가고 있습니다.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              해설지만 쓱 보고 넘어가는 공부는 수능에서 통하지 않습니다.
            </p>
          </div>

          {/* Right: 시각 자료 - 성적 하락 그래프 */}
          <div className="relative bg-white dark:bg-card border rounded-3xl p-8 shadow-2xl overflow-hidden group hover:border-destructive/30 transition-colors">
            <div className="flex items-center gap-2 mb-8 text-sm font-bold text-muted-foreground">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <span>누적되는 오답과 정체되는 성적</span>
            </div>

            {/* 엑스(X) 표시가 가득한 시험지 느낌의 배경 패턴 */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 text-6xl text-destructive font-bold transform -rotate-12">✗</div>
              <div className="absolute top-2/3 left-1/2 text-7xl text-destructive font-bold transform rotate-12">✗</div>
              <div className="absolute top-1/3 right-1/4 text-5xl text-destructive font-bold transform -rotate-6">✗</div>
            </div>

            {/* 그래프 시각화 */}
            <div className="relative h-48 flex items-end gap-3 z-10 p-2">
              {[85, 80, 78, 75, 72, 70, 65, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md transition-all duration-700 relative group-hover:opacity-80"
                  style={{
                    height: `${h}%`,
                    background: `hsl(0 84% ${75 - i * 3}%)`, // Red gradient
                  }}
                >
                  <div className="absolute -top-6 inset-x-0 text-center text-xs font-semibold text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}점
                  </div>
                </div>
              ))}
              
              {/* 애니메이션 하락 선 */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 160"
                fill="none"
                preserveAspectRatio="none"
              >
                <polyline
                  points="20,28 60,36 100,42 140,50 180,58 220,66 260,76 300,96"
                  stroke="hsl(0 84% 50%)"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
