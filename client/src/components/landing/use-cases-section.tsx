import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  FolderTree,
  Lock,
  Clock,
  Shield,
  BookOpen,
  Briefcase,
  GraduationCap,
  FileText,
  GitBranch,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function UseCasesSection() {
  const { t } = useTranslation();

  return (
    <>
      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 lg:py-32 bg-muted/30" data-testid="section-use-cases">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-semibold" data-testid="text-use-cases-title">
              {t('landing.useCases.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.useCases.subtitle')}
            </p>
          </div>
          <div className="space-y-20">
            {/* Research & Learning */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" data-testid="use-case-knowledge">
              <div className="space-y-4">
                <h3 className="text-3xl font-semibold">{t('landing.useCases.knowledge.title')}</h3>
                <p className="text-lg text-muted-foreground">
                  {t('landing.useCases.knowledge.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.knowledge.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.knowledge.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.knowledge.benefit3')}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-8 border">
                <div className="space-y-3 text-sm">
                  <div className="font-medium text-muted-foreground">{t('landing.useCases.knowledge.projectsLabel')}</div>
                  <div className="pl-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{t('landing.useCases.knowledge.researchPapers')}</span>
                    </div>
                    <div className="pl-6 space-y-1 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        {t('landing.useCases.knowledge.mlSurvey')}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        {t('landing.useCases.knowledge.ragReview')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{t('landing.useCases.knowledge.clientProjects')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{t('landing.useCases.knowledge.courseNotes')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business & Consulting */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" data-testid="use-case-development">
              <div className="order-2 lg:order-1 bg-muted/50 rounded-lg p-8 border">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-muted-foreground">{t('landing.useCases.development.demoLabel')}</div>
                  <div className="bg-background rounded p-3 text-sm">
                    "{t('landing.useCases.development.demoQuery')}"
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <GitBranch className="h-3 w-3" />
                    <span>{t('landing.useCases.development.demoContext')}</span>
                  </div>
                  <div className="bg-primary/10 rounded p-3 text-sm">
                    {t('landing.useCases.development.demoAnswer')}
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-4">
                <h3 className="text-3xl font-semibold">{t('landing.useCases.development.title')}</h3>
                <p className="text-lg text-muted-foreground">
                  {t('landing.useCases.development.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.development.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.development.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.development.benefit3')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Creative & Content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" data-testid="use-case-team">
              <div className="space-y-4">
                <h3 className="text-3xl font-semibold">{t('landing.useCases.team.title')}</h3>
                <p className="text-lg text-muted-foreground">
                  {t('landing.useCases.team.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.team.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.team.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>{t('landing.useCases.team.benefit3')}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-8 border">
                <div className="space-y-4">
                  <div className="font-medium">{t('landing.useCases.team.projectLabel')}</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between bg-background rounded p-3">
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4" />
                        <span>{t('landing.useCases.team.project1')}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t('landing.useCases.team.project1Detail')}</span>
                    </div>
                    <div className="flex items-center justify-between bg-background rounded p-3">
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4" />
                        <span>{t('landing.useCases.team.project2')}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t('landing.useCases.team.project2Detail')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Security Section */}
      <section className="py-20 lg:py-32" data-testid="section-data-security">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-semibold" data-testid="text-security-title">
              {t('landing.dataSecurity.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.dataSecurity.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover-elevate text-center" data-testid="card-security-encryption">
              <CardHeader>
                <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl">{t('landing.dataSecurity.encryption.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('landing.dataSecurity.encryption.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center" data-testid="card-security-retention">
              <CardHeader>
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl">{t('landing.dataSecurity.retention.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('landing.dataSecurity.retention.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center" data-testid="card-security-isolation">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl">{t('landing.dataSecurity.isolation.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('landing.dataSecurity.isolation.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-muted/30" data-testid="section-testimonials">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-semibold" data-testid="text-testimonials-title">
              {t('landing.testimonials.title')}
            </h2>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-medium">{t('landing.testimonials.rating')}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card data-testid="testimonial-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                    {t('landing.testimonials.alex.name').charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{t('landing.testimonials.alex.name')}</div>
                    <div className="text-sm text-muted-foreground">{t('landing.testimonials.alex.role')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "{t('landing.testimonials.alex.quote')}"
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardFooter>
            </Card>

            <Card data-testid="testimonial-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                    {t('landing.testimonials.maria.name').charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{t('landing.testimonials.maria.name')}</div>
                    <div className="text-sm text-muted-foreground">{t('landing.testimonials.maria.role')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "{t('landing.testimonials.maria.quote')}"
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardFooter>
            </Card>

            <Card data-testid="testimonial-3">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                    {t('landing.testimonials.david.name').charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{t('landing.testimonials.david.name')}</div>
                    <div className="text-sm text-muted-foreground">{t('landing.testimonials.david.role')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "{t('landing.testimonials.david.quote')}"
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
