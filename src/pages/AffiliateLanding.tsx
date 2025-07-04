
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, DollarSign, Users, Zap, ArrowRight, Phone, Mail, User, Target, TrendingUp, Gift, Shield, Sparkles, Bot, BarChart3, Brain } from 'lucide-react';
import { toast } from 'sonner';

const AffiliateLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const CTAButton = ({ className = "", size = "default" }: { className?: string, size?: "default" | "lg" }) => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button 
          size={size}
          className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 ${className}`}
        >
          Quero Saber Mais
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-md bg-gray-900 border-purple-500/30 z-50"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Garanta Sua Vaga na Live!
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <form 
            method="post" 
            action="https://webhook.sellflux.com/webhook/v2/form/lead/9237094161277821b8021f44fb13b9b1?not_query=true&redirect_url=https%3A%2F%2Flive.convertamais.online%2Fconfirmado"
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name-1" className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome Completo
              </Label>
              <Input
                id="name-1"
                name="name"
                type="text"
                placeholder="Seu nome completo"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email-1" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail
              </Label>
              <Input
                id="email-1"
                name="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="tel-1" className="text-white flex items-center gap-2">
                <Phone className="w-4 h-4" />
                WhatsApp
              </Label>
              <div className="flex gap-2">
                <select 
                  id="ddi-1" 
                  className="bg-white/10 border-white/20 text-white rounded-md px-3 py-2 w-20"
                >
                  <option value="55" className="bg-gray-800">🇧🇷 +55</option>
                </select>
                <Input
                  data-phone-with-ddi=""
                  type="tel"
                  id="tel-1"
                  name="phone"
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg"
            >
              Confirmar Cadastro
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );

  useEffect(() => {
    // Add phone mask and form handling scripts
    const script1 = document.createElement('script');
    script1.innerHTML = `
      const countryList1 = [{
        "country_code": "BR",
        "phone_mask": "(99) 99999-9999",
        "country_name": "Brasil",
        "regionCode": "55",
        "selected": true,
        "emoji": "🇧🇷"
      }];
      
      document.addEventListener('DOMContentLoaded', function () {
        const phoneInput = document.getElementById('tel-1');
        const emailInput = document.getElementById('email-1');
        const nameInput = document.getElementById('name-1');
        const ddiSelect = document.getElementById('ddi-1');

        if (!phoneInput || !emailInput || !nameInput || !ddiSelect) return;

        const getCountryMask = (regionCode) => {
          const country = countryList1.find(country => country.regionCode === regionCode);
          return country ? country.phone_mask : '(99) 99999-9999';
        };

        const applyMask = (input, mask) => {
          let i = 0;
          const val = input.value.replace(/\\D/g, '');
          input.value = mask.replace(/9/g, () => val[i++] || '');
        };

        const updatePlaceholder = (input, mask) => {
          input.placeholder = mask.replace(/9/g, '0');
        };

        const maskPhone = (event) => {
          if (event.inputType && (event.inputType === "deleteContentBackward" || event.inputType === "deleteContentForward")) {
            return;
          }

          if (phoneInput.value.trim() === '') {
            phoneInput.value = '';
            return;
          }

          const mask = getCountryMask(ddiSelect.value);
          applyMask(phoneInput, mask);
          updatePlaceholder(phoneInput, mask);
          let phoneWithDdi = "+" + ddiSelect.value + phoneInput.value.replace(/\\D/g, '');
          phoneInput.dataset.phoneWithDdi = phoneWithDdi;
        };

        phoneInput.addEventListener("input", maskPhone);
        ddiSelect.addEventListener("change", () => {
          const initialMask = getCountryMask(ddiSelect.value);
          if (initialMask) {
            updatePlaceholder(phoneInput, initialMask);
          }
          phoneInput.dispatchEvent(new Event("input"));
        });

        const forms = document.querySelectorAll('form');
        forms.forEach(function (form) {
          form.addEventListener('submit', function (e) {
            let phoneWithDdi = phoneInput.dataset.phoneWithDdi || '';
            phoneInput.value = phoneWithDdi;
            setTimeout(() => {
              phoneInput.value = "";
              nameInput.value = ""
              emailInput.value = ""
            }, 500);
          });
        });
      });
    `;
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
      document.addEventListener('DOMContentLoaded', function () {
        const queryParams = new URLSearchParams(window.location.search);
        const paramsObj = {};
        for (const [key, value] of queryParams) {
          paramsObj[key] = value;
        }
        if (Object.keys(paramsObj).length > 0) {
          const forms = document.querySelectorAll('form');
          forms.forEach(function (form) {
            let existingInput = form.querySelector('input[name="origin_query"]');
            if (!existingInput) {
              const hiddenInput = document.createElement('input');
              hiddenInput.type = 'hidden';
              hiddenInput.name = 'origin_query';
              hiddenInput.value = JSON.stringify(paramsObj);
              form.appendChild(hiddenInput);
            } else {
              existingInput.value = JSON.stringify(paramsObj);
            }
          });
        }
      });
    `;

    document.head.appendChild(script1);
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="px-4 py-6 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ce25a7c1-b528-4a12-802a-3ccc77677d04.png" 
              alt="Converta+" 
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold text-white">
              Converta+
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Essa é a sua chance de{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              lucrar com a maior demanda
            </span>
            <br />
            do mercado atual
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            O atendimento com IA via WhatsApp deixou de ser diferencial e virou obrigação. 
            Saiba como lucrar com a plataforma <strong className="text-white">Converta+</strong>, uma solução que toda empresa precisa. <strong className="text-green-400">Ganhe altas comissões sem limites!</strong>
          </p>
          
          <div className="mb-12 flex justify-center">
            <CTAButton size="lg" className="text-xl px-12 py-4" />
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Altas comissões sem limites</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Sistema grátis por 1 ano</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Treinamento completo</span>
            </div>
          </div>
        </div>
      </section>

      {/* System Differentials Section */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Por Que o{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Converta+ é Diferente?
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Uma plataforma completa que revoluciona a forma como empresas vendem online
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: 'Criação de Agentes de IA',
                description: 'Sistema inteligente que permite criar agentes de IA personalizados para cada tipo de negócio e abordagem comercial.'
              },
              {
                icon: BarChart3,
                title: 'CRM com Qualificação Automática',
                description: 'CRM inteligente que qualifica leads automaticamente, organizando prospects por potencial de conversão.'
              },
              {
                icon: Brain,
                title: 'Inteligência de Performance',
                description: 'IA que analisa performance dos agentes, conversas, perfis dos leads e campanhas para otimização contínua.'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <feature.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunity Explanation */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Para Quem É Esta{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Oportunidade?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: 'Profissionais de Vendas',
                description: 'Vendedores, consultores e profissionais que já trabalham com vendas online e querem expandir seu portfólio'
              },
              {
                icon: Users,
                title: 'Empreendedores',
                description: 'Pessoas buscando renda extra ou recorrente com tecnologia de ponta e inteligência artificial'
              },
              {
                icon: TrendingUp,
                title: 'Especialistas em Marketing',
                description: 'Social media, gestores de tráfego, lançadores e profissionais de marketing digital'
              }
            ].map((target, index) => (
              <Card key={index} className="bg-gray-800 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <target.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{target.title}</h3>
                  <p className="text-gray-300">{target.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <CTAButton size="lg" className="text-xl px-12 py-4" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Como Funciona o{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Programa para Representantes
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Sistema simples e eficaz que permite você vender com total liberdade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Altas Comissões',
                description: 'Ganhe altas comissões sem limites por venda. Valores atrativos pagos mensalmente.'
              },
              {
                icon: Gift,
                title: 'Sistema Gratuito',
                description: 'Use o Converta+ por 1 ano completo (valor de R$ 127/mês) sem pagar nada.'
              },
              {
                icon: Shield,
                title: 'Suporte Total',
                description: 'Materiais de venda, treinamentos, suporte técnico e acompanhamento.'
              },
              {
                icon: Sparkles,
                title: 'Liberdade Completa',
                description: 'Venda quando, onde e como quiser. Trabalhe no seu ritmo.'
              }
            ].map((benefit, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <benefit.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-700 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gray-800 border-purple-500/30 shadow-xl overflow-hidden">
            <CardContent className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                O Que Você Recebe
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Você garante <strong className="text-white">acesso completo ao sistema por 1 ano</strong> + 
                se torna representante oficial com direito a comissões e materiais exclusivos.
              </p>
              <div className="bg-gray-700 rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Benefícios inclusos:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">Converta+ por 1 ano (R$ 1.524)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">Programa para Representantes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">Materiais de Venda</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">Treinamento Completo</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <CTAButton size="lg" className="text-xl px-12 py-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Vantagens Exclusivas do{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Programa Converta+
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Produto de Alta Demanda',
                description: 'IA e automação são o futuro. Converta+ resolve problemas reais de empresas que precisam vender mais.',
                icon: Sparkles
              },
              {
                title: 'Altas Comissões',
                description: 'Altas comissões por venda + comissões recorrentes. Melhor que a maioria dos programas.',
                icon: TrendingUp
              },
              {
                title: 'Suporte Diferenciado',
                description: 'Não deixamos você sozinho. Treinamento, materiais, suporte técnico e acompanhamento.',
                icon: Users
              },
              {
                title: 'Sem Mensalidade de Representante',
                description: 'Pague uma vez e seja representante para sempre. Não cobramos taxas mensais ou anuais.',
                icon: Shield
              }
            ].map((advantage, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <advantage.icon className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{advantage.title}</h3>
                  <p className="text-gray-700 text-lg">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Não Perca Esta Oportunidade Única
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Seja um dos primeiros representantes oficiais do Converta+ e 
            comece a faturar com inteligência artificial ainda esta semana.
          </p>
          
          <div className="mb-8 flex justify-center">
            <CTAButton size="lg" className="text-2xl px-16 py-6" />
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Vagas Limitadas</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Live Exclusiva</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Suporte Completo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/40 text-center">
        <p className="text-gray-400 text-lg">
          © 2025 Converta+ - Plataforma de Automação Inteligente com IA
        </p>
      </footer>
    </div>
  );
};

export default AffiliateLanding;
