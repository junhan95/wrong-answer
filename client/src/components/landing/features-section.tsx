import { Badge } from "@/components/ui/badge";
import {
  Camera,
  MessageCircle,
  Target,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const featureMeta = [
  { key: 'feature1', icon: Camera, align: 'text-left' },
  { key: 'feature2', icon: MessageCircle, align: 'text-right' },
  { key: 'feature3', icon: Target, align: 'text-left' },
  { key: 'feature4', icon: BarChart3, align: 'text-right' },
] as const;

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-20 lg:py-32" data-testid="section-features">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl font-semibold" data-testid="text-features-title">
            {t('landing.features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        {/* Zigzag Features */}
        <div className="space-y-24 max-w-6xl mx-auto">
          {featureMeta.map(({ key, icon: Icon }, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={key}
                className={`grid lg:grid-cols-2 gap-12 items-center`}
                data-testid={`feature-${key}`}
              >
                {/* Text Block */}
                <div className={`space-y-5 ${isEven ? '' : 'order-2 lg:order-2'}`}>
                  <Badge variant="outline" className="text-primary border-primary/40">
                    {t(`landing.features.${key}.badge`)}
                  </Badge>
                  <h3 className="text-3xl font-bold leading-snug">
                    {t(`landing.features.${key}.title`)}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t(`landing.features.${key}.description`)}
                  </p>
                </div>

                {/* Visual Block */}
                <div className={`${isEven ? 'order-1 lg:order-2' : 'order-1 lg:order-1'}`}>
                  <div className="bg-card border rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </span>
                      <span className="font-semibold text-sm text-muted-foreground">
                        {t(`landing.features.${key}.badge`)}
                      </span>
                    </div>

                    {/* Feature-specific UI mock */}
                    {key === 'feature1' && (
                      <div className="space-y-3">
                        <div className="bg-muted rounded-xl p-4 text-sm text-center text-muted-foreground border-2 border-dashed">
                          📷 {t('landing.features.feature1.mockLabel')}
                        </div>
                        <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-3 text-sm">
                          <span className="text-green-700 dark:text-green-400 font-medium">
                            {t('landing.features.feature1.mockStatus')}
                          </span>
                          <span className="text-xs text-muted-foreground">수학 / 이차방정식</span>
                        </div>
                      </div>
                    )}
                    {key === 'feature2' && (
                      <div className="space-y-3">
                        <div className="flex gap-2 items-end justify-end">
                          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm max-w-[80%]">
                            {t('landing.features.feature2.mockChat')}
                          </div>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm max-w-[80%]">
                            {t('landing.features.feature2.mockReply')}
                          </div>
                        </div>
                      </div>
                    )}
                    {key === 'feature3' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-muted rounded-xl p-3 text-center">
                              <div className="text-lg font-bold text-primary">Q{n}</div>
                              <div className="text-xs text-muted-foreground">유사 문제</div>
                            </div>
                          ))}
                        </div>
                        <button className="w-full py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors border border-primary/20">
                          {t('landing.features.feature3.mockBtn')}
                        </button>
                        <p className="text-xs text-center text-muted-foreground">
                          {t('landing.features.feature3.mockCount')}
                        </p>
                      </div>
                    )}
                    {key === 'feature4' && (
                      <div className="space-y-3">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          {t('landing.features.feature4.mockChart')}
                        </div>
                        {[
                          { label: '이차방정식', pct: 78 },
                          { label: '삼각함수', pct: 52 },
                          { label: '미적분', pct: 35 },
                        ].map(({ label, pct }) => (
                          <div key={label} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{label}</span>
                              <span className="font-semibold">{pct}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                        <p className="text-xs text-center text-primary font-medium pt-1">
                          {t('landing.features.feature4.mockProgress')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
