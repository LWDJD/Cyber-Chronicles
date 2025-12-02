export interface EraData {
  id: string;
  title: string;
  period: string;
  description: string;
  details: string[]; // Array of paragraphs for detailed explanation
  themeColor: string;
  icon: React.ElementType;
  features: string[];
  techStats: { label: string; value: string }[];
}

export type EraId = 'genesis' | 'dawn' | 'dotcom' | 'web2' | 'mobile' | 'future';