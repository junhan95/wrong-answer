import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { CREDIT_PACKAGES, type CreditPackageId } from "@shared/plans";

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

const PLAN_INFO = CREDIT_PACKAGES as Record<string, typeof CREDIT_PACKAGES[CreditPackageId]>;

function generateRandomString(): string {
  return btoa(Math.random().toString(36).slice(2) + Date.now().toString(36));
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();

  const [plan, setPlan] = useState<string>("");
  const [widgetReady, setWidgetReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugError, setDebugError] = useState<string | null>(null);

  const widgetsRef = useRef<any>(null);
  const initializedRef = useRef(false);

  // URL query에서 plan 추출
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("plan") || "";
    if (!PLAN_INFO[p]) {
      setLocation("/");
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
  const initWidget = useCallback(async () => {
    if (!plan || !user || initializedRef.current) return;
    const planInfo = PLAN_INFO[plan];
    if (!planInfo) return;

    const methodEl = document.getElementById("payment-method-widget");
    const agreementEl = document.getElementById("agreement-widget");
    if (!methodEl || !agreementEl) return;

    initializedRef.current = true;
    setError(null);
    setDebugError(null);

    try {
      // npm 패키지로 SDK 로드 (공식 권장 방식)
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

      // customerKey: 최소 2자 이상, 영문/숫자/특수문자(-, _, =, ., @)
      const customerKey = `oa_user_${(user as any)?.id ?? generateRandomString()}`;
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

      widgetsRef.current = widgets;
      setWidgetReady(true);
    } catch (err: any) {
      console.error("[Checkout] Widget init error:", err);
      initializedRef.current = false;

      const errCode = err?.code || "";
      const errMsg = err?.message || "";
      const errDetail = errCode ? `[${errCode}] ${errMsg}` : errMsg || String(err);
      setDebugError(errDetail);
      setError("결제 위젯을 불러오지 못했습니다.");
    }
  }, [plan, user]);

  useEffect(() => {
    if (!plan || !user) return;
    const raf = requestAnimationFrame(() => {
      initWidget();
    });
    return () => cancelAnimationFrame(raf);
  }, [plan, user, initWidget]);

  const handlePay = async () => {
    if (!widgetsRef.current || !plan) return;
    setPaying(true);
    setError(null);

    try {
      const orderId = generateRandomString().slice(0, 20);
      const planInfo = PLAN_INFO[plan];

      await widgetsRef.current.requestPayment({
        orderId,
        orderName: `오답노트 ${planInfo.name} 플랜`,
        successUrl: `${window.location.origin}/payment/success?plan=${plan}`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: (user as any)?.email,
        customerName:
          [(user as any)?.firstName, (user as any)?.lastName].filter(Boolean).join(" ") ||
          "사용자",
      });
    } catch (err: any) {
      if (err?.code !== "USER_CANCEL") {
        setError(err?.message || "결제 요청 중 오류가 발생했습니다.");
      }
      setPaying(false);
    }
  };

  const handleRetry = () => {
    initializedRef.current = false;
    setError(null);
    setDebugError(null);
    setWidgetReady(false);
    widgetsRef.current = null;
    const methodEl = document.getElementById("payment-method-widget");
    const agreementEl = document.getElementById("agreement-widget");
    if (methodEl) methodEl.innerHTML = "";
    if (agreementEl) agreementEl.innerHTML = "";
    initWidget();
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
            onClick={() => window.history.back()}
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
                <CardTitle className="text-xl">오답노트 {planInfo.name}</CardTitle>
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

        <div className="space-y-4">
          {!widgetReady && !error && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">결제 수단을 불러오는 중...</span>
            </div>
          )}

          {error && (
            <div className="space-y-3">
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive text-center space-y-1">
                <p className="font-medium">{error}</p>
                {debugError && (
                  <p className="text-xs opacity-70 font-mono break-all">{debugError}</p>
                )}
              </div>
              <Button variant="outline" onClick={handleRetry} className="w-full">
                다시 시도
              </Button>
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
