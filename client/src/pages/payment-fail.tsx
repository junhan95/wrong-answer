import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentFail() {
  const [, setLocation] = useLocation();

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code") || "";
  const message = params.get("message") || "결제가 취소되었거나 오류가 발생했습니다.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <XCircle className="h-16 w-16 text-destructive" />
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
        <p className="text-muted-foreground">{decodeURIComponent(message)}</p>
        {code && (
          <p className="text-xs text-muted-foreground mt-1">오류 코드: {code}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => history.back()}>
          다시 시도
        </Button>
        <Button onClick={() => setLocation("/pricing")}>
          요금제 페이지로
        </Button>
      </div>
    </div>
  );
}
