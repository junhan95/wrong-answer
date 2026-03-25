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
          <h1 className="text-4xl font-bold border-b pb-4">서비스 이용약관</h1>
          <section className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-semibold text-foreground">제1조 (목적)</h2>
            <p>본 약관은 오답노트 AI(이하 '회사')가 제공하는 서비스 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>

            <h2 className="text-2xl font-semibold text-foreground pt-4">제2조 (용어의 정의)</h2>
            <p>1. '서비스'란 회사가 제공하는 오답 분석 및 AI 튜터 관련 모든 제반 서비스를 의미합니다.</p>
            <p>2. '이용자'란 회사의 서비스에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>

            <h2 className="text-2xl font-semibold text-foreground pt-4">제3조 (약관의 효력과 변경)</h2>
            <p>1. 회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
            <p>2. 회사는 관련 법령을 위배하지 않는 범위 내에서 약관을 개정할 수 있으며, 개정 시에는 지체 없이 공지합니다.</p>

            <h2 className="text-2xl font-semibold text-foreground pt-4">제4조 (서비스의 제공 및 변경)</h2>
            <p>1. 회사는 AI 기반의 학습 편의 기능을 제공하며, 운영상 또는 기술상의 필요에 따라 서비스 내용을 변경할 수 있습니다.</p>
            <p>2. 서비스의 변경이 이루어지는 경우, 회사는 사전에 공지사항 등을 통해 이용자에게 안내합니다.</p>

            <h2 className="text-2xl font-semibold text-foreground pt-4">제5조 (사용자 의무)</h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
              <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-foreground pt-4">제6조 (면책 조항)</h2>
            <p>1. 회사는 천재지변 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
            <p>2. AI 기술 특성상 발생할 수 있는 답변 오류에 대해 회사는 일체의 법적 책임을 지지 않으며, 최종 확인과 학습의 책임은 이용자에게 있습니다.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
