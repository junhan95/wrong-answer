import { useTranslation } from "react-i18next";
import { TrendingDown } from "lucide-react";

export function AgitationSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 lg:py-32" data-testid="section-agitation">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: 카피 */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              <span className="text-foreground">{t('landing.agitation.title')}</span>
              <br />
              <span className="text-destructive">{t('landing.agitation.titleLine2')}</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('landing.agitation.description')}
            </p>

            {/* 통계 */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-5 rounded-xl border bg-card space-y-1">
                <div className="text-4xl font-extrabold text-destructive">
                  {t('landing.agitation.stat1')}
                </div>
                <div className="text-sm text-muted-foreground leading-snug">
                  {t('landing.agitation.stat1Label')}
                </div>
              </div>
              <div className="p-5 rounded-xl border bg-card space-y-1">
                <div className="text-4xl font-extrabold text-destructive">
                  {t('landing.agitation.stat2')}
                </div>
                <div className="text-sm text-muted-foreground leading-snug">
                  {t('landing.agitation.stat2Label')}
                </div>
              </div>
            </div>
          </div>

          {/* Right: 시각 자료 - 성적 하락 그래프 */}
          <div className="relative bg-card border rounded-2xl p-8 shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span>{t('landing.agitation.graphLabel')}</span>
            </div>

            {/* 그래프 시각화 */}
            <div className="relative h-40 flex items-end gap-2">
              {[85, 80, 78, 75, 72, 70, 65, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all"
                  style={{
                    height: `${h}%`,
                    background: `hsl(${0 + i * 4} 80% ${55 - i * 3}%)`,
                    opacity: 0.85,
                  }}
                />
              ))}
              {/* 하락 화살표 오버레이 */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 160"
                fill="none"
                preserveAspectRatio="none"
              >
                <polyline
                  points="20,28 60,36 100,42 140,50 180,58 220,66 260,76 300,96"
                  stroke="hsl(0 84% 50%)"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  fill="none"
                />
                <polygon
                  points="294,92 308,100 294,108"
                  fill="hsl(0 84% 50%)"
                />
              </svg>
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground italic">
              {t('landing.agitation.graphDesc')}
            </p>

            {/* X 표시 장식 */}
            <div className="absolute top-4 right-4 flex gap-1">
              {['❌', '❌', '❌'].map((x, i) => (
                <span key={i} className="text-lg opacity-60">{x}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
