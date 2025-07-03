
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar, MessageCircle, Gift, Sparkles, ArrowRight } from 'lucide-react';

const ConfirmationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Falta Pouco!
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Parabéns! Você está oficialmente na lista para a{' '}
            <strong className="text-white">Live Exclusiva da revolucionária plataforma Converta+.</strong> O link da live será enviado apenas no grupo do whatsapp
          </p>

          <div className="mb-8">
            <Button
              onClick={() => window.open('https://chat.whatsapp.com/EGSJc4DjImVD1m12CJSz3Z', '_blank')}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-xl px-12 py-4 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              Acessar Grupo VIP
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Vaga Garantida</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Acesso Exclusivo</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Materiais Gratuitos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Próximos{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Passos
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Agora que você está cadastrado, veja o que acontece a seguir
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'Confirmação no WhatsApp',
                description: 'Você receberá uma mensagem no WhatsApp confirmando sua participação e com informações importantes.',
                step: '1'
              },
              {
                icon: Calendar,
                title: 'Data e Horário da Live',
                description: 'A data e horário da live exclusiva serão enviados por e-mail e WhatsApp em breve.',
                step: '2'
              },
              {
                icon: Gift,
                title: 'Material Preparatório',
                description: 'Receberá materiais exclusivos para se preparar e aproveitar ao máximo a apresentação.',
                step: '3'
              }
            ].map((step, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                <CardContent className="p-8 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <step.icon className="w-12 h-12 text-purple-600 mx-auto mb-4 mt-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              O Que Você Vai{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Descobrir na Live
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Oportunidade de Renda Recorrente',
                description: 'Como criar uma fonte de renda consistente vendendo o sistema de IA mais avançado do Brasil.',
                icon: Sparkles
              },
              {
                title: 'Estratégias de Vendas Comprovadas',
                description: 'Técnicas e métodos testados para maximizar suas vendas e comissões como afiliado.',
                icon: ArrowRight
              },
              {
                title: 'Acesso Gratuito ao Sistema',
                description: 'Como usar o Converta+ por 1 ano completo sem pagar nada e ainda ganhar vendendo.',
                icon: Gift
              },
              {
                title: 'Suporte e Materiais Exclusivos',
                description: 'Todo o apoio necessário para você ter sucesso, incluindo materiais e treinamentos.',
                icon: CheckCircle
              }
            ].map((benefit, index) => (
              <Card key={index} className="bg-gray-800 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <CardContent className="p-8">
                  <benefit.icon className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                  <p className="text-gray-300 text-lg">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 border-purple-500/30 shadow-xl">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-6">
                📱 Fique Atento ao Seu WhatsApp e E-mail
              </h3>
              <p className="text-xl text-gray-300 mb-6">
                Todas as informações importantes sobre a live, incluindo data, horário e link de acesso, serão enviadas pelos canais que você cadastrou.
              </p>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6">
                <p className="text-yellow-200 font-semibold">
                  ⚠️ Importante: Verifique também sua caixa de spam/lixo eletrônico para não perder nenhuma informação!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Compartilhe Esta Oportunidade
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Conhece alguém que também gostaria de conhecer esta oportunidade única? Compartilhe com amigos e familiares!
          </p>
          
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Programa de Afiliados Converta+',
                  text: 'Descobri uma oportunidade incrível de renda com IA. Confira!',
                  url: 'https://live.convertamais.online/afiliados'
                });
              } else {
                navigator.clipboard.writeText('https://live.convertamais.online/afiliados');
                alert('Link copiado para a área de transferência!');
              }
            }}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-4 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
          >
            Compartilhar Oportunidade
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/40 text-center">
        <p className="text-gray-400 text-lg">
          © 2024 Converta+ - Plataforma de Automação Inteligente com IA
        </p>
      </footer>
    </div>
  );
};

export default ConfirmationPage;
