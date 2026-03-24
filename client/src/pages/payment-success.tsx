import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [planName, setPlanName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");
    const plan = params.get("plan");

    if (!paymentKey || !orderId || !amount || !plan) {
      setStatus("error");
      setErrorMessage("결제 정보가 올바르지 않습니다.");
      return;
    }

    const planLabels: Record<string, string> = { basic: "Basic", pro: "Pro" };
    setPlanName(planLabels[plan] || plan);

    async function confirmPayment() {
      try {
        const res = await apiRequest("POST", "/api/payments/toss/confirm", {
          paymentKey,
          orderId,
          amount: Number(amount),
          plan,
        });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "결제 승인 실패");
        }

        // 구독 정보 갱신
        await queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "결제 승인 중 오류가 발생했습니다.");
      }
    }

    confirmPayment();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">결제를 승인하는 중입니다...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">결제 처리 실패</h1>
          <p className="text-muted-foreground">{errorMessage}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setLocation("/pricing")}>
            요금제 페이지로
          </Button>
          <Button onClick={() => setLocation("/")}>
            홈으로
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">결제 완료!</h1>
        <p className="text-muted-foreground">
          WiseQuery <strong>{planName}</strong> 플랜으로 업그레이드되었습니다.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          새로운 기능을 지금 바로 이용해보세요.
        </p>
      </div>
      <Button size="lg" onClick={() => setLocation("/")}>
        시작하기
      </Button>
    </div>
  );
}
