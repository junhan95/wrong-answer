import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FolderTree, MessageSquare, FileText, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const TUTORIAL_KEY = "wisequery_tutorial_completed";

interface TutorialStep {
    icon: React.ReactNode;
    titleKey: string;
    descriptionKey: string;
    // CSS position for the tooltip card
    position: "center" | "left" | "middle" | "right";
}

const steps: TutorialStep[] = [
    {
        icon: <Sparkles className="h-6 w-6" />,
        titleKey: "tutorial.steps.welcome.title",
        descriptionKey: "tutorial.steps.welcome.description",
        position: "center",
    },
    {
        icon: <FolderTree className="h-6 w-6" />,
        titleKey: "tutorial.steps.sidebar.title",
        descriptionKey: "tutorial.steps.sidebar.description",
        position: "left",
    },
    {
        icon: <FileText className="h-6 w-6" />,
        titleKey: "tutorial.steps.files.title",
        descriptionKey: "tutorial.steps.files.description",
        position: "middle",
    },
    {
        icon: <MessageSquare className="h-6 w-6" />,
        titleKey: "tutorial.steps.chat.title",
        descriptionKey: "tutorial.steps.chat.description",
        position: "right",
    },
    {
        icon: <Sparkles className="h-6 w-6" />,
        titleKey: "tutorial.steps.done.title",
        descriptionKey: "tutorial.steps.done.description",
        position: "center",
    },
];

interface OnboardingTutorialProps {
    forceShow?: boolean;
    onClose?: () => void;
}

export function OnboardingTutorial({ forceShow, onClose }: OnboardingTutorialProps) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (forceShow) {
            setCurrentStep(0);
            setVisible(true);
            return;
        }
        const done = localStorage.getItem(TUTORIAL_KEY);
        if (!done) {
            setVisible(true);
        }
    }, [forceShow]);

    const finish = useCallback(() => {
        localStorage.setItem(TUTORIAL_KEY, "true");
        setVisible(false);
        onClose?.();
    }, [onClose]);

    const next = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((s) => s + 1);
        } else {
            finish();
        }
    };

    if (!visible) return null;

    const step = steps[currentStep];

    // Spotlight clip-path per step position
    const getSpotlightStyle = (): React.CSSProperties => {
        if (step.position === "center") {
            return { background: "rgba(0,0,0,0.75)" };
        }
        // Create a spotlight effect by darkening everything except a region
        // These percentages roughly match the panel layout
        const regions: Record<string, string> = {
            left: "polygon(0% 0%, 18% 0%, 18% 100%, 0% 100%)",
            middle: "polygon(18% 0%, 55% 0%, 55% 100%, 18% 100%)",
            right: "polygon(55% 0%, 100% 0%, 100% 100%, 55% 100%)",
        };
        const region = regions[step.position];
        // Use a pseudo-overlay approach: dark overlay with a transparent cutout
        return {
            background: "rgba(0,0,0,0.75)",
            // We'll use a CSS mask to cut out the spotlight area
            WebkitMaskImage: `linear-gradient(#000,#000)`,
            maskImage: `linear-gradient(#000,#000)`,
        };
    };

    // Card position based on step
    const getCardPosition = (): string => {
        switch (step.position) {
            case "center":
                return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
            case "left":
                return "top-1/2 left-[22%] -translate-y-1/2";
            case "middle":
                return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
            case "right":
                return "top-1/2 right-[5%] -translate-y-1/2";
            default:
                return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
        }
    };

    // Spotlight cutout overlay: render two layers
    const spotlightRegions: Record<string, { left: string; width: string }> = {
        left: { left: "0%", width: "18%" },
        middle: { left: "18%", width: "37%" },
        right: { left: "55%", width: "45%" },
    };

    return (
        <div className="fixed inset-0 z-[9999]" data-testid="onboarding-tutorial">
            {/* Dark overlay */}
            {step.position === "center" ? (
                <div className="absolute inset-0 bg-black/75" />
            ) : (
                <>
                    {/* Full dark overlay */}
                    <div className="absolute inset-0 bg-black/75" />
                    {/* Spotlight cutout (lighter area) */}
                    <div
                        className="absolute top-0 bottom-0 border-2 border-primary/50 rounded-sm"
                        style={{
                            left: spotlightRegions[step.position]?.left,
                            width: spotlightRegions[step.position]?.width,
                            background: "rgba(0,0,0,0.15)",
                            boxShadow: "0 0 0 2px hsl(var(--primary) / 0.3)",
                        }}
                    />
                </>
            )}

            {/* Tooltip Card */}
            <div className={`absolute ${getCardPosition()} z-10`}>
                <Card className="w-[360px] shadow-2xl border-primary/20">
                    <CardContent className="p-6">
                        {/* Close button */}
                        <button
                            onClick={finish}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                            data-testid="tutorial-close"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                            {step.icon}
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold mb-2">
                            {t(step.titleKey)}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            {t(step.descriptionKey)}
                        </p>

                        {/* Progress & Buttons */}
                        <div className="flex items-center justify-between">
                            {/* Step indicator */}
                            <div className="flex gap-1.5">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all ${i === currentStep
                                                ? "w-6 bg-primary"
                                                : i < currentStep
                                                    ? "w-1.5 bg-primary/50"
                                                    : "w-1.5 bg-muted"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2">
                                {currentStep < steps.length - 1 && (
                                    <Button variant="ghost" size="sm" onClick={finish} data-testid="tutorial-skip">
                                        {t("tutorial.skip")}
                                    </Button>
                                )}
                                <Button size="sm" onClick={next} data-testid="tutorial-next">
                                    {currentStep === steps.length - 1
                                        ? t("tutorial.start")
                                        : t("tutorial.next")}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
