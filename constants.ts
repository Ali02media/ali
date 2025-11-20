
import { Brain, Zap, Layout, Mail, Globe, Target } from 'lucide-react';
import { ServicePackage, FeatureItem } from './types';

export const APP_NAME = "AFA MEDIA";

// Replaced placeholder with actual Google Apps Script Deployment URL
export const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzIevFO7jr2wqmc1jm_-lITVmVa5dPGFOhL8tdt3J6LcFhBpCC7if07bl8jq28nQSarUA/exec";

export const SERVICES: ServicePackage[] = [
  {
    id: 'core',
    title: 'AI SmartSite + Meta Ads',
    description: 'The sovereign growth engine. A hyper-optimized conversion terminal fused with algorithmic traffic acquisition. We don\'t just get leads; we engineer market dominance.',
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
    title: 'Neural Sales Funnels',
    description: 'Psych-ops for your revenue stream. Automated, psychology-backed transmission sequences designed to rewrite lead behavior and trigger high-velocity purchasing decisions.',
    features: [
      'High-Impact Single Blasts',
      '3-Step Nurture Loops',
      '4-Day Cash Injection Campaigns',
      'Psychological Triggers'
    ],
    highlight: false
  },
  {
    id: 'upgrade',
    title: 'Full Multi-Page Upgrade',
    description: 'Total digital sovereignty. A vast, SEO-fortified ecosystem designed for maximum authority. Dominate search indices and establish an unshakeable brand presence.',
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