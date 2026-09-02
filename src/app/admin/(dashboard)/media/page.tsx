import { MediaManager } from "@/components/admin/media-picker";

export const dynamic = "force-dynamic";

export default function AdminMediaPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola gambar untuk portfolio dan artikel — upload dari perangkat atau gunakan URL
          eksternal (disarankan untuk deployment serverless).
        </p>
      </div>
      <MediaManager />
    </div>
  );
}
