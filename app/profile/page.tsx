import { verifySession } from "@/lib/session";
import { Paths } from "@/serverConfig";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const session = await verifySession();
  if (!session) redirect(Paths.HOME);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <ProfileForm user={session} />
    </main>
  );
}

function ProfileSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-4 w-96 bg-muted rounded"></div>
      </div>
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded"></div>
        <div className="h-10 bg-muted rounded"></div>
        <div className="h-10 bg-muted rounded"></div>
        <div className="h-10 bg-muted rounded"></div>
      </div>
    </main>
  );
}
