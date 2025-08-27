import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ZapiInstance {
  id: string;
  instanceId: string;
  apiToken: string;
  signed: boolean;
  status: string;
}

export const useZapiConnection = () => {
  const [instanceName, setInstanceName] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'creating' | 'pending' | 'connected' | 'error'>('disconnected');
  const [currentInstance, setCurrentInstance] = useState<ZapiInstance | null>(null);
  const [pollingEnabled, setPollingEnabled] = useState(false);
  const { toast } = useToast();

  // Load existing instances on mount
  useEffect(() => {
    loadExistingInstances();
  }, []);

  // Polling effect for checking connection status
  useEffect(() => {
    if (!pollingEnabled || !currentInstance) return;

    const pollInterval = setInterval(async () => {
      if (connectionStatus === 'pending' && currentInstance) {
        await getQrCode(currentInstance.instanceId);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(pollInterval);
    };
  }, [pollingEnabled, currentInstance, connectionStatus]);

  const loadExistingInstances = async () => {
    try {
      const { data: instances, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading instances:', error);
        return;
      }

      if (instances && instances.length > 0) {
        const instance = instances[0];
        setCurrentInstance({
          id: instance.id,
          instanceId: instance.instance_id,
          apiToken: instance.api_token,
          signed: instance.signed,
          status: instance.status,
        });
        setConnectionStatus(instance.status === 'connected' ? 'connected' : 'pending');
        
        // If pending, try to get QR code and enable polling
        if (instance.status !== 'connected') {
          setPollingEnabled(true);
          getQrCode(instance.instance_id);
        } else {
          setPollingEnabled(false);
        }
      }
    } catch (error) {
      console.error('Error in loadExistingInstances:', error);
    }
  };

  const createInstance = async (): Promise<{ success: boolean; connected?: boolean } | null> => {
    if (!instanceName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a instância",
        variant: "destructive",
      });
      return null;
    }

    setIsConnecting(true);
    setConnectionStatus('creating');

    try {
      console.log('Creating Z-API instance:', instanceName);

      const { data, error } = await supabase.functions.invoke('zapi-create-instance', {
        body: { instanceName: instanceName.trim() }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create instance');
      }

      console.log('Instance created:', data.instance);

      setCurrentInstance(data.instance);
      setConnectionStatus('pending');

      toast({
        title: data.developmentMode ? "Instância criada (Modo Dev)" : "Instância criada",
        description: data.developmentMode 
          ? "Instância criada em modo de desenvolvimento"
          : "Instância WhatsApp criada com sucesso",
      });

      // Automatically sign the instance
      await signInstance(data.instance.instanceId);

      // Get QR code
      await getQrCode(data.instance.instanceId);

      return { success: true, connected: false };

    } catch (error) {
      console.error('Error creating instance:', error);
      setConnectionStatus('error');
      
      toast({
        title: "Erro ao criar instância",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });

      return { success: false };
    } finally {
      setIsConnecting(false);
    }
  };

  const signInstance = async (instanceId: string) => {
    try {
      console.log('Signing Z-API instance:', instanceId);

      const { data, error } = await supabase.functions.invoke('zapi-sign-instance', {
        body: { instanceId }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to sign instance');
      }

      console.log('Instance signed:', data.instance);

      setCurrentInstance(prev => prev ? { ...prev, signed: true } : null);

      toast({
        title: data.developmentMode ? "Instância assinada (Modo Dev)" : "Instância assinada",
        description: "Instância ativada com sucesso",
      });

    } catch (error) {
      console.error('Error signing instance:', error);
      toast({
        title: "Erro ao assinar instância",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const getQrCode = async (instanceId: string) => {
    try {
      console.log('Getting QR code for instance:', instanceId);

      const { data, error } = await supabase.functions.invoke('zapi-get-qrcode', {
        body: { instanceId }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to get QR code');
      }

      console.log('QR code response:', { 
        status: data.status, 
        hasQR: !!data.qrCode,
        developmentMode: data.developmentMode 
      });

      if (data.qrCode) {
        setQrCode(data.qrCode);
        setConnectionStatus('pending');
        setPollingEnabled(true);
      } else if (data.status === 'connected') {
        setConnectionStatus('connected');
        setQrCode('');
        setPollingEnabled(false);
        toast({
          title: "WhatsApp Conectado!",
          description: "Sua conta WhatsApp está conectada e pronta para uso",
        });
      } else {
        setConnectionStatus('pending');
        setPollingEnabled(true);
        // Retry after a delay if no QR code yet
        setTimeout(() => getQrCode(instanceId), 3000);
      }

    } catch (error) {
      console.error('Error getting QR code:', error);
      setConnectionStatus('error');
      toast({
        title: "Erro ao obter QR Code",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const refreshQrCode = useCallback(async () => {
    if (currentInstance) {
      await getQrCode(currentInstance.instanceId);
    }
  }, [currentInstance]);

  const resetConnection = useCallback(() => {
    setInstanceName('');
    setQrCode('');
    setIsConnecting(false);
    setConnectionStatus('disconnected');
    setCurrentInstance(null);
    setPollingEnabled(false);
  }, []);

  return {
    instanceName,
    setInstanceName,
    qrCode,
    isConnecting,
    connectionStatus,
    currentInstance,
    createInstance,
    refreshQrCode,
    resetConnection,
  };
};