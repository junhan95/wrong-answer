import { useState, useRef } from "react";
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
import { User, CreditCard, Crown, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [department, setDepartment] = useState((user as any)?.department || "");
    const [jobTitle, setJobTitle] = useState((user as any)?.jobTitle || "");
    const [phone, setPhone] = useState((user as any)?.phone || "");

    const { data: subscriptionData } = useQuery<{
        subscription: { plan: string };
        usage: { projects: number; conversations: number; aiQueries: number; storageMB: number };
        limits: { projects: number; conversations?: number; aiQueries: number; storageMB: number };
    }>({
        queryKey: ["/api/subscription"],
        enabled: open,
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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImageMutation.mutate(file);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
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
                                        <span className="text-muted-foreground">{usage.conversations} / {formatLimit(limits.conversations ?? -1)}</span>
                                    </div>
                                    {(limits.conversations ?? -1) > 0 && (
                                        <Progress value={Math.min((usage.conversations / (limits.conversations ?? -1)) * 100, 100)} className="h-1.5" />
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
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
