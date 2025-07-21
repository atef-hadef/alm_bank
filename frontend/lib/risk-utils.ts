/**
 * Utilitaires pour la gestion et l'affichage des risques
 */

/**
 * Détermine le niveau de risque textuel en fonction du score
 * @param riskScore Score de risque entre 0 et 1
 * @returns Niveau de risque textuel
 */
export function getRiskLevel(riskScore: number): string {
  if (riskScore > 0.7) return "Élevé";
  if (riskScore > 0.4) return "Modéré";
  return "Faible";
}

/**
 * Retourne les classes CSS pour l'affichage du badge de risque
 * @param riskScore Score de risque entre 0 et 1
 * @returns Classes CSS pour le badge
 */
export function getRiskBadgeClasses(riskScore: number): string {
  const baseClasses = "rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  if (riskScore > 0.7) {
    return `${baseClasses} bg-red-100 text-red-800`;
  } else if (riskScore > 0.4) {
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  } else {
    return `${baseClasses} bg-green-100 text-green-800`;
  }
}

/**
 * Retourne les classes CSS pour l'affichage du badge de risque dans un tableau
 * @param riskScore Score de risque entre 0 et 1
 * @returns Classes CSS pour le badge dans un tableau
 */
export function getRiskTableBadgeClasses(riskScore: number): string {
  const baseClasses = "px-2 py-1 rounded text-xs font-medium";
  
  if (riskScore > 0.7) {
    return `${baseClasses} bg-red-100 text-red-800`;
  } else if (riskScore > 0.4) {
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  } else {
    return `${baseClasses} bg-green-100 text-green-800`;
  }
}

/**
 * Retourne la couleur de fond pour les graphiques en fonction du niveau de risque
 * @param riskScore Score de risque entre 0 et 1
 * @returns Couleur hexadécimale
 */
export function getRiskColor(riskScore: number): string {
  if (riskScore > 0.7) {
    return "#ef4444"; // Rouge
  } else if (riskScore > 0.4) {
    return "#f59e0b"; // Jaune/Orange
  } else {
    return "#10b981"; // Vert
  }
}

/**
 * Formate le score de risque pour l'affichage
 * @param riskScore Score de risque entre 0 et 1
 * @returns Score formaté (ex: 0.75 -> 75%)
 */
export function formatRiskScore(riskScore: number): string {
  return `${(riskScore * 100).toFixed(0)}%`;
}


