import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { PrefetchLink } from "@/components/prefetch-link";
import { SEO } from "@/components/seo";

export default function Terms() {
  return (
    <div className="min-h-screen">
      <SEO title="이용약관" description="오답노트 AI 서비스 이용약관" path="/terms" />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12">
          <PrefetchLink
            href="/"
            className="flex items-center gap-2 hover-elevate px-2 py-1 rounded-md"
          >
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">오답노트 AI</span>
          </PrefetchLink>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <PrefetchLink href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로 돌아가기
              </Button>
            </PrefetchLink>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="border-b pb-6">
            <h1 className="text-4xl font-bold mb-2">서비스 이용약관</h1>
            <p className="text-sm text-muted-foreground">시행일: 2026년 1월 1일 &nbsp;|&nbsp; 최종 수정일: 2026년 3월 1일</p>
          </div>

          <section className="space-y-6 text-muted-foreground leading-relaxed">

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제1조 (목적)</h2>
              <p>본 약관은 오답노트 AI(이하 '회사')가 제공하는 오답 분석 및 AI 학습 서비스(이하 '서비스')의 이용 조건 및 절차, 회사와 이용자 간의 권리·의무·책임사항을 규정함을 목적으로 합니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제2조 (용어의 정의)</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">서비스</strong>: 오답 등록(OCR/텍스트), AI 오답 원인 분석, 유사 문제 추천, 학습 대시보드 등 회사가 제공하는 일체의 기능</li>
                <li><strong className="text-foreground">이용자</strong>: 본 약관에 동의하고 회사의 서비스를 이용하는 회원 및 비회원</li>
                <li><strong className="text-foreground">회원</strong>: 소셜 로그인(구글, 카카오, 네이버)으로 가입하여 지속적으로 서비스를 이용하는 자</li>
                <li><strong className="text-foreground">크레딧</strong>: 서비스 내 AI 분석 기능 사용에 필요한 가상 화폐 단위. 회원 가입 시 100 크레딧이 무료로 지급되며, 매일 무료 크레딧이 일부 재충전됩니다.</li>
                <li><strong className="text-foreground">콘텐츠</strong>: 이용자가 서비스에 등록하는 오답 문제, 풀이, 메모 등 일체의 자료</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제3조 (약관의 효력과 변경)</h2>
              <p>1. 본 약관은 서비스 화면에 게시하거나 이메일로 공지함으로써 효력이 발생합니다.</p>
              <p>2. 회사는 관련 법령을 위배하지 않는 범위 내에서 약관을 개정할 수 있으며, 중요 변경 시 적용일로부터 최소 7일 전(이용자에게 불리한 경우 30일 전)에 공지합니다.</p>
              <p>3. 변경 약관에 동의하지 않는 이용자는 회원 탈퇴를 요청할 수 있습니다. 공지 후 서비스를 계속 이용하면 변경 약관에 동의한 것으로 봅니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제4조 (회원 가입)</h2>
              <p>1. 회원 가입은 소셜 로그인(구글, 카카오, 네이버) 방식으로 이루어집니다.</p>
              <p>2. 만 14세 미만 아동은 법정 대리인의 동의를 받아야 합니다. 법정 대리인의 동의 없이 가입한 사실이 확인될 경우 회사는 해당 계정을 삭제할 수 있습니다.</p>
              <p>3. 회원 가입 시 가입 보너스로 100 크레딧이 지급됩니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제5조 (서비스의 제공 및 변경)</h2>
              <p>1. 서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검, 증설 및 교체, AI 모델 업데이트 등의 사유로 서비스가 일시 중단될 수 있습니다.</p>
              <p>2. 회사는 무료로 제공되는 기능의 일부를 유료로 전환할 수 있으며, 이 경우 사전에 공지합니다.</p>
              <p>3. AI가 생성하는 오답 분석 내용 및 유사 문제는 학습 보조 목적이며, 정확성을 보장하지 않습니다. 최종 학습 판단 및 책임은 이용자에게 있습니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제6조 (크레딧 및 유료 서비스)</h2>
              <p>1. AI 분석 기능(오답 원인 분석, 유사 문제 생성 등)은 크레딧을 소모합니다.</p>
              <p>2. 크레딧은 서비스 내 결제 시스템(토스페이먼츠)을 통해 유료 구매할 수 있습니다.</p>
              <p>3. 구매한 크레딧은 환불이 원칙적으로 불가하나, 서비스 장애 등 회사의 귀책 사유로 크레딧이 소모된 경우에는 해당 크레딧을 복원합니다.</p>
              <p>4. 미사용 크레딧은 계정 유지 기간 동안 보존됩니다. 단, 무료 지급 크레딧(일일 재충전분)은 별도 유효 기간이 적용될 수 있습니다.</p>
              <p>5. 구독 플랜(Pro 등) 가입 시 구독 기간 내 혜택이 제공됩니다. 구독 취소 후에도 잔여 기간 내 혜택은 유지됩니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제7조 (콘텐츠 및 저작권)</h2>
              <p>1. 이용자가 서비스에 등록한 콘텐츠(오답 문제, 풀이 등)의 저작권은 이용자에게 귀속됩니다.</p>
              <p>2. 이용자는 서비스 이용 과정에서 회사에게 콘텐츠를 AI 모델 개선, 서비스 품질 향상에 활용할 수 있는 비독점적 라이선스를 부여합니다. 다만, 개인 식별 정보는 분리되어 처리됩니다.</p>
              <p>3. 타인의 저작물을 무단으로 게재하거나, 저작권법을 위반하는 행위는 금지됩니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제8조 (이용자의 금지 행위)</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>타인의 계정 정보 도용 또는 부정 사용</li>
                <li>서비스의 역공학, 크롤링, 자동화 스크립트를 통한 대량 요청</li>
                <li>크레딧 시스템 우회 또는 부정 취득 시도</li>
                <li>불법적이거나 타인의 권리를 침해하는 콘텐츠 등록</li>
                <li>서비스 운영을 방해하는 행위</li>
                <li>본인 외 타인에게 계정 접근 권한 양도·대여</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제9조 (서비스 이용 제한 및 계정 해지)</h2>
              <p>1. 회사는 이용자가 제8조의 금지 행위를 위반하는 경우 사전 통보 없이 서비스 이용을 제한하거나 계정을 정지·삭제할 수 있습니다.</p>
              <p>2. 이용자는 언제든지 서비스 내 설정 메뉴를 통해 회원 탈퇴를 요청할 수 있으며, 탈퇴 즉시 개인정보 및 콘텐츠가 삭제됩니다(단, 관계 법령에 따른 보존 기간은 예외).</p>
              <p>3. 탈퇴 시 미사용 크레딧은 소멸하며 환불되지 않습니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제10조 (면책 조항)</h2>
              <p>1. 회사는 천재지변, 전쟁, 사이버 공격, 통신 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</p>
              <p>2. AI가 생성한 분석 결과, 유사 문제, 해설 등의 정확성·완전성을 보장하지 않으며, 이를 학습에 활용하여 발생한 결과에 대해 법적 책임을 지지 않습니다.</p>
              <p>3. 이용자 간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 회사는 개입하지 않으며 이에 대한 책임을 지지 않습니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">제11조 (준거법 및 분쟁 해결)</h2>
              <p>1. 본 약관의 해석 및 회사와 이용자 간의 분쟁에 대해서는 대한민국 법률을 준거법으로 합니다.</p>
              <p>2. 서비스 이용과 관련한 분쟁이 발생한 경우 회사와 이용자는 성실히 협의합니다. 협의가 이루어지지 않을 경우 민사소송법 상의 관할 법원에 소를 제기합니다.</p>
            </div>

            <div className="pt-4 border-t space-y-2">
              <p className="text-sm">문의: <a href="mailto:support@wrong-answer.ai" className="text-primary hover:underline">support@wrong-answer.ai</a></p>
              <p className="text-sm">운영사: 오답노트 AI (wrong-answer.ai)</p>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
