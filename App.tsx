
import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import ParticlesBackground from './components/ParticlesBackground';
import AIChatWidget from './components/AIChatWidget';
import Button from './components/Button';
import ServiceModal from './components/ServiceModal';
import AIRecommender from './components/AIRecommender';
import ScrollReveal from './components/ScrollReveal';
import Logo from './components/Logo';
import { SERVICES, PAIN_POINTS, SOLUTIONS, APP_NAME } from './constants';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleServiceClick = (id: string) => {
    setActiveModal(id);
  };

  // Reorder services for podium effect: Addon (Left), Core (Center/Top), Upgrade (Right)
  const podiumServices = [
    SERVICES.find(s => s.id === 'addon'),
    SERVICES.find(s => s.id === 'core'),
    SERVICES.find(s => s.id === 'upgrade')
  ].filter(Boolean) as typeof SERVICES;

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-neon-blue selection:text-black">
      <ParticlesBackground />
      <ServiceModal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        serviceId={activeModal} 
      />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 border-b ${scrolled ? 'bg-black/80 backdrop-blur-md border-gray-800 py-2' : 'bg-transparent border-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Logo className="h-12 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-mono text-gray-400">
            <a href="#problem" className="hover:text-neon-blue transition-colors">THE PROBLEM</a>
            <a href="#services" className="hover:text-neon-blue transition-colors">SYSTEMS</a>
            <a href="#process" className="hover:text-neon-blue transition-colors">PROCESS</a>
            <button onClick={scrollToContact} className="text-white hover:text-neon-blue transition-colors">START PROJECT //</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 min-h-screen flex flex-col justify-center items-center text-center px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
          <Sparkles size={14} className="text-neon-purple" />
          <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">Next Gen Agency</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-tight animate-fade-in-up [animation-delay:200ms] opacity-0">
          SCALE WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text">INTELLIGENCE</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up [animation-delay:400ms] opacity-0">
          We replace outdated websites with AI-Powered SmartSites & High-Conversion Meta Ads. 
          The future of client acquisition is here.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center animate-fade-in-up [animation-delay:600ms] opacity-0">
          <Button onClick={scrollToContact}>
            Get Free AI Audit
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})} icon={false}>
            Explore Systems
          </Button>
        </div>

        <div className="absolute bottom-10 animate-bounce text-gray-500">
          <ChevronDown size={24} />
        </div>
      </header>

      {/* Pain Points Section */}
      <section id="problem" className="py-24 relative border-t border-gray-900 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="mb-16">
              <h2 className="text-sm font-mono text-neon-blue mb-4 uppercase tracking-widest">System Failure</h2>
              <h3 className="text-3xl md:text-4xl font-bold">Why The Old Way Is Broken</h3>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 150} className="h-full">
                <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 group h-full border border-white/5 hover:border-red-500/30">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 text-red-500 group-hover:text-red-400 group-hover:scale-110 transition-all">
                    <item.icon size={24} />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 relative bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
           <ScrollReveal>
            <div className="mb-16 text-right">
              <h2 className="text-sm font-mono text-neon-blue mb-4 uppercase tracking-widest">System Upgrade</h2>
              <h3 className="text-3xl md:text-4xl font-bold">The SmartSite Protocol</h3>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {SOLUTIONS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 150} className="h-full">
                <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 group border-neon-blue/20 h-full">
                  <div className="w-12 h-12 bg-neon-blue/10 rounded-lg flex items-center justify-center mb-6 text-neon-blue group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                    <item.icon size={24} />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-sm font-mono text-neon-purple mb-4 uppercase tracking-widest">Operational Modules</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Weapon</h3>
              <p className="text-gray-400 max-w-xl mx-auto">Modular growth systems designed to integrate seamlessly with your business.</p>
            </div>
          </ScrollReveal>

          {/* AI Recommender Integration */}
          <AIRecommender />

          {/* Podium Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-6 items-center justify-center pt-10">
            {podiumServices.map((service, i) => {
              const isCore = service.id === 'core';
              
              return (
                <ScrollReveal key={service.id} delay={i * 200} className={isCore ? 'z-20' : ''}>
                  <div 
                    onClick={() => handleServiceClick(service.id)}
                    className={`
                      group relative flex flex-col p-8 rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden
                      ${isCore 
                        ? 'lg:scale-110 z-20 bg-gray-900/80 border-neon-blue shadow-[0_0_40px_rgba(0,243,255,0.2)] h-full lg:min-h-[600px]' 
                        : 'bg-black/40 border-gray-800 hover:border-neon-blue/50 h-full lg:min-h-[500px]'
                      }
                      hover:bg-neon-blue hover:border-neon-blue hover:shadow-[0_0_60px_rgba(0,243,255,0.6)] hover:-translate-y-2
                    `}
                  >
                    {/* Hover Contrast Adjustment Wrapper */}
                    <div className="relative z-10 flex-1 flex flex-col group-hover:text-black">
                      
                      {/* Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div className={`
                          w-12 h-12 rounded-lg flex items-center justify-center border transition-colors
                          ${isCore 
                            ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' 
                            : 'bg-gray-900 border-gray-800 text-gray-400'
                          }
                          group-hover:bg-black/10 group-hover:border-black/20 group-hover:text-black
                        `}>
                          <Sparkles size={20} />
                        </div>
                        {isCore && (
                          <span className="bg-neon-blue text-black group-hover:bg-black group-hover:text-neon-blue transition-colors text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Most Popular
                          </span>
                        )}
                      </div>

                      <h3 className={`text-2xl font-bold mb-2 transition-colors ${isCore ? 'text-white' : 'text-white'} group-hover:text-black`}>
                        {service.title}
                      </h3>
                      <p className={`text-sm mb-8 leading-relaxed transition-colors ${isCore ? 'text-gray-300' : 'text-gray-400'} group-hover:text-black/70`}>
                        {service.description}
                      </p>
                      
                      {/* Features */}
                      <ul className="space-y-4 mb-8 flex-1">
                        {service.features.slice(0, 4).map((feat, idx) => (
                          <li key={idx} className={`flex items-start gap-3 text-sm transition-colors ${isCore ? 'text-gray-300' : 'text-gray-400'} group-hover:text-black/80`}>
                            <CheckCircle2 size={16} className={`mt-0.5 transition-colors ${isCore ? 'text-neon-blue' : 'text-gray-600'} group-hover:text-black`} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Call to Action */}
                      <div className={`pt-6 border-t transition-colors ${isCore ? 'border-gray-700' : 'border-gray-800'} group-hover:border-black/20`}>
                        <div className="flex items-center justify-between text-sm font-mono">
                          <span className={`transition-colors ${isCore ? 'text-neon-blue' : 'text-gray-500'} group-hover:text-black font-bold`}>
                            {service.id === 'core' ? 'FREE ADS MANAGER' : 'VIEW PACKAGES'}
                          </span>
                          <ArrowRight size={16} className={`transition-transform group-hover:translate-x-1 ${isCore ? 'text-neon-blue' : 'text-gray-600'} group-hover:text-black`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-black relative border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">Ready To <span className="text-neon-blue">Evolve?</span></h2>
            <p className="text-xl text-gray-400 mb-12">
              Join the agency that uses actual intelligence to grow your business.
              <br />Limited spots available for this quarter.
            </p>
          </ScrollReveal>

          <form className="max-w-md mx-auto space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
            <ScrollReveal delay={200}>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Identification</label>
                <input type="text" placeholder="Name" className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Coordinates</label>
                <input type="email" placeholder="Email Address" className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Target URL (Optional)</label>
                <input type="url" placeholder="Current Website" className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={500}>
              <Button className="w-full justify-center mt-4">
                Initiate Audit Protocol
              </Button>
            </ScrollReveal>
          </form>

          <div className="mt-16 flex justify-center gap-8 text-gray-600">
             {/* Footer Links Placeholder */}
             <span className="hover:text-neon-blue cursor-pointer transition-colors">Privacy Protocol</span>
             <span className="hover:text-neon-blue cursor-pointer transition-colors">Terms of Engagement</span>
          </div>
          
          <div className="mt-8 text-gray-700 text-sm font-mono">
            © {new Date().getFullYear()} AFA MEDIA. SYSTEM ONLINE.
          </div>
        </div>
      </section>

      {/* AI Widget */}
      <AIChatWidget />
    </div>
  );
};

export default App;
