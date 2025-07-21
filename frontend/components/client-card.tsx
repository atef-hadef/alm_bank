import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/risk-badge";
import { RiskIndicator } from "@/components/risk-indicator";

interface ClientCardProps {
  client: any;
  onClick?: () => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{client.name}</CardTitle>
          <RiskBadge riskScore={client.calculatedRisk} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="text-right font-medium">{client.type}</span>
            
            <span className="text-muted-foreground">Prêt:</span>
            <span className="text-right font-medium">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(client.loanAmount)}
            </span>
            
            <span className="text-muted-foreground">Dépôt:</span>
            <span className="text-right font-medium">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(client.depositAmount)}
            </span>
          </div>
          
          <div className="pt-2">
            <RiskIndicator riskScore={client.calculatedRisk} size="sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}