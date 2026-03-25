import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { PrefetchLink } from "@/components/prefetch-link";
import { SEO } from "@/components/seo";

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <SEO title="개인정보처리방침" description="오답노트 AI 개인정보처리방침" path="/privacy" />
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
            <PrefetchLink href="/?scrollToBottom=true">
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
          <h1 className="text-4xl font-bold border-b pb-4">개인정보처리방침</h1>
          <section className="space-y-4 text-muted-foreground leading-relaxed">
            <p>오답노트 AI(이하 '회사')는 이용자의 개인정보를 중요시하며, '개인정보보호법' 등 관련 법령을 준수하고 있습니다.</p>

            <h2 className="text-2xl font-semibold text-foreground pt-4">1. 수집하는 개인정보의 항목 및 수집 방법</h2>
            <p>회사는 서비스 제공, 고객상담 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>필수항목: 이메일 주소, 이름, 프로필 이미지 (소셜 로그인 시 제공받는 정보)</li>
              <li>자동수집: 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보 등</li>
              <li>수집방법: 홈페이지 내 소셜 로그인 시 및 서비스 이용 중 자동 수집</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground pt-4">2. 개인정보의 수집 및 이용 목적</h2>
            <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>서비스 제공에 관한 계약 이행 및 맞춤형 AI 서비스 제공</li>
              <li>이용자 식별, 가입 의사 확인, 불만처리 등 민원처리</li>
              <li>신규 서비스 개발 및 마케팅 광고에의 활용</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground pt-4">3. 개인정보의 보유 및 이용기간</h2>
            <p>원칙적으로, 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>사용자가 회원 탈퇴를 요청하기 전까지 보관</li>
              <li>전자상거래 등에서의 소비자보호에 관한 법률 등 관계 법령에 따른 보관</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground pt-4">4. 개인정보의 파기절차 및 방법</h2>
            <p>회원 탈퇴 시 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 파기합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</p>
            
            <h2 className="text-2xl font-semibold text-foreground pt-4">5. 이용자의 권리와 행사 방법</h2>
            <p>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다. 개인정보 관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
