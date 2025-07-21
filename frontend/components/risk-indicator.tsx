import { getRiskColor, getRiskLevel } from "@/lib/utils";

interface RiskIndicatorProps {
  riskScore: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function RiskIndicator({ 
  riskScore, 
  showLabel = true, 
  size = "md", 
  showValue = false 
}: RiskIndicatorProps) {
  const level = getRiskLevel(riskScore);
  const color = getRiskColor(riskScore);
  
  // Définir les tailles
  const sizes = {
    sm: {
      container: "h-1.5",
      text: "text-xs mt-1"
    },
    md: {
      container: "h-2",
      text: "text-sm mt-1.5"
    },
    lg: {
      container: "h-3",
      text: "text-base mt-2"
    }
  };
  
  return (
    <div className="w-full">
      <div className={`w-full rounded-full bg-gray-200 ${sizes[size].container}`}>
        <div
          className={`rounded-full ${sizes[size].container}`}
          style={{ 
            width: `${riskScore * 100}%`, 
            backgroundColor: color 
          }}
        ></div>
      </div>
      
      {showLabel && (
        <div className={`flex justify-between ${sizes[size].text}`}>
          <span className="text-gray-600">
            {showValue ? `${level} (${(riskScore * 100).toFixed(0)}%)` : level}
          </span>
          <span className="text-gray-500">
            {(riskScore * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}