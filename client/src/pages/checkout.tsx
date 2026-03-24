import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

const TOSS_CLIENT_KEY =
  import.meta.env.VITE_TOSS_CLIENT_KEY || "test_gck_docs_Ovk5rk1EwkEbP0W43n75lmeaxYG5";

const PLAN_INFO: Record<string, { name: string; priceKRW: number; features: string[] }> = {
  basic: {
    name: "Basic",
    priceKRW: 25000,
    features: ["10 프로젝트", "월 1,000 AI 쿼리", "5GB 스토리지", "180일 데이터 보존"],
  },
  pro: {
    name: "Pro",
    priceKRW: 40000,
    features: [
      "무제한 프로젝트",
      "월 5,000 AI 쿼리",
      "20GB 스토리지",
      "고급 RAG 검색",
      "이미지 분석",
      "우선 지원",
      "1년 데이터 보존",
    ],
  },
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();

  const [plan, setPlan] = useState<string>("");
  const [widgetReady, setWidgetReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const widgetsRef = useRef<any>(null);

  // URL query에서 plan 추출
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("plan") || "";
    if (!PLAN_INFO[p]) {
      setLocation("/pricing");
      return;
    }
    setPlan(p);
  }, [setLocation]);

  // 인증 확인
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // Toss Payments 위젯 초기화
  useEffect(() => {
    if (!plan || !user) return;
    const planInfo = PLAN_INFO[plan];
    if (!planInfo) return;

    let mounted = true;

    async function initWidget() {
      try {
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        const customerKey = (user as any)?.id || ANONYMOUS;
        const widgets = tossPayments.widgets({ customerKey });

        await widgets.setAmount({ currency: "KRW", value: planInfo.priceKRW });

        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method-widget",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement-widget",
            variantKey: "AGREEMENT",
          }),
        ]);

        if (mounted) {
          widgetsRef.current = widgets;
          setWidgetReady(true);
        }
      } catch (err) {
        console.error("[Checkout] Widget init error:", err);
        if (mounted) setError("결제 위젯을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    }

    initWidget();
    return () => { mounted = false; };
  }, [plan, user]);

  const handlePay = async () => {
    if (!widgetsRef.current || !plan) return;
    setPaying(true);
    setError(null);

    try {
      const orderId = crypto.randomUUID().replace(/-/g, "").slice(0, 20);
      const planInfo = PLAN_INFO[plan];

      // plan을 successUrl에 포함해 성공 페이지에서 참조
      await widgetsRef.current.requestPayment({
        orderId,
        orderName: `WiseQuery ${planInfo.name} 플랜`,
        successUrl: `${window.location.origin}/payment/success?plan=${plan}`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: (user as any)?.email,
        customerName:
          [(user as any)?.firstName, (user as any)?.lastName].filter(Boolean).join(" ") || "사용자",
      });
    } catch (err: any) {
      // 사용자가 결제창을 닫은 경우 등 무시
      if (err?.code !== "USER_CANCEL") {
        setError(err?.message || "결제 요청 중 오류가 발생했습니다.");
      }
      setPaying(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const planInfo = PLAN_INFO[plan];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/pricing")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <Crown className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-bold">플랜 업그레이드</h1>
          <p className="text-muted-foreground mt-2">안전한 토스페이먼츠로 결제합니다</p>
        </div>

        {planInfo && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-xl">WiseQuery {planInfo.name}</CardTitle>
                <CardDescription>월간 구독</CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                ₩{planInfo.priceKRW.toLocaleString()}/월
              </Badge>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                {planInfo.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Toss Payments 위젯 마운트 영역 */}
        <div className="space-y-4">
          {!widgetReady && !error && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">결제 수단을 불러오는 중...</span>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive text-center">
              {error}
            </div>
          )}

          <div id="payment-method-widget" />
          <div id="agreement-widget" />

          {widgetReady && (
            <Button
              onClick={handlePay}
              disabled={paying}
              className="w-full h-14 text-base font-semibold mt-4"
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  결제 진행 중...
                </>
              ) : (
                `₩${planInfo?.priceKRW.toLocaleString()} 결제하기`
              )}
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center pt-2">
            현재 샌드박스 환경입니다. 실제 결제가 발생하지 않습니다.
          </p>
        </div>
      </main>
    </div>
  );
}
