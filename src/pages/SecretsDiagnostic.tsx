import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import Layout from "@/components/Layout"

interface DiagnosticResult {
  ok: boolean
  timestamp: string
  environment: {
    zapiTokenPresent: boolean
    zapiTokenLength: number
    supabaseConfigured: boolean
  }
  message: string
  error?: string
}

export default function SecretsDiagnostic() {
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const runDiagnostic = async () => {
    setIsLoading(true)
    try {
      console.log("Running secrets diagnostic...")

      const { data, error } = await supabase.functions.invoke('env-check')
      
      if (error) {
        console.error("Edge function error:", error)
        toast({
          title: "Erro no diagnóstico",
          description: "Falha ao chamar a função de diagnóstico: " + error.message,
          variant: "destructive"
        })
        return
      }

      console.log("Diagnostic result:", data)
      setResult(data)

      if (data.ok) {
        toast({
          title: "✅ Diagnóstico OK",
          description: "ZAPI_PARTNER_TOKEN está acessível",
        })
      } else {
        toast({
          title: "❌ Problema encontrado", 
          description: "ZAPI_PARTNER_TOKEN não está acessível",
          variant: "destructive"
        })
      }

    } catch (error) {
      console.error("Diagnostic error:", error)
      toast({
        title: "Erro",
        description: "Falha inesperada no diagnóstico",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Diagnóstico de Secrets</h1>
          <p className="text-muted-foreground">
            Verificar se os secrets das Edge Functions estão configurados corretamente
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Status do ZAPI_PARTNER_TOKEN
            </CardTitle>
            <CardDescription>
              Este diagnóstico verifica se o token Z-API está acessível nas Edge Functions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <Button 
              onClick={runDiagnostic} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                "🔍 Executar Diagnóstico"
              )}
            </Button>

            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {result.ok ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      OK
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      ERRO
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {new Date(result.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>

                <Alert variant={result.ok ? "default" : "destructive"}>
                  <AlertDescription>
                    {result.message}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">ZAPI Token</p>
                        <p className={`text-lg font-bold ${result.environment.zapiTokenPresent ? 'text-green-600' : 'text-red-600'}`}>
                          {result.environment.zapiTokenPresent ? '✅ Presente' : '❌ Ausente'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result.environment.zapiTokenLength > 0 ? `${result.environment.zapiTokenLength} chars` : 'N/A'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">Supabase Config</p>
                        <p className={`text-lg font-bold ${result.environment.supabaseConfigured ? 'text-green-600' : 'text-red-600'}`}>
                          {result.environment.supabaseConfigured ? '✅ OK' : '❌ Erro'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">Status Geral</p>
                        <p className={`text-lg font-bold ${result.ok ? 'text-green-600' : 'text-red-600'}`}>
                          {result.ok ? '✅ Funcionando' : '❌ Problema'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {!result.ok && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Como resolver:</strong>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Verifique se o secret está configurado no Supabase Project Settings → Config</li>
                        <li>Execute: <code className="bg-muted px-1 rounded">supabase secrets set ZAPI_PARTNER_TOKEN="seu_token" --project-ref xekxewtggioememydenu</code></li>
                        <li>Redeploy as Edge Functions: <code className="bg-muted px-1 rounded">supabase functions deploy --project-ref xekxewtggioememydenu</code></li>
                        <li>Execute este diagnóstico novamente</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}

                {result.ok && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>✅ Tudo funcionando!</strong> O ZAPI_PARTNER_TOKEN está acessível. 
                      Você pode prosseguir com o fluxo normal de conexão WhatsApp.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}