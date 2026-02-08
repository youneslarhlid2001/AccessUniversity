import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
    className?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, className }: StatCardProps) {
    return (
        <div className={cn("rounded-xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                {icon && <div className="text-muted-foreground text-gray-400">{icon}</div>}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {change && (
                    <span className={cn(
                        'flex items-center text-sm font-medium',
                        changeType === 'positive' && 'text-green-600',
                        changeType === 'negative' && 'text-red-600',
                        changeType === 'neutral' && 'text-gray-600',
                    )}>
                        {changeType === 'positive' && <TrendingUp className="h-4 w-4 mr-1" />}
                        {changeType === 'negative' && <TrendingDown className="h-4 w-4 mr-1" />}
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}
