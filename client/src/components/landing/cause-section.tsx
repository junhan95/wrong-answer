export function CauseSection() {
  const cards = [
    {
      emoji: '🤷',
      title: '무엇을 모르는지 모름',
      description: '메타인지 부족으로 자신의 취약점을 파악하지 못해 질문조차 막막합니다.',
    },
    {
      emoji: '👀',
      title: '눈치 보이는 질문',
      description: '반복적인 질문이나 기초적인 질문은 선생님이나 친구들의 시선이 부담스럽습니다.',
    },
    {
      emoji: '🏫',
      title: '맞춤형 피드백 부재',
      description: '일대다 수업 환경에서는 학생 개인의 페이스와 눈높이에 맞춘 상세한 설명을 기대하기 어렵습니다.',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-card" data-testid="section-cause">
      <div className="container mx-auto px-6 lg:px-12">
        {/* 타이틀 */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            질문조차 막막한 아이들,<br />
            <span className="text-primary">무엇이 문제일까요?</span>
          </h2>
        </div>

        {/* 3카드 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group bg-slate-50 dark:bg-slate-900 border rounded-3xl p-8 text-center space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              data-testid={`card-cause-${idx}`}
            >
              <div className="text-6xl mb-4 transform transition-transform group-hover:scale-110">
                {card.emoji}
              </div>
              <h3 className="text-2xl font-bold">{card.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
