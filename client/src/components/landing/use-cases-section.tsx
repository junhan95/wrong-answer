import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  Lock,
  Shield,
  GraduationCap,
  Star,
} from "lucide-react";
export function UseCasesSection() {
  return (
    <>
      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/30 border-y" data-testid="section-use-cases">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight" data-testid="text-use-cases-title">
              모든 학습자를 위한 <span className="text-primary">맞춤 솔루션</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              기초부터 심화까지, 내 수준에 딱 맞는 1:1 학습 전략을 제공합니다.
            </p>
          </div>
          <div className="space-y-24 max-w-6xl mx-auto">
            
            {/* 기초 다지기 (하위권) */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-sm">
                  🌱 기초 부족 학생
                </div>
                <h3 className="text-3xl font-bold leading-tight">개념부터 튼튼하게, 기초 다지기</h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  어디서부터 손대야 할지 막막한가요?<br />AI 선생님이 편안한 대화로 기초 개념부터 차근차근 설명해 드립니다.
                </p>
                <ul className="space-y-4 pt-2">
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-base font-semibold">완벽히 이해할 때까지 무한 반복 질의응답</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-base font-semibold">내 눈높이에 맞춘 쉽고 친절한 개념 설명</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-base font-semibold">끊임없는 칭찬과 격려로 자신감 상승</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-card rounded-3xl p-8 border shadow-xl transform transition-transform hover:-translate-y-2">
                <div className="space-y-4">
                  <div className="text-sm font-bold text-muted-foreground mb-4 border-b pb-2">학생 & AI 대화 예시</div>
                  <div className="flex justify-end pt-2">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[85%] shadow-md">
                      선생님, 분수의 덧셈을 통분하는 걸 자꾸 까먹어요 ㅠㅠ
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%] shadow-sm leading-relaxed font-medium">
                      괜찮아요! 피자를 나눈다고 상상해볼까요?<br />조각 크기가 다르면 한 조각씩 더하기 어렵잖아요~ 조각 크기를 똑같이 만들어주는 게 바로 '통분'이랍니다. 그림으로 같이 연습해봐요!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 실력 점프업 (중위권) */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 bg-white dark:bg-card rounded-3xl p-8 border shadow-xl transform transition-transform hover:-translate-y-2">
                <div className="space-y-5">
                  <div className="text-sm font-bold text-muted-foreground mb-2 border-b pb-2">유사 문제 추천 알고리즘</div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4">
                    <div className="font-bold text-amber-800 dark:text-amber-500 text-sm mb-2">원래 틀린 문제 (오답)</div>
                    <p className="text-sm text-foreground">이차함수 y = x² - 4x + 3 의 최솟값을 구하시오.</p>
                  </div>
                  <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-background border rounded-full px-3 py-1 text-xs font-bold text-muted-foreground shadow-sm">AI 맞춤 변형</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-4">
                    <div className="font-bold text-green-800 dark:text-green-500 text-sm mb-2">맞춤 유사 문제 (점검)</div>
                    <p className="text-sm text-foreground">이차함수 y = -2x² + 8x - 1 의 최댓값을 구하고, 그때의 x값을 쓰시오.</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold text-sm">
                  🚀 응용력 마스터
                </div>
                <h3 className="text-3xl font-bold leading-tight">취약점 집중 공략, 실력 점프업</h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  아는 문제인데 변형되면 틀리나요?<br />약점 데이터를 분석하여 핵심 원리를 완벽히 깨우치도록 돕습니다.
                </p>
                <ul className="space-y-4 pt-2">
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-base font-semibold">약점만 골라내는 스마트 분석 리포트</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-base font-semibold">개념을 응용할 수 있는 단계별 힌트 제공</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-base font-semibold">숫자와 조건이 변형된 맞춤형 유사 문제</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 완벽한 마무리 (상위권) */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-bold text-sm">
                  🏆 1등급 도약
                </div>
                <h3 className="text-3xl font-bold leading-tight">1등급을 향한 디테일, 완벽한 마무리</h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  한 두 문제 실수로 등급이 갈리나요?<br />고난도 킬러 문항도 집요하게 파고들어 성적의 사각지대를 완전히 없앱니다.
                </p>
                <ul className="space-y-4 pt-2">
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-base font-semibold">최상위권을 위한 고난도 킬러 문항 대비</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-base font-semibold">풀이 시간을 획기적으로 단축시키는 실전 팁</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-base font-semibold">치명적인 실수 패턴 분석 및 교정 솔루션</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-card rounded-3xl p-8 border shadow-xl transform transition-transform hover:-translate-y-2">
                <div className="space-y-4">
                  <div className="font-bold text-muted-foreground mb-4 border-b pb-2">실수 패턴 분석 리포트</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-background rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 p-2 rounded-lg"><Shield className="h-4 w-4" /></div>
                        <span className="font-bold">계산 과정 부호 실수 (잦음)</span>
                      </div>
                      <span className="text-xs font-bold text-red-500">주의 요망</span>
                    </div>
                    <div className="flex items-center justify-between bg-background rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 p-2 rounded-lg"><Lock className="h-4 w-4" /></div>
                        <span className="font-bold">조건 (단, x &gt; 0) 누락 실수</span>
                      </div>
                      <span className="text-xs font-bold text-orange-500">지속 교정중</span>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-4 mt-2">
                      <p className="text-sm font-semibold text-primary">
                        💡 AI 코멘트: "수능 수학 22번 유형에서 조건 확인을 놓치는 경우가 3번 반복되었습니다. 문제를 풀기 전 조건형광펜 칠하기를 제안합니다."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32" data-testid="section-testimonials">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight" data-testid="text-testimonials-title">
              미리 경험한 <span className="text-primary">선배들의 생생한 후기</span>
            </h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-3 text-xl font-bold text-muted-foreground">평균 만족도 4.9 / 5.0</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                    이
                  </div>
                  <div>
                    <div className="font-bold text-lg">고2 이ㅇㅇ 학생</div>
                    <div className="text-sm text-primary font-semibold">수학 4등급 ➡️ 2등급 달성</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  "수학 포기자였어요. 학교 선생님께 질문하기도 부끄러웠는데, AI 쌤은 열 번을 물어봐도 너무 친절하게 답해줘서 진짜 과외받는 느낌이었어요! 유사문제 버튼이 진짜 최고예요."
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold">
                    김
                  </div>
                  <div>
                    <div className="font-bold text-lg">N수생 김ㅇㅇ 학생</div>
                    <div className="text-sm text-primary font-semibold">모의고사 백분위 98% 달성</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  "독학 재수생이라 모르는 문제가 생길 때마다 카페에 질문 올리고 기다려야 했는데, 이건 찍자마자 해설을 주니까 시간 낭비가 전혀 없어요. 새벽 2시에도 눈치 안 보고 질문할 수 있어서 무조건 추천해요."
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">
                    박
                  </div>
                  <div>
                    <div className="font-bold text-lg">고3 박ㅇㅇ 학부모</div>
                    <div className="text-sm text-primary font-semibold">사교육비 70% 절감</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  "비싼 돈 주고 유명 학원을 보내도 아이 성적이 그대로라 답답했는데, 학원을 끊고 오답노트 AI만 한 달을 썼더니 아이 약점을 정확히 파악해주더라고요. 매주 오는 안심 리포트 덕에 너무 마음이 놓입니다."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
