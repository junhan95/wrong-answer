import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Copy,
    Check,
    ExternalLink,
    ClipboardPaste,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    MousePointerClick,
    Menu,
    FileSearch,
    Zap,
    Save,
    RefreshCw,
    Puzzle,
    AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleDocsSetupWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GoogleDocsSetupWizard({ open, onOpenChange }: GoogleDocsSetupWizardProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [docsOpened, setDocsOpened] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [setupComplete, setSetupComplete] = useState(false);

    const handleOpenGoogleDocs = () => {
        window.open("https://docs.google.com/document/create", "_blank");
        setDocsOpened(true);
    };

    const handleCopyCode = async () => {
        try {
            const response = await fetch("/extensions/google-docs-addon.gs");
            const code = await response.text();
            await navigator.clipboard.writeText(code);
            setCodeCopied(true);
            toast({ title: t("settings.apps.googleDocsWizard.codeCopied") });
        } catch {
            toast({ title: t("settings.apps.googleDocsWizard.copyFailed"), variant: "destructive" });
        }
    };

    const handleComplete = () => {
        setSetupComplete(true);
    };

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setCurrentStep(0);
            setDocsOpened(false);
            setCodeCopied(false);
            setSetupComplete(false);
        }, 300);
    };

    const canProceed = () => {
        if (currentStep === 0) return docsOpened;
        if (currentStep === 1) return codeCopied;
        return true;
    };

    const StepIndicator = ({ step, label }: { step: number; label: string }) => {
        const isComplete = step < currentStep || setupComplete;
        const isCurrent = step === currentStep && !setupComplete;
        return (
            <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all ${
                    isComplete
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                            ? "border-primary text-primary bg-primary/10"
                            : "border-muted-foreground/30 text-muted-foreground/50"
                }`}>
                    {isComplete ? (
                        <Check className="h-3.5 w-3.5" />
                    ) : (
                        <span className="text-xs font-semibold">{step + 1}</span>
                    )}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${
                    isCurrent ? "text-foreground" : isComplete ? "text-primary" : "text-muted-foreground/50"
                }`}>{label}</span>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="flex items-center gap-2.5 text-base">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                        </div>
                        {t("settings.apps.googleDocsWizard.title")}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        {t("settings.apps.googleDocsWizard.desc")}
                    </p>
                </DialogHeader>

                {/* Step Indicator */}
                {!setupComplete && (
                    <div className="px-6 pb-4">
                        <div className="flex items-center justify-between">
                            <StepIndicator step={0} label={t("settings.apps.googleDocsWizard.stepLabel1")} />
                            <div className="flex-1 h-px bg-muted-foreground/20 mx-2" />
                            <StepIndicator step={1} label={t("settings.apps.googleDocsWizard.stepLabel2")} />
                            <div className="flex-1 h-px bg-muted-foreground/20 mx-2" />
                            <StepIndicator step={2} label={t("settings.apps.googleDocsWizard.stepLabel3")} />
                        </div>
                    </div>
                )}

                {/* Step Content */}
                <div className="px-6 pb-6">
                    {setupComplete ? (
                        /* Success State with Usage Guide */
                        <div className="flex flex-col gap-4">
                            {/* Success Header */}
                            <div className="flex items-center gap-3 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-green-400">{t("settings.apps.googleDocsWizard.successTitle")}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {t("settings.apps.googleDocsWizard.successDesc")}
                                    </p>
                                </div>
                            </div>

                            {/* How to Use */}
                            <div>
                                <p className="text-sm font-medium mb-3">{t("settings.apps.googleDocsWizard.howToUseTitle")}</p>
                                <div className="rounded-lg border bg-muted/30 p-3 mb-2">
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                                            <Menu className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium">{t("settings.apps.googleDocsWizard.howToStep1")}</p>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                                {t("settings.apps.googleDocsWizard.howToStep1Desc")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Available Features */}
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-2">{t("settings.apps.googleDocsWizard.availableFeatures")}</p>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2.5 rounded-md border bg-muted/20 p-2.5">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 flex-shrink-0 mt-0.5">
                                            <MousePointerClick className="h-3 w-3 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium">{t("settings.apps.googleDocsWizard.feature1Title")}</p>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">{t("settings.apps.googleDocsWizard.feature1Desc")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5 rounded-md border bg-muted/20 p-2.5">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 flex-shrink-0 mt-0.5">
                                            <FileSearch className="h-3 w-3 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium">{t("settings.apps.googleDocsWizard.feature2Title")}</p>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">{t("settings.apps.googleDocsWizard.feature2Desc")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5 rounded-md border bg-muted/20 p-2.5">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 flex-shrink-0 mt-0.5">
                                            <Zap className="h-3 w-3 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium">{t("settings.apps.googleDocsWizard.feature3Title")}</p>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">{t("settings.apps.googleDocsWizard.feature3Desc")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Note about per-document */}
                            <div className="flex items-start gap-2.5 rounded-md bg-amber-500/5 border border-amber-500/20 p-2.5">
                                <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] text-muted-foreground">{t("settings.apps.googleDocsWizard.perDocNote")}</p>
                            </div>

                            <Button onClick={handleClose} className="w-full">
                                {t("settings.apps.googleDocsWizard.done")}
                            </Button>
                        </div>
                    ) : currentStep === 0 ? (
                        /* Step 1: Open Google Docs */
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted flex-shrink-0 mt-0.5">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{t("settings.apps.googleDocsWizard.step1Title")}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {t("settings.apps.googleDocsWizard.step1Desc")}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleOpenGoogleDocs}
                                    variant={docsOpened ? "outline" : "default"}
                                    className="w-full"
                                    size="sm"
                                >
                                    {docsOpened ? (
                                        <>
                                            <Check className="h-4 w-4 mr-2 text-green-500" />
                                            {t("settings.apps.googleDocsWizard.docsOpened")}
                                        </>
                                    ) : (
                                        <>
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            {t("settings.apps.googleDocsWizard.openGoogleDocs")}
                                        </>
                                    )}
                                </Button>
                                {docsOpened && (
                                    <div className="rounded-md bg-primary/5 border border-primary/10 p-2.5">
                                        <div className="flex items-start gap-2">
                                            <Puzzle className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-muted-foreground">
                                                {t("settings.apps.googleDocsWizard.step1Hint")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setCurrentStep(1)}
                                    disabled={!canProceed()}
                                    size="sm"
                                >
                                    {t("settings.apps.googleDocsWizard.next")}
                                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                </Button>
                            </div>
                        </div>
                    ) : currentStep === 1 ? (
                        /* Step 2: Copy Code */
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted flex-shrink-0 mt-0.5">
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{t("settings.apps.googleDocsWizard.step2Title")}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {t("settings.apps.googleDocsWizard.step2Desc")}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleCopyCode}
                                    variant={codeCopied ? "outline" : "default"}
                                    className="w-full"
                                    size="sm"
                                >
                                    {codeCopied ? (
                                        <>
                                            <Check className="h-4 w-4 mr-2 text-green-500" />
                                            {t("settings.apps.googleDocsWizard.copied")}
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 mr-2" />
                                            {t("settings.apps.googleDocsWizard.copyCode")}
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="flex justify-between">
                                <Button
                                    onClick={() => setCurrentStep(0)}
                                    variant="ghost"
                                    size="sm"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                                    {t("settings.apps.googleDocsWizard.back")}
                                </Button>
                                <Button
                                    onClick={() => setCurrentStep(2)}
                                    disabled={!canProceed()}
                                    size="sm"
                                >
                                    {t("settings.apps.googleDocsWizard.next")}
                                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Step 3: Paste in Apps Script & Save */
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted flex-shrink-0 mt-0.5">
                                        <ClipboardPaste className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{t("settings.apps.googleDocsWizard.step3Title")}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {t("settings.apps.googleDocsWizard.step3Desc")}
                                        </p>
                                    </div>
                                </div>
                                <ol className="space-y-2.5 ml-1">
                                    <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 rounded-full">1</Badge>
                                        <span>{t("settings.apps.googleDocsWizard.step3Sub1")}</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 rounded-full">2</Badge>
                                        <span>{t("settings.apps.googleDocsWizard.step3Sub2")}</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 rounded-full">3</Badge>
                                        <span>{t("settings.apps.googleDocsWizard.step3Sub3")}</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 rounded-full">4</Badge>
                                        <span>{t("settings.apps.googleDocsWizard.step3Sub4")}</span>
                                    </li>
                                </ol>
                            </div>
                            <div className="flex justify-between">
                                <Button
                                    onClick={() => setCurrentStep(1)}
                                    variant="ghost"
                                    size="sm"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                                    {t("settings.apps.googleDocsWizard.back")}
                                </Button>
                                <Button
                                    onClick={handleComplete}
                                    size="sm"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                    {t("settings.apps.googleDocsWizard.complete")}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
