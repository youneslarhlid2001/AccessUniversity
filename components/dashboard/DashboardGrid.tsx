import { cn } from '@/lib/utils';

export function DashboardGrid({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4", className)}>
            {children}
        </div>
    );
}
