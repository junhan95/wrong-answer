import { Router } from "express";
import { isAuthenticated } from "../sessionAuth";
import { storage } from "../storage";
import { PLAN_LIMITS } from "../plans";

const router = Router();

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
const TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

// KRW 기준 플랜 가격 (샌드박스: 실제 청구 없음)
const PLAN_PRICES_KRW: Record<string, number> = {
  basic: 25000,
  pro: 40000,
};

// POST /api/payments/toss/confirm
// 1) 금액 검증 → 2) Toss API 승인 → 3) 구독 업데이트
router.post("/payments/toss/confirm", isAuthenticated, async (req, res) => {
  try {
    const { paymentKey, orderId, amount, plan } = req.body;
    const user = req.user as any;
    const userId = user?.id;

    if (!paymentKey || !orderId || !amount || !plan) {
      return res.status(400).json({ error: "필수 파라미터가 누락되었습니다." });
    }

    // 금액 위변조 방지: 서버에서 플랜 가격과 대조
    const expectedAmount = PLAN_PRICES_KRW[plan];
    if (!expectedAmount || Number(amount) !== expectedAmount) {
      return res.status(400).json({ error: "결제 금액이 올바르지 않습니다." });
    }

    // Toss Payments 결제 승인 API 호출
    const authHeader = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
    const tossRes = await fetch(TOSS_CONFIRM_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    });

    if (!tossRes.ok) {
      const errBody = (await tossRes.json()) as { message?: string; code?: string };
      console.error("[Payment] Toss confirm error:", errBody);
      return res.status(400).json({
        error: errBody.message || "결제 승인에 실패했습니다.",
        code: errBody.code,
      });
    }

    const payment = await tossRes.json();

    // 구독 플랜 업데이트
    const planLimits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free;
    await storage.updateSubscription(userId, {
      plan,
      monthlyAiQueriesAllowed: planLimits.aiQueries,
      monthlyAiQueriesUsed: 0,
      billingCycleStart: new Date(),
    });

    res.json({ success: true, payment });
  } catch (error) {
    console.error("[Payment] Error:", error);
    res.status(500).json({ error: "결제 처리 중 오류가 발생했습니다." });
  }
});

export default router;
