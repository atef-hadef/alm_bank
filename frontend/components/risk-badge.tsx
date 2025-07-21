import { getRiskBadgeClasses, getRiskLevel } from "@/lib/utils";

interface RiskBadgeProps {
  riskScore: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({ riskScore, showValue = false, size = "md" }: RiskBadgeProps) {
  const level = getRiskLevel(riskScore);
  const classes = getRiskBadgeClasses(riskScore);
  
  // Ajuster les classes en fonction de la taille
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1"
  };
  
  // Remplacer les classes de taille par défaut par celles spécifiées
  const finalClasses = classes.replace(
    /px-\d+(\.\d+)? py-\d+(\.\d+)? text-\w+/,
    sizeClasses[size]
  );
  
  return (
    <div className={finalClasses}>
      {showValue ? `${level} (${(riskScore * 100).toFixed(0)}%)` : level}
    </div>
  );
}