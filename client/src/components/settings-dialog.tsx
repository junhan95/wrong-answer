import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User, CreditCard, Crown, Camera, AlertTriangle, ArrowDown, X, Trash2, Download, Shield, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
    onClose?: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [department, setDepartment] = useState((user as any)?.department || "");
    const [jobTitle, setJobTitle] = useState((user as any)?.jobTitle || "");
    const [phone, setPhone] = useState((user as any)?.phone || "");
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    const { data: subscriptionData } = useQuery<{
        subscription: { plan: string };
        usage: { projects: number; conversations: number; aiQueries: number; storageMB: number };
        limits: { projects: number; conversations: number; aiQueries: number; storageMB: number };
    }>({
        queryKey: ["/api/subscription"],
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data: { firstName: string; lastName: string; department: string; jobTitle: string; phone: string }) => {
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

    const uploadImageMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/auth/profile/image", {
                method: "POST",
                body: formData,
                credentials: "include",
            });
            if (!res.ok) throw new Error("Upload failed");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            toast({ title: t("settings.profile.imageUploaded") });
        },
        onError: () => {
            toast({ title: t("settings.profile.imageUploadFailed"), variant: "destructive" });
        },
    });

    const cancelSubscriptionMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", "/api/subscription/cancel");
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
            setCancelDialogOpen(false);
            if (data.scheduled) {
                toast({ title: t("settings.membership.cancelScheduled", { date: new Date(data.effectiveDate).toLocaleDateString() }) });
            } else {
                toast({ title: t("settings.membership.cancelSuccess") });
            }
        },
        onError: () => {
            toast({ title: t("settings.membership.cancelFailed"), variant: "destructive" });
        },
    });

    const downgradeSubscriptionMutation = useMutation({
        mutationFn: async (targetPlan: string) => {
            const res = await apiRequest("POST", "/api/subscription/downgrade", { targetPlan });
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
            setDowngradeDialogOpen(false);
            if (data.scheduled) {
                toast({ title: t("settings.membership.downgradeScheduled", { date: new Date(data.effectiveDate).toLocaleDateString() }) });
            } else {
                toast({ title: t("settings.membership.downgradeSuccess") });
            }
        },
        onError: () => {
            toast({ title: t("settings.membership.downgradeFailed"), variant: "destructive" });
        },
    });

    const deleteAccountMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("DELETE", "/api/auth/account", { confirmation: "DELETE_MY_ACCOUNT" });
            return res.json();
        },
        onSuccess: () => {
            window.location.href = "/";
        },
        onError: () => {
            toast({ title: t("settings.account.deleteFailed"), variant: "destructive" });
        },
    });

    const handleExportData = () => {
        window.open("/api/auth/export", "_blank");
    };

    const plan = subscriptionData?.subscription?.plan || "free";
    const usage = subscriptionData?.usage;
    const limits = subscriptionData?.limits;
    const subscription = subscriptionData?.subscription;

    const billingCycleStart = subscription?.billingCycleStart ? new Date(subscription.billingCycleStart) : null;
    const billingCycleEnd = subscription?.billingCycleEnd ? new Date(subscription.billingCycleEnd) : null;
    const pendingPlan = subscription?.pendingPlan || null;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(i18n.language === "ko" ? "ko-KR" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getRemainingDays = () => {
        if (!billingCycleEnd) return 0;
        const now = new Date();
        const diff = billingCycleEnd.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const cancelPendingMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", "/api/subscription/cancel-pending");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
            toast({ title: t("settings.membership.cancelPendingSuccess") });
        },
    });

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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImageMutation.mutate(file);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="w-full max-w-xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">{t("settings.title")}</h2>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>

                <Tabs defaultValue="profile">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {t("settings.profile.tab")}
                        </TabsTrigger>
                        <TabsTrigger value="membership" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            {t("settings.membership.tab")}
                        </TabsTrigger>
                        <TabsTrigger value="account" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {t("settings.account.tab")}
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-4 mt-4">
                        {/* Avatar with upload */}
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user?.profileImageUrl || undefined} />
                                    <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                                </Avatar>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    disabled={uploadImageMutation.isPending}
                                >
                                    <Camera className="h-5 w-5 text-white" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.email}</p>
                                <p className="text-xs text-muted-foreground">{user?.authProvider || "email"}</p>
                                {uploadImageMutation.isPending && (
                                    <p className="text-xs text-primary">{t("common.loading")}</p>
                                )}
                            </div>
                        </div>

                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-3">
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

                        {/* Additional fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="department">{t("settings.profile.department")}</Label>
                                <Input
                                    id="department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    placeholder={t("settings.profile.departmentPlaceholder")}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="jobTitle">{t("settings.profile.jobTitle")}</Label>
                                <Input
                                    id="jobTitle"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder={t("settings.profile.jobTitlePlaceholder")}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone">{t("settings.profile.phone")}</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder={t("settings.profile.phonePlaceholder")}
                            />
                        </div>

                        <Button
                            onClick={() => updateProfileMutation.mutate({ firstName, lastName, department, jobTitle, phone })}
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

                            {/* Billing Period Info */}
                            {plan !== "free" && billingCycleStart && billingCycleEnd && (
                                <div className="space-y-2 pt-2 border-t">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {t("settings.membership.billingStart")}
                                        </span>
                                        <span>{formatDate(billingCycleStart)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {t("settings.membership.billingEnd")}
                                        </span>
                                        <span>{formatDate(billingCycleEnd)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            {t("settings.membership.remainingDays")}
                                        </span>
                                        <Badge variant={getRemainingDays() <= 7 ? "destructive" : "outline"}>
                                            {t("settings.membership.daysLeft", { days: getRemainingDays() })}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {/* Pending Plan Change Notice */}
                            {pendingPlan && (
                                <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 space-y-2">
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                                        {t("settings.membership.pendingChange", {
                                            plan: planLabel(pendingPlan),
                                            date: billingCycleEnd ? formatDate(billingCycleEnd) : "",
                                        })}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => cancelPendingMutation.mutate()}
                                        disabled={cancelPendingMutation.isPending}
                                        className="text-xs h-7"
                                    >
                                        {t("settings.membership.cancelPending")}
                                    </Button>
                                </div>
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
                                        <span>{t("settings.membership.aiQueries")}</span>
                                        <span className="text-muted-foreground">{usage.aiQueries} / {formatLimit(limits.aiQueries)}</span>
                                    </div>
                                    {limits.aiQueries > 0 && (
                                        <Progress value={Math.min((usage.aiQueries / limits.aiQueries) * 100, 100)} className="h-1.5" />
                                    )}

                                    <div className="flex items-center justify-between text-sm">
                                        <span>{t("settings.membership.storage")}</span>
                                        <span className="text-muted-foreground">{usage.storageMB}MB / {formatLimit(limits.storageMB)}{limits.storageMB > 0 ? "MB" : ""}</span>
                                    </div>
                                    {limits.storageMB > 0 && (
                                        <Progress value={Math.min((usage.storageMB / limits.storageMB) * 100, 100)} className="h-1.5" />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button
                                className="w-full"
                                onClick={() => window.location.href = "/pricing"}
                            >
                                <Crown className="h-4 w-4 mr-2" />
                                {plan === "free" ? t("settings.membership.upgrade") : t("settings.membership.viewPlans")}
                            </Button>

                            {/* Downgrade (Pro → Basic) */}
                            {plan === "pro" && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setDowngradeDialogOpen(true)}
                                >
                                    <ArrowDown className="h-4 w-4 mr-2" />
                                    {t("settings.membership.downgradeToBasic")}
                                </Button>
                            )}

                            {/* Cancel subscription */}
                            {plan !== "free" && (
                                <Button
                                    variant="ghost"
                                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => setCancelDialogOpen(true)}
                                >
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    {t("settings.membership.cancelSubscription")}
                                </Button>
                            )}
                        </div>

                        {/* Cancel Subscription Dialog */}
                        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t("settings.membership.cancelConfirmTitle")}</AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className="space-y-2">
                                            <p>{t("settings.membership.cancelConfirmDesc")}</p>
                                            {billingCycleEnd && (
                                                <p className="text-sm font-medium">
                                                    {t("settings.membership.cancelScheduledNote", { date: formatDate(billingCycleEnd) })}
                                                </p>
                                            )}
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => cancelSubscriptionMutation.mutate()}
                                        disabled={cancelSubscriptionMutation.isPending}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {cancelSubscriptionMutation.isPending
                                            ? t("common.loading")
                                            : t("settings.membership.cancelConfirmAction")}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Downgrade Dialog */}
                        <AlertDialog open={downgradeDialogOpen} onOpenChange={setDowngradeDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t("settings.membership.downgradeConfirmTitle")}</AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className="space-y-2">
                                            <p>{t("settings.membership.downgradeConfirmDesc")}</p>
                                            {billingCycleEnd && (
                                                <p className="text-sm font-medium">
                                                    {t("settings.membership.downgradeScheduledNote", { date: formatDate(billingCycleEnd) })}
                                                </p>
                                            )}
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => downgradeSubscriptionMutation.mutate("basic")}
                                        disabled={downgradeSubscriptionMutation.isPending}
                                    >
                                        {downgradeSubscriptionMutation.isPending
                                            ? t("common.loading")
                                            : t("settings.membership.downgradeConfirmAction")}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TabsContent>

                    {/* Account Tab */}
                    <TabsContent value="account" className="space-y-4 mt-4">
                        {/* Data Backup */}
                        <div className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Download className="h-5 w-5 text-primary" />
                                <span className="font-medium">{t("settings.account.exportTitle")}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t("settings.account.exportDesc")}
                            </p>
                            <Button variant="outline" className="w-full" onClick={handleExportData}>
                                <Download className="h-4 w-4 mr-2" />
                                {t("settings.account.exportButton")}
                            </Button>
                        </div>

                        {/* Delete Account */}
                        <div className="rounded-lg border border-destructive/30 p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-5 w-5 text-destructive" />
                                <span className="font-medium text-destructive">{t("settings.account.deleteTitle")}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t("settings.account.deleteDesc")}
                            </p>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => {
                                    setDeleteConfirmText("");
                                    setDeleteAccountDialogOpen(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("settings.account.deleteButton")}
                            </Button>
                        </div>

                        {/* Delete Account Confirmation Dialog */}
                        <AlertDialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="h-5 w-5" />
                                        {t("settings.account.deleteConfirmTitle")}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className="space-y-3">
                                            <p className="font-medium text-destructive">
                                                {t("settings.account.deleteWarning")}
                                            </p>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-start gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                                    <span>{t("settings.account.deleteWarn1")}</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                                    <span>{t("settings.account.deleteWarn2")}</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                                    <span>{t("settings.account.deleteWarn3")}</span>
                                                </li>
                                            </ul>
                                            <div className="rounded-md bg-primary/10 border border-primary/20 p-3 text-sm">
                                                <p className="flex items-start gap-2">
                                                    <Download className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                    <span>{t("settings.account.deleteBackupHint")}</span>
                                                </p>
                                            </div>
                                            <div className="space-y-2 pt-2">
                                                <Label htmlFor="delete-confirm" className="text-sm">
                                                    {t("settings.account.deleteConfirmLabel")}
                                                </Label>
                                                <Input
                                                    id="delete-confirm"
                                                    value={deleteConfirmText}
                                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                                    placeholder={t("settings.account.deleteConfirmPlaceholder")}
                                                    className="border-destructive/30 focus-visible:ring-destructive"
                                                />
                                            </div>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => deleteAccountMutation.mutate()}
                                        disabled={deleteConfirmText !== t("settings.account.deleteConfirmText") || deleteAccountMutation.isPending}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {deleteAccountMutation.isPending
                                            ? t("common.loading")
                                            : t("settings.account.deleteConfirmAction")}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
