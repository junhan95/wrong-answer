export function CauseSection() {
  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-slate-900" data-testid="section-cause">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Title */}
        <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
            질문조차 막막한 아이들,<br />
            <span className="text-blue-700 dark:text-blue-400">진짜 원인은 무엇일까요?</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4">
            모르는 것을 안다고 착각하거나, 어디서부터 질문해야 할지조차 모르는 상태. 이것이 성적 하락의 진짜 이유입니다.
          </p>
        </div>

        {/* 01, 02, 03 Typography Layout */}
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Item 01 */}
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12" data-testid="cause-item-01">
            <div className="text-5xl md:text-7xl font-black text-slate-200 dark:text-slate-800 shrink-0 tabular-nums tracking-tighter">
              01
            </div>
            <div className="space-y-3 pt-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                메타인지의 부재
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                <span className="font-semibold text-slate-800 dark:text-slate-200">"무엇을 틀렸는지조차 모릅니다."</span><br />
                해설지를 보고 고개를 끄덕이지만, 정작 본인이 수식의 어느 지점에서 어떤 개념을 잘못 적용했는지는 모릅니다. 무엇을 모르는지 알지 못해 질문조차 불가능합니다.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

          {/* Item 02 */}
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12 pl-0 md:pl-12" data-testid="cause-item-02">
            <div className="text-5xl md:text-7xl font-black text-slate-200 dark:text-slate-800 shrink-0 tabular-nums tracking-tighter">
              02
            </div>
            <div className="space-y-3 pt-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                질문에 대한 심리적 장벽
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                <span className="font-semibold text-slate-800 dark:text-slate-200">"선생님, 저 이거 1학년 개념인데 잘..."</span><br />
                기초적인 개념을 물어보거나, 같은 문제를 세 번 다르게 질문하는 것은 교실 환경에서 큰 용기를 필요로 합니다. 결국 아이들은 혼자 끙끙 앓다 포기해버립니다.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

          {/* Item 03 */}
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12 pl-0 md:pl-24" data-testid="cause-item-03">
            <div className="text-5xl md:text-7xl font-black text-blue-100 dark:text-blue-900/40 shrink-0 tabular-nums tracking-tighter">
              03
            </div>
            <div className="space-y-3 pt-2">
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                1:1 맞춤 피드백의 한계
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                <span className="font-semibold text-slate-800 dark:text-slate-200">"일대다 학원 수업으로는 불가능합니다."</span><br />
                정확히 아이의 눈높이와 사고 과정에 맞춰 "어디서 막혔는지"를 거꾸로 추적해주는 소크라테스식(역질문) 튜터링은 사람 선생님이라도 한계가 있습니다.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
