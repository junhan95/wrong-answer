import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, CreditCard, Crown, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { toast } = useToast();
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");

    const { data: subscriptionData } = useQuery<{
        subscription: { plan: string; stripeStatus: string | null };
        usage: { projects: number; conversations: number; aiQueries: number; storageGB: number };
        limits: { projects: number; conversations: number; aiQueries: number; storageGB: number };
    }>({
        queryKey: ["/api/subscription"],
        enabled: open,
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data: { firstName: string; lastName: string }) => {
            const res = await apiRequest("PATCH", "/api/auth/profile", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            toast({ title: t("settings.profile.saved") });
        },
        onError: () => {
            toast({ title: t("settings.profile.saveFailed"), variant: "destructive" });
        },
    });

    const portalMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", "/api/customer-portal");
            return res.json();
        },
        onSuccess: (data: { url: string }) => {
            window.open(data.url, "_blank");
        },
    });

    const plan = subscriptionData?.subscription?.plan || "free";
    const usage = subscriptionData?.usage;
    const limits = subscriptionData?.limits;

    const planLabel = (p: string) => {
        const labels: Record<string, string> = { free: "Free", basic: "Basic", pro: "Pro", custom: "Custom" };
        return labels[p] || p;
    };

    const formatLimit = (value: number) => {
        return value < 0 ? t("common.unlimited") : String(value);
    };

    const getUserInitials = () => {
        if (!user) return "?";
        if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        if (user.firstName) return user.firstName[0].toUpperCase();
        if (user.email) return user.email[0].toUpperCase();
        return "?";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t("settings.title")}</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="profile" className="mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {t("settings.profile.tab")}
                        </TabsTrigger>
                        <TabsTrigger value="membership" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            {t("settings.membership.tab")}
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-4 mt-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user?.profileImageUrl || undefined} />
                                <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.email}</p>
                                <p className="text-xs text-muted-foreground">{user?.authProvider || "email"}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="firstName">{t("settings.profile.firstName")}</Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder={t("settings.profile.firstNamePlaceholder")}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="lastName">{t("settings.profile.lastName")}</Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder={t("settings.profile.lastNamePlaceholder")}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={() => updateProfileMutation.mutate({ firstName, lastName })}
                            disabled={updateProfileMutation.isPending}
                            className="w-full"
                        >
                            {updateProfileMutation.isPending ? t("common.loading") : t("common.save")}
                        </Button>
                    </TabsContent>

                    {/* Membership Tab */}
                    <TabsContent value="membership" className="space-y-4 mt-4">
                        {/* Current Plan */}
                        <div className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-primary" />
                                    <span className="font-medium">{t("settings.membership.currentPlan")}</span>
                                </div>
                                <Badge variant={plan === "free" ? "secondary" : "default"}>
                                    {planLabel(plan)}
                                </Badge>
                            </div>
                            {subscriptionData?.subscription?.stripeStatus && (
                                <p className="text-xs text-muted-foreground">
                                    {t("settings.membership.status")}: {subscriptionData.subscription.stripeStatus}
                                </p>
                            )}
                        </div>

                        {/* Usage */}
                        {usage && limits && (
                            <div className="rounded-lg border p-4 space-y-3">
                                <span className="font-medium text-sm">{t("settings.membership.usage")}</span>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>{t("settings.membership.projects")}</span>
                                        <span className="text-muted-foreground">{usage.projects} / {formatLimit(limits.projects)}</span>
                                    </div>
                                    {limits.projects > 0 && (
                                        <Progress value={Math.min((usage.projects / limits.projects) * 100, 100)} className="h-1.5" />
                                    )}

                                    <div className="flex items-center justify-between text-sm">
                                        <span>{t("settings.membership.conversations")}</span>
                                        <span className="text-muted-foreground">{usage.conversations} / {formatLimit(limits.conversations)}</span>
                                    </div>
                                    {limits.conversations > 0 && (
                                        <Progress value={Math.min((usage.conversations / limits.conversations) * 100, 100)} className="h-1.5" />
                                    )}

                                    <div className="flex items-center justify-between text-sm">
                                        <span>{t("settings.membership.storage")}</span>
                                        <span className="text-muted-foreground">{usage.storageGB}GB / {formatLimit(limits.storageGB)}GB</span>
                                    </div>
                                    {limits.storageGB > 0 && (
                                        <Progress value={Math.min((usage.storageGB / limits.storageGB) * 100, 100)} className="h-1.5" />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-2">
                            {plan === "free" ? (
                                <Button
                                    className="w-full"
                                    onClick={() => window.location.href = "/pricing"}
                                >
                                    <Crown className="h-4 w-4 mr-2" />
                                    {t("settings.membership.upgrade")}
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => portalMutation.mutate()}
                                    disabled={portalMutation.isPending}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    {t("settings.membership.manageSubscription")}
                                </Button>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
