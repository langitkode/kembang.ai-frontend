import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter">404</h2>
        <p className="text-[10px] font-mono text-accent uppercase font-bold tracking-[0.2em]">
          RESOURCE_NOT_FOUND
        </p>
      </div>
      <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
        The requested endpoint or management interface does not exist or has
        been relocated within the Kembang AI infrastructure.
      </p>
      <Link href="/" className="btn-primary">
        Return to Overview
      </Link>
    </div>
  );
}
