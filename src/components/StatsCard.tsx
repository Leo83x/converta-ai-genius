
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  description: string;
}

const StatsCard = ({ title, value, change, changeType, description }: StatsCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`text-2xl ${getChangeColor()}`}>
            {getChangeIcon()}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </span>
          <span className="text-sm text-gray-500">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
