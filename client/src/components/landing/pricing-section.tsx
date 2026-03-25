import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { PrefetchLink } from "@/components/prefetch-link";

export function PricingSection() {

  return (
    <>
      {/* Pricing Section (Credit Packages) */}
      <section id="pricing" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/30" data-testid="section-pricing">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight" data-testid="text-pricing-title">
              필요한 만큼만 쓰는 <span className="text-primary">합리적인 종량제</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              부담스러운 월 구독 대신, 쓰고 싶은 만큼만 크레딧을 충전해서 사용하세요.
            </p>
          </div>

          {/* Welcome Bonus Banner */}
          <div className="max-w-4xl mx-auto bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-800 rounded-full flex justify-center items-center flex-shrink-0">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900 dark:text-green-300 flex items-center gap-2">
                  신규 가입 즉시 100 크레딧 무료 제공!
                  <span className="text-xs bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">평생 무료 매일 3회</span>
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  결제 없이도 <strong>매일 3회 AI 튜터 질문 및 오답 분석</strong>이 평생 무료로 제공되며, 첫 가입 시 제약 없이 체험할 수 있는 100 크레딧(약 1만원 상당)을 추가 증정합니다!
                </p>
              </div>
            </div>
            <PrefetchLink href="/login" className="flex-shrink-0">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold h-11 px-6 shadow-md">
                무료 혜택 받기
              </Button>
            </PrefetchLink>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Package */}
            <Card className="flex flex-col hover:border-primary/30 transition-colors shadow-sm hover:shadow-md" data-testid="pricing-basic">
              <CardHeader className="text-center pb-8 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-2xl font-bold text-muted-foreground">Starter</CardTitle>
                <div className="mt-6 flex flex-col items-center gap-2">
                  <div className="text-primary font-bold text-lg bg-primary/10 px-3 py-1 rounded-full">
                    100 크레딧
                  </div>
                  <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className="text-4xl font-extrabold">₩9,900</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-3 font-medium">AI 오답노트를 처음 시작하는 사용자용</div>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 flex-1">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base font-medium">100 크레딧 충전 (유효기간 없음)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base font-medium">AI 사용량(쿼리)에 비례하여 크레딧 차감</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base font-medium">100 크레딧은 약 100회 오답 분석 가능</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <PrefetchLink href="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-base font-bold border-2">
                    충전하기
                  </Button>
                </PrefetchLink>
              </CardFooter>
            </Card>

            {/* Plus Package (Best Value) */}
            <Card className="flex flex-col border-primary/50 relative shadow-xl transform lg:-translate-y-4 bg-primary/5" data-testid="pricing-pro">
              <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 text-sm font-bold shadow-sm border-primary bg-primary text-primary-foreground">가장 인기</Badge>
              <CardHeader className="text-center pb-8 border-b border-primary/10">
                <CardTitle className="text-2xl font-bold text-primary">Plus</CardTitle>
                <div className="mt-6 flex flex-col items-center gap-2">
                  <div className="text-primary font-bold text-base bg-primary/20 px-4 py-1.5 rounded-full whitespace-nowrap">
                    300 크레딧 <span className="text-sm font-normal opacity-80 ml-1">+ 30 보너스</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className="text-4xl font-extrabold">₩28,900</span>
                  </div>
                </div>
                <div className="text-sm text-primary font-bold mt-3">오답노트를 꾸준히 활용하는 플러스 사용자용</div>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 flex-1">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-base font-bold">총 330 크레딧 (10% 보너스 지급)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-base font-medium">학부모 안심 주간 리포트 무료 열람</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-base font-medium">AI 튜터 최우선 답변 큐 배정</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <PrefetchLink href="/login" className="w-full">
                  <Button className="w-full h-12 text-base font-bold shadow-md hover:scale-[1.02] transition-transform">
                    충전하기
                  </Button>
                </PrefetchLink>
              </CardFooter>
            </Card>

            {/* Premium Package */}
            <Card className="flex flex-col hover:border-primary/30 transition-colors shadow-sm hover:shadow-md" data-testid="pricing-premium">
              <CardHeader className="text-center pb-8 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-2xl font-bold text-muted-foreground">Premium</CardTitle>
                <div className="mt-6 flex flex-col items-center gap-2">
                  <div className="text-muted-foreground font-bold text-base bg-muted px-4 py-1.5 rounded-full whitespace-nowrap">
                    500 크레딧 <span className="text-sm font-normal opacity-80 ml-1">+ 100 보너스</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className="text-4xl font-extrabold">₩47,900</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-3 font-medium">모든 오답을 AI로 완벽히 정복하는 헤비 사용자용</div>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 flex-1">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base font-bold">총 600 크레딧 (20% 특별 보너스)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base font-medium">취약점 기반 모의고사 자동 생성권 3장</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base font-medium">Plus 요금제의 모든 혜택 포함</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <PrefetchLink href="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-base font-bold border-2">
                    충전하기
                  </Button>
                </PrefetchLink>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
