import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Clock } from 'lucide-react';

const InicioExperiencia = () => {
  const [countdown, setCountdown] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  useEffect(() => {
    // Add Facebook Pixel
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '988882763452042');
      fbq('track', 'PageView');
      
      // evento de conversão lead na página /inicio-experiencia
      fbq('track', 'Lead');
    `;
    document.head.appendChild(script);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = 'https://www.facebook.com/tr?id=988882763452042&ev=PageView&noscript=1';
    noscript.appendChild(img);
    document.head.appendChild(noscript);

    // Cleanup
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(noscript);
    };
  }, []);

  useEffect(() => {
    if (!formData) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          
          // Create WhatsApp message
          const message = `Olá! Meu nome é ${formData.name}, da empresa ${formData.company}. 
Área de atuação: ${formData.area || 'Não informado'}
Produto/Serviço: ${formData.product || 'Não informado'}
Objetivo: ${formData.objective || 'Não informado'}

Gostaria de testar um agente IA personalizado para meu negócio!`;

          const whatsappUrl = `https://wa.me/5521997962109?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [formData, navigate]);

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full bg-gray-800 border-purple-500/30 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
              <Bot className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
            Você está sendo direcionado para o início da experiência de IA no WhatsApp...
          </h1>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Clock className="h-8 w-8 text-purple-400" />
            <div className="text-6xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {countdown}
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">Seus dados:</h3>
            <div className="space-y-2 text-gray-300">
              <p><span className="font-medium text-purple-400">Nome:</span> {formData.name}</p>
              <p><span className="font-medium text-purple-400">Empresa:</span> {formData.company}</p>
              {formData.area && (
                <p><span className="font-medium text-purple-400">Área:</span> {formData.area}</p>
              )}
              {formData.product && (
                <p><span className="font-medium text-purple-400">Produto/Serviço:</span> {formData.product}</p>
              )}
              {formData.objective && (
                <p><span className="font-medium text-purple-400">Objetivo:</span> {formData.objective}</p>
              )}
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mt-6">
            Em {countdown} segundos você será redirecionado para o WhatsApp para iniciar sua experiência com nosso agente de IA.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InicioExperiencia;