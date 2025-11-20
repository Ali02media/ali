
import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, CheckCircle2, ArrowRight, Menu, X, Loader2 } from 'lucide-react';
import ParticlesBackground from './components/ParticlesBackground';
import AIChatWidget from './components/AIChatWidget';
import Button from './components/Button';
import ServiceModal from './components/ServiceModal';
import AIRecommender from './components/AIRecommender';
import ScrollReveal from './components/ScrollReveal';
import CustomCursor from './components/CustomCursor';
import ProcessTimeline from './components/ProcessTimeline';
import ThankYouModal from './components/ThankYouModal';
import Logo from './components/Logo';
import { SERVICES, PAIN_POINTS, SOLUTIONS, APP_NAME, GOOGLE_SHEETS_WEBHOOK_URL } from './constants';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', url: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleServiceClick = (id: string) => {
    setActiveModal(id);
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Identity verification required.';
        break;
      case 'email':
        if (!value.trim()) return 'Communication channel required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid frequency format.';
        break;
      case 'url':
        if (value.trim() && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value)) {
          return 'Invalid domain syntax.';
        }
        break;
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation if field has been touched or already has an error
    if (touched[name] || formErrors[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate Name and Email (Required)
    ['name', 'email'].forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate URL (Optional but format check)
    if (formData.url) {
      const error = validateField('url', formData.url);
      if (error) {
        newErrors.url = error;
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    setTouched({ name: true, email: true, url: true, phone: true, message: true });

    if (!isValid) return;
    
    setFormStatus('submitting');

    try {
      // Check if URL is configured
      if ((GOOGLE_SHEETS_WEBHOOK_URL as string) === "REPLACE_WITH_YOUR_GOOGLE_SCRIPT_URL") {
        // Simulation mode for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Simulated Form Submission:", formData);
        setFormStatus('success');
        setShowThankYou(true); // Trigger Modal
        setFormData({ name: '', email: '', url: '', phone: '', message: '' });
        setTouched({});
        return;
      }

      // Create FormData for Google Apps Script (no-cors compatible)
      // We explicitly handle optional fields to ensure they are sent as empty strings if undefined
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('email', formData.email.trim());
      data.append('phone', formData.phone ? formData.phone.trim() : '');
      data.append('url', formData.url ? formData.url.trim() : '');
      data.append('message', formData.message ? formData.message.trim() : '');

      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        body: data
      });

      setFormStatus('success');
      setShowThankYou(true); // Trigger Modal
      setFormData({ name: '', email: '', url: '', phone: '', message: '' });
      setTouched({});
    } catch (error) {
      console.error("Submission Error:", error);
      setFormStatus('error');
    }
  };

  const handleCloseThankYou = () => {
    setShowThankYou(false);
    setFormStatus('idle'); // Reset form so they can submit again if needed
  };

  // Reorder services for podium effect: Addon (Left), Core (Center/Top), Upgrade (Right)
  const podiumServices = [
    SERVICES.find(s => s.id === 'addon'),
    SERVICES.find(s => s.id === 'core'),
    SERVICES.find(s => s.id === 'upgrade')
  ].filter(Boolean) as typeof SERVICES;

  const getInputClass = (fieldName: string) => `
    w-full bg-gray-900/50 border rounded-lg p-4 text-white outline-none transition-all disabled:opacity-50
    ${formErrors[fieldName] 
      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
      : 'border-gray-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue'}
  `;

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-neon-blue selection:text-black">
      <CustomCursor />
      <ParticlesBackground />
      <ServiceModal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        serviceId={activeModal} 
      />
      <ThankYouModal 
        isOpen={showThankYou}
        onClose={handleCloseThankYou}
      />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 border-b ${scrolled ? 'bg-black/80 backdrop-blur-md border-gray-800 py-2' : 'bg-transparent border-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 relative z-50">
             <Logo className="h-20 md:h-32 w-auto" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-mono text-gray-400">
            <button onClick={() => handleNavClick('problem')} className="hover:text-neon-blue transition-colors">THE PROBLEM</button>
            <button onClick={() => handleNavClick('services')} className="hover:text-neon-blue transition-colors">SYSTEMS</button>
            <button onClick={() => handleNavClick('process')} className="hover:text-neon-blue transition-colors">PROCESS</button>
            <button onClick={scrollToContact} className="text-white hover:text-neon-blue transition-colors">START PROJECT //</button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white relative z-50 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
            <button onClick={() => handleNavClick('problem')} className="text-2xl font-mono font-bold hover:text-neon-blue transition-colors">THE PROBLEM</button>
            <button onClick={() => handleNavClick('services')} className="text-2xl font-mono font-bold hover:text-neon-blue transition-colors">SYSTEMS</button>
            <button onClick={() => handleNavClick('process')} className="text-2xl font-mono font-bold hover:text-neon-blue transition-colors">PROCESS</button>
            <Button onClick={scrollToContact} className="mt-4">START PROJECT //</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 md:pt-32 pb-16 md:pb-20 min-h-[90vh] md:min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-neon-blue/20 rounded-full blur-[80px] md:blur-[120px] -z-10" />
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 md:mb-8 max-w-5xl mx-auto leading-tight animate-fade-in-up [animation-delay:200ms] opacity-0">
          SCALE WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text">INTELLIGENCE</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed animate-fade-in-up [animation-delay:400ms] opacity-0 px-4">
          We replace outdated websites with AI-Powered SmartSites & High-Conversion Meta Ads. 
          The future of client acquisition is here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto justify-center animate-fade-in-up [animation-delay:600ms] opacity-0 px-6">
          <Button onClick={scrollToContact} className="w-full sm:w-auto justify-center animate-button-pulse hover:animate-none">
            Get Free AI Audit
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})} icon={false} className="w-full sm:w-auto justify-center">
            Explore Systems
          </Button>
        </div>

        <div className="absolute bottom-6 md:bottom-10 animate-bounce text-gray-500 hidden sm:block">
          <ChevronDown size={24} />
        </div>
      </header>

      {/* Pain Points Section */}
      <section id="problem" className="py-16 md:py-24 relative border-t border-gray-900 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="mb-12 md:mb-16">
              <h2 className="text-xs md:text-sm font-mono text-neon-blue mb-4 uppercase tracking-widest">System Failure</h2>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">Why The Old Way Is Broken</h3>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {PAIN_POINTS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 150} className="h-full">
                <div className="glass-panel p-6 md:p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 group h-full border border-white/5 hover:border-red-500/30">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 text-red-500 group-hover:text-red-400 group-hover:scale-110 transition-all">
                    <item.icon size={24} />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Transition Divider */}
      <div className="relative h-32 bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center overflow-hidden z-10">
         {/* Vertical Line with Data Drop */}
         <div className="absolute inset-y-0 w-px bg-gray-800/50">
            <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-neon-blue to-transparent animate-drop shadow-[0_0_10px_#00f3ff]" />
         </div>
         
         {/* Central Processing Node */}
         <div className="relative z-10 bg-black border border-gray-800 rounded-full p-3 shadow-[0_0_20px_rgba(0,243,255,0.15)] group cursor-default transition-transform hover:scale-110">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse shadow-[0_0_10px_#00f3ff]" />
            <div className="absolute inset-0 rounded-full border border-neon-blue opacity-20 animate-ping" />
         </div>

         {/* Text Indicator */}
         <div className="absolute bottom-6 text-[10px] font-mono text-gray-600 tracking-[0.3em] uppercase opacity-70">
             System_Initialization
         </div>
      </div>

      {/* Solution / Process Section */}
      <section id="process" className="py-16 md:py-24 relative bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
           <ScrollReveal>
            <div className="mb-12 md:mb-16 text-left md:text-center">
              <h2 className="text-xs md:text-sm font-mono text-neon-blue mb-4 uppercase tracking-widest">System Architecture</h2>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">The Upgrade Protocol</h3>
            </div>
          </ScrollReveal>
          
          {/* Core Capabilities Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-24">
            {SOLUTIONS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 150} className="h-full">
                <div className="glass-panel p-6 md:p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 group border-neon-blue/20 h-full">
                  <div className="w-12 h-12 bg-neon-blue/10 rounded-lg flex items-center justify-center mb-6 text-neon-blue group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                    <item.icon size={24} />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* New Execution Timeline */}
          <ScrollReveal>
             <div className="text-left md:text-center mb-12">
               <h3 className="text-2xl font-bold">Execution Roadmap</h3>
             </div>
          </ScrollReveal>
          <ProcessTimeline />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-xs md:text-sm font-mono text-neon-purple mb-4 uppercase tracking-widest">Operational Modules</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Choose Your Weapon</h3>
              <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">Modular growth systems designed to integrate seamlessly with your business.</p>
            </div>
          </ScrollReveal>

          {/* AI Recommender Integration */}
          <AIRecommender />

          {/* Podium Grid Layout */}
          <div className="grid md:grid-cols-3 gap-6 items-center justify-center pt-0 md:pt-10">
            {podiumServices.map((service, i) => {
              const isCore = service.id === 'core';
              
              return (
                <ScrollReveal key={service.id} delay={i * 200} className={isCore ? 'z-20 order-first md:order-none' : ''}>
                  <div 
                    onClick={() => handleServiceClick(service.id)}
                    className={`
                      group relative flex flex-col p-6 md:p-8 rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden
                      ${isCore 
                        ? 'md:scale-110 z-20 bg-gray-900/80 border-neon-blue shadow-[0_0_40px_rgba(0,243,255,0.2)] h-full min-h-[500px] md:min-h-[600px]' 
                        : 'bg-black/40 border-gray-800 hover:border-neon-blue/50 h-full min-h-[400px] md:min-h-[500px]'
                      }
                      hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:-translate-y-2 hover:bg-gray-900/60
                    `}
                  >
                    {/* Hover Contrast Adjustment Wrapper */}
                    <div className="relative z-10 flex-1 flex flex-col">
                      
                      {/* Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div className={`
                          w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center border transition-colors
                          ${isCore 
                            ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' 
                            : 'bg-gray-900 border-gray-800 text-gray-400'
                          }
                          group-hover:bg-neon-blue/20 group-hover:border-neon-blue group-hover:text-neon-blue
                        `}>
                          <Sparkles size={20} />
                        </div>
                        {isCore && (
                          <span className="bg-neon-blue text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Most Popular
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold mb-2 transition-colors text-white group-hover:text-neon-blue">
                        {service.title}
                      </h3>
                      <p className={`text-xs md:text-sm mb-6 md:mb-8 leading-relaxed transition-colors ${isCore ? 'text-gray-300' : 'text-gray-400'} group-hover:text-gray-200`}>
                        {service.description}
                      </p>
                      
                      {/* Features */}
                      <ul className="space-y-3 md:space-y-4 mb-8 flex-1">
                        {service.features.slice(0, 4).map((feat, idx) => (
                          <li key={idx} className={`flex items-start gap-3 text-xs md:text-sm transition-colors ${isCore ? 'text-gray-300' : 'text-gray-400'} group-hover:text-white`}>
                            <CheckCircle2 size={16} className={`mt-0.5 transition-colors ${isCore ? 'text-neon-blue' : 'text-gray-600'} group-hover:text-neon-blue`} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Call to Action */}
                      <div className={`pt-6 border-t transition-colors ${isCore ? 'border-gray-700' : 'border-gray-800'} group-hover:border-neon-blue/30`}>
                        <div className="flex items-center justify-between text-xs md:text-sm font-mono">
                          <span className={`transition-colors ${isCore ? 'text-neon-blue' : 'text-gray-500'} group-hover:text-neon-blue font-bold`}>
                            {service.id === 'core' ? 'FREE ADS MANAGER' : 'VIEW PACKAGES'}
                          </span>
                          <ArrowRight size={16} className={`transition-transform group-hover:translate-x-1 ${isCore ? 'text-neon-blue' : 'text-gray-600'} group-hover:text-neon-blue`} />
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
      <section id="contact" className="py-20 md:py-32 bg-black relative border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 tracking-tight">Ready To <span className="text-neon-blue">Evolve?</span></h2>
            <p className="text-base md:text-xl text-gray-400 mb-8 md:mb-12">
              Join the agency that uses actual intelligence to grow your business.
              <br className="hidden md:block" /> Limited spots available for this quarter.
            </p>
          </ScrollReveal>

          <form className="max-w-md mx-auto space-y-4 text-left" onSubmit={handleSubmit} noValidate>
            <ScrollReveal delay={200}>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Identification</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={getInputClass('name')}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1 font-mono tracking-wide animate-pulse">{formErrors.name}</p>
                )}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Coordinates</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={getInputClass('email')}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1 font-mono tracking-wide animate-pulse">{formErrors.email}</p>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={350}>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Signal Line (Phone)</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number (Optional)" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={getInputClass('phone')}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Target URL (Optional)</label>
                <input 
                  type="url" 
                  name="url"
                  placeholder="Current Website (e.g. https://your-site.com)" 
                  value={formData.url}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={getInputClass('url')}
                />
                {formErrors.url && (
                  <p className="text-red-500 text-xs mt-1 font-mono tracking-wide animate-pulse">{formErrors.url}</p>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={450}>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Mission Brief (Message)</label>
                <textarea 
                  name="message"
                  placeholder="Tell us about your project (Optional)" 
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows={4}
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={getInputClass('message').replace('h-full', '') + ' resize-none'}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <Button className="w-full justify-center mt-4" disabled={formStatus === 'submitting' || formStatus === 'success'}>
                {formStatus === 'submitting' ? (
                  <Loader2 className="animate-spin" />
                ) : formStatus === 'success' ? (
                  <span className="text-green-400 flex items-center gap-2"><CheckCircle2 size={16} /> Protocol Initiated</span>
                ) : (
                  'Initiate Audit Protocol'
                )}
              </Button>
              {formStatus === 'error' && (
                <p className="text-red-500 text-xs text-center mt-2">Connection failed. Please try again.</p>
              )}
            </ScrollReveal>
          </form>

          <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8 text-gray-600 text-sm">
             <span className="hover:text-neon-blue cursor-pointer transition-colors">Privacy Protocol</span>
             <span className="hover:text-neon-blue cursor-pointer transition-colors">Terms of Engagement</span>
          </div>
          
          <div className="mt-8 text-gray-700 text-xs md:text-sm font-mono">
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
