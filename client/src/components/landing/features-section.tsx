import { Badge } from "@/components/ui/badge";
import {
  Camera,
  MessageCircle,
  Target,
  BarChart3,
} from "lucide-react";
const featuresData = [
  {
    key: 'step1',
    icon: Camera,
    badge: 'Step 1',
    title: '사진 찰칵, 오답 등록 끝!',
    description: '틀린 문제와 해설을 스마트폰으로 찍어 올리기만 하세요. 수식과 손글씨까지 AI가 완벽하게 인식합니다.',
  },
  {
    key: 'step2',
    icon: MessageCircle,
    badge: 'Step 2',
    title: '나만의 AI 튜터와 과외',
    description: '단순한 정답 제시가 아닌, 왜 틀렸는지 소크라테스식 문답법으로 스스로 깨닫게 합니다.',
  },
  {
    key: 'step3',
    icon: Target,
    badge: 'Step 3',
    title: '내 취약점 맞춤 백신 문제',
    description: '틀린 문제와 가장 유사한 변형 문제 3개를 즉시 생성하여 완벽히 내 것으로 만듭니다.',
  },
  {
    key: 'step4',
    icon: BarChart3,
    badge: 'Step 4',
    title: '학부모 안심 리포트',
    description: '우리 아이가 이번 주 어떤 단원에서 취약했는지, 얼마나 극복했는지 한눈에 보여줍니다.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-900/30 border-y" data-testid="section-features">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center space-y-4 mb-24">
          <Badge variant="outline" className="text-primary border-primary/40 px-3 py-1 text-sm bg-primary/5">
            핵심 기능
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight" data-testid="text-features-title">
            오답노트, <span className="text-primary">이렇게 다릅니다</span>
          </h2>
        </div>

        {/* Zigzag Features */}
        <div className="space-y-32 max-w-6xl mx-auto">
          {featuresData.map(({ key, icon: Icon, badge, title, description }, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={key}
                className={`grid lg:grid-cols-2 gap-16 items-center`}
                data-testid={`feature-${key}`}
              >
                {/* Text Block */}
                <div className={`space-y-6 ${isEven ? '' : 'order-1 lg:order-2'}`}>
                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {badge}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                    {title}
                  </h3>
                  <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-medium">
                    {description}
                  </p>
                </div>

                {/* Visual Block */}
                <div className={`${isEven ? '' : 'order-2 lg:order-1'}`}>
                  <div className="bg-white dark:bg-card border rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center gap-4 mb-8">
                      <span className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shadow-inner">
                        <Icon className="h-6 w-6 text-primary" />
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {badge}
                      </span>
                    </div>

                    {/* Feature-specific UI mock */}
                    {key === 'step1' && (
                      <div className="space-y-4">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 text-center text-muted-foreground border-2 border-dashed border-slate-300 dark:border-slate-700 font-medium">
                          📷 이미지를 드롭하거나 클릭하여 업로드
                        </div>
                        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 shadow-sm text-sm">
                          <span className="text-green-700 dark:text-green-400 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            AI 분석 완료
                          </span>
                          <span className="text-muted-foreground font-medium">수학 / 이차방정식</span>
                        </div>
                      </div>
                    )}
                    {key === 'step2' && (
                      <div className="space-y-4 pt-2">
                        <div className="flex gap-2 items-end justify-end">
                          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[85%] shadow-md">
                            근의 공식을 썼는데 답이 안 나와. 뭐가 문제지?
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-4 w-4 text-primary" />
                          </div>
                          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%] shadow-sm leading-relaxed">
                            공식은 맞게 썼어! 하지만 판별식 D &lt; 0 이라서 서로 다른 두 허근을 가지게 되는데, 문제 조건에서 '실근'을 구하라고 한 걸 놓쳤을 수 있어. 다시 한번 볼래?
                          </div>
                        </div>
                      </div>
                    )}
                    {key === 'step3' && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-4 text-center shadow-sm">
                              <div className="text-xl font-bold text-primary mb-1">Q{n}</div>
                              <div className="text-xs text-muted-foreground font-medium">유사/변형 문제</div>
                            </div>
                          ))}
                        </div>
                        <button className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:bg-primary/90 transition-colors">
                          지금 바로 도전하기
                        </button>
                      </div>
                    )}
                    {key === 'step4' && (
                      <div className="space-y-5">
                        <div className="text-sm font-bold text-foreground mb-4">
                          📅 이번 주 학습 취약점 분석
                        </div>
                        {[
                          { label: '이차방정식', pct: 85 },
                          { label: '삼각함수', pct: 60 },
                          { label: '미적분', pct: 40 },
                        ].map(({ label, pct }) => (
                          <div key={label} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-muted-foreground">
                              <span>{label}</span>
                              <span className="text-foreground">{pct}% 정복</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${pct > 70 ? 'bg-primary' : pct > 50 ? 'bg-yellow-400' : 'bg-destructive'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="pt-2">
                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center text-sm text-primary font-semibold">
                            📈 저번 주 대비 성취도가 15% 상승했습니다!
                          </div>
                        </div>
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
