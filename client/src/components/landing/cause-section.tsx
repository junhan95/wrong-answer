import { useTranslation } from "react-i18next";

export function CauseSection() {
  const { t } = useTranslation();

  const cards = [
    { key: 'card1' },
    { key: 'card2' },
    { key: 'card3' },
  ] as const;

  return (
    <section className="py-20 lg:py-32 bg-muted/30" data-testid="section-cause">
      <div className="container mx-auto px-6 lg:px-12">
        {/* 타이틀 */}
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            {t('landing.cause.title')}
            <br />
            <span className="text-primary">{t('landing.cause.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.cause.subtitle')}
          </p>
        </div>

        {/* 3카드 */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {cards.map(({ key }) => (
            <div
              key={key}
              className="group bg-card border rounded-2xl p-8 text-center space-y-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              data-testid={`card-cause-${key}`}
            >
              <div className="text-5xl">{t(`landing.cause.${key}.emoji`)}</div>
              <h3 className="text-xl font-bold">{t(`landing.cause.${key}.title`)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`landing.cause.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
