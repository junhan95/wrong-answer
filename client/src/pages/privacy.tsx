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
            <h1 className="text-4xl font-bold mb-2">개인정보처리방침</h1>
            <p className="text-sm text-muted-foreground">시행일: 2026년 1월 1일 &nbsp;|&nbsp; 최종 수정일: 2026년 3월 1일</p>
          </div>

          <section className="space-y-6 text-muted-foreground leading-relaxed">

            <p>오답노트 AI(이하 '회사')는 이용자의 개인정보를 소중히 여기며 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수합니다.</p>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">1. 수집하는 개인정보 항목 및 수집 방법</h2>
              <p>회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-foreground">소셜 로그인(구글 / 카카오 / 네이버) 시 수집</p>
                  <ul className="list-disc pl-6 mt-1 space-y-1">
                    <li>이름(닉네임), 이메일 주소, 프로필 이미지 URL</li>
                    <li>소셜 플랫폼 고유 식별자(ID)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">서비스 이용 과정에서 자동 수집</p>
                  <ul className="list-disc pl-6 mt-1 space-y-1">
                    <li>접속 IP 주소, 브라우저 종류 및 버전, OS 정보</li>
                    <li>서비스 이용 기록(오답 등록 이력, AI 분석 요청 이력, 크레딧 사용 내역)</li>
                    <li>쿠키(세션 유지용)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">유료 결제 시 수집 (토스페이먼츠 위탁 처리)</p>
                  <ul className="list-disc pl-6 mt-1 space-y-1">
                    <li>결제 수단 정보 (카드사 이름, 마지막 4자리 등 — 실 카드번호는 회사가 보관하지 않음)</li>
                    <li>주문 번호, 결제 금액, 결제 일시</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">2. 개인정보의 수집 및 이용 목적</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">서비스 제공</strong>: 회원 인증, AI 오답 분석, 유사 문제 생성, 학습 데이터 저장 및 표시</li>
                <li><strong className="text-foreground">크레딧 및 결제 관리</strong>: 크레딧 충전·차감·환불 처리, 결제 내역 관리</li>
                <li><strong className="text-foreground">고객 지원</strong>: 문의 응대, 불만 처리, 서비스 장애 복구</li>
                <li><strong className="text-foreground">서비스 개선</strong>: 이용 패턴 분석, AI 모델 성능 향상 (비식별화 후 사용)</li>
                <li><strong className="text-foreground">법적 의무 이행</strong>: 관계 법령에 따른 보관 의무 준수</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">3. 개인정보의 보유 및 이용 기간</h2>
              <p>회사는 이용 목적이 달성된 후 지체 없이 파기하는 것을 원칙으로 합니다. 단, 다음의 경우 법령에서 정한 기간 동안 보존합니다.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-semibold text-foreground">보존 항목</th>
                      <th className="text-left py-2 pr-4 font-semibold text-foreground">보존 기간</th>
                      <th className="text-left py-2 font-semibold text-foreground">근거</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4">계약 또는 청약철회 기록</td>
                      <td className="py-2 pr-4">5년</td>
                      <td className="py-2">전자상거래법</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">대금결제 및 재화 공급 기록</td>
                      <td className="py-2 pr-4">5년</td>
                      <td className="py-2">전자상거래법</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">소비자 불만 또는 분쟁 기록</td>
                      <td className="py-2 pr-4">3년</td>
                      <td className="py-2">전자상거래법</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">서비스 접속 로그</td>
                      <td className="py-2 pr-4">3개월</td>
                      <td className="py-2">통신비밀보호법</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">4. 개인정보의 파기 절차 및 방법</h2>
              <p>회원 탈퇴 요청 또는 보유 기간 만료 시 개인정보를 파기합니다.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">전자적 파일</strong>: 복구 불가능한 방법으로 영구 삭제</li>
                <li><strong className="text-foreground">DB 데이터</strong>: 해당 레코드 삭제 또는 비식별화 처리</li>
                <li>탈퇴 후 법령에 따른 보존 기간이 있는 데이터는 해당 기간 경과 후 파기</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">5. 개인정보의 제3자 제공</h2>
              <p>회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우는 예외입니다.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">6. 개인정보 처리 위탁</h2>
              <p>회사는 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁하고 있습니다.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-semibold text-foreground">수탁업체</th>
                      <th className="text-left py-2 font-semibold text-foreground">위탁 업무</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4">토스페이먼츠</td>
                      <td className="py-2">결제 처리 및 결제 정보 관리</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Supabase Inc.</td>
                      <td className="py-2">데이터베이스 및 파일 저장 인프라</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">OpenAI LLC</td>
                      <td className="py-2">AI 오답 분석 및 유사 문제 생성 (비식별화된 학습 데이터)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Render Inc.</td>
                      <td className="py-2">서버 호스팅 및 운영</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">7. 쿠키(Cookie) 운영 방침</h2>
              <p>회사는 세션 유지 및 서비스 편의성 향상을 위해 쿠키를 사용합니다. 쿠키는 브라우저 설정에서 거부할 수 있으나, 일부 서비스(로그인 유지 등) 이용이 제한될 수 있습니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">8. 이용자의 권리 및 행사 방법</h2>
              <p>이용자(또는 법정 대리인)는 언제든지 다음 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>개인정보 열람 요청</li>
                <li>오류 정정 요청</li>
                <li>삭제 및 회원 탈퇴 요청 (서비스 내 설정 메뉴 또는 이메일 문의)</li>
                <li>처리 정지 요청</li>
              </ul>
              <p>이메일(<a href="mailto:support@wrong-answer.ai" className="text-primary hover:underline">support@wrong-answer.ai</a>)로 요청 시 지체 없이 조치하겠습니다.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">9. 개인정보 보호책임자</h2>
              <ul className="list-none space-y-1">
                <li><strong className="text-foreground">담당 부서</strong>: 서비스 운영팀</li>
                <li><strong className="text-foreground">연락처</strong>: <a href="mailto:privacy@wrong-answer.ai" className="text-primary hover:underline">privacy@wrong-answer.ai</a></li>
              </ul>
              <p>개인정보 관련 문의, 불만, 피해 구제 신청은 위 연락처로 접수해 주세요. 기타 개인정보 침해 신고는 아래 기관에 문의하실 수 있습니다.</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>개인정보보호위원회: <a href="https://www.pipc.go.kr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.pipc.go.kr</a> (국번없이 182)</li>
                <li>개인정보 침해신고센터: <a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy.kisa.or.kr</a> (국번없이 118)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">10. 개인정보처리방침 변경</h2>
              <p>본 방침은 법령·정책 변경 또는 서비스 내용 변경에 따라 개정될 수 있습니다. 변경 시 시행일 기준 7일 전 서비스 공지 또는 이메일을 통해 안내합니다.</p>
            </div>

            <div className="pt-4 border-t space-y-1 text-sm">
              <p>운영사: 오답노트 AI (wrong-answer.ai)</p>
              <p>문의: <a href="mailto:privacy@wrong-answer.ai" className="text-primary hover:underline">privacy@wrong-answer.ai</a></p>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
