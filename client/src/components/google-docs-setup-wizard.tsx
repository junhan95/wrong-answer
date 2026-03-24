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
    Circle,
    Sparkles,
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
    const [codeCopied, setCodeCopied] = useState(false);
    const [appsScriptOpened, setAppsScriptOpened] = useState(false);
    const [setupComplete, setSetupComplete] = useState(false);

    const totalSteps = 3;

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

    const handleOpenAppsScript = () => {
        window.open("https://script.google.com/home/start", "_blank");
        setAppsScriptOpened(true);
    };

    const handleComplete = () => {
        setSetupComplete(true);
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after close animation
        setTimeout(() => {
            setCurrentStep(0);
            setCodeCopied(false);
            setAppsScriptOpened(false);
            setSetupComplete(false);
        }, 300);
    };

    const canProceed = () => {
        if (currentStep === 0) return codeCopied;
        if (currentStep === 1) return appsScriptOpened;
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
                        /* Success State */
                        <div className="flex flex-col items-center text-center py-6 gap-4">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{t("settings.apps.googleDocsWizard.successTitle")}</h3>
                                <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
                                    {t("settings.apps.googleDocsWizard.successDesc")}
                                </p>
                            </div>
                            <div className="w-full rounded-lg border bg-muted/30 p-3 text-left">
                                <p className="text-xs font-medium text-muted-foreground mb-2">{t("settings.apps.googleDocsWizard.availableFeatures")}</p>
                                <ul className="space-y-1.5">
                                    <li className="flex items-center gap-2 text-sm">
                                        <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                        {t("settings.apps.googleDocsWizard.feature1")}
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                        {t("settings.apps.googleDocsWizard.feature2")}
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                        {t("settings.apps.googleDocsWizard.feature3")}
                                    </li>
                                </ul>
                            </div>
                            <Button onClick={handleClose} className="w-full mt-2">
                                {t("settings.apps.googleDocsWizard.done")}
                            </Button>
                        </div>
                    ) : currentStep === 0 ? (
                        /* Step 1: Copy Code */
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted flex-shrink-0 mt-0.5">
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{t("settings.apps.googleDocsWizard.step1Title")}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {t("settings.apps.googleDocsWizard.step1Desc")}
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
                        /* Step 2: Open Apps Script */
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted flex-shrink-0 mt-0.5">
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{t("settings.apps.googleDocsWizard.step2Title")}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {t("settings.apps.googleDocsWizard.step2Desc")}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleOpenAppsScript}
                                    variant={appsScriptOpened ? "outline" : "default"}
                                    className="w-full"
                                    size="sm"
                                >
                                    {appsScriptOpened ? (
                                        <>
                                            <Check className="h-4 w-4 mr-2 text-green-500" />
                                            {t("settings.apps.googleDocsWizard.opened")}
                                        </>
                                    ) : (
                                        <>
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            {t("settings.apps.googleDocsWizard.openAppsScript")}
                                        </>
                                    )}
                                </Button>
                                {appsScriptOpened && (
                                    <div className="rounded-md bg-primary/5 border border-primary/10 p-2.5">
                                        <p className="text-xs text-muted-foreground">
                                            {t("settings.apps.googleDocsWizard.step2Hint")}
                                        </p>
                                    </div>
                                )}
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
                        /* Step 3: Paste, Save & Verify */
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
                                <ol className="space-y-2 ml-1">
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
