import { Brain, Zap, Layout, Mail, Globe, Target } from 'lucide-react';
import { ServicePackage, FeatureItem } from './types';

export const APP_NAME = "AFA MEDIA";

export const SERVICES: ServicePackage[] = [
  {
    id: 'core',
    title: 'AI SmartSite + Meta Ads',
    description: 'The ultimate lead generation engine. A high-conversion landing page coupled with AI-optimized traffic.',
    features: [
      'Conversion-Focused "SmartSite"',
      'AI-Driven Meta Ad Campaigns',
      'Automated Lead Nurturing',
      'Real-time Analytics Dashboard',
      'CRM Integration'
    ],
    highlight: true,
    priceRange: 'Starting at $2,500/mo'
  },
  {
    id: 'addon',
    title: 'Sales Email Copywriting',
    description: 'Turn cold leads into hot prospects with psychology-backed email sequences.',
    features: [
      '5-Email Welcome Sequence',
      'Abandoned Cart Recovery',
      'Weekly Newsletter Content',
      'A/B Tested Subject Lines'
    ],
    highlight: false
  },
  {
    id: 'upgrade',
    title: 'Full Multi-Page Upgrade',
    description: 'Expand your digital footprint with a complete, SEO-optimized brand website.',
    features: [
      '5+ Custom Pages',
      'Advanced SEO Setup',
      'Blog/Content Hub',
      'CMS Integration',
      'Custom Animations'
    ],
    highlight: false
  }
];

export const PAIN_POINTS: FeatureItem[] = [
  {
    title: "Traditional Websites Are Dead",
    description: "Most websites are digital brochures that look pretty but fail to convert traffic into paying clients.",
    icon: Layout
  },
  {
    title: "Ads Without Systems Fail",
    description: "Throwing money at Meta Ads without a dedicated conversion mechanism is burning cash.",
    icon: Zap
  },
  {
    title: "Manual Follow-up is Slow",
    description: "If you aren't contacting leads within 5 minutes, you're losing 80% of your opportunities.",
    icon: Mail
  }
];

export const SOLUTIONS: FeatureItem[] = [
  {
    title: "AI-Powered Optimization",
    description: "Our systems learn from every interaction, constantly improving your cost-per-acquisition.",
    icon: Brain
  },
  {
    title: "Hyper-Targeted Reach",
    description: "We use predictive AI to place your offer in front of your ideal customer exactly when they are ready to buy.",
    icon: Target
  },
  {
    title: "Global Scalability",
    description: "Built on infrastructure that scales instantly as your business grows from 10 to 10k leads.",
    icon: Globe
  }
];