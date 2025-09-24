import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/auth'

import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import { Header } from '@/components/Header'

const stripePromise = loadStripe("pk_test_51RVtXFP35163kb4TT9w9cmKxDCFE1MwzYlsTZv9ikYzmvSOp90U1GfE5Kx4K1odHAtYUCmr2kVtXSGZBMW8qToBa00MSAUJyql")

type CheckoutFormProps = {
  onPaymentSuccess: (message: string) => void
  onPaymentError: (error: string) => void
  valor: number
}

const CheckoutForm = ({ onPaymentSuccess, onPaymentError, valor }: CheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', 
    })

    if (error) {
      onPaymentError(error.message || 'Ocorreu um erro ao processar o pagamento.')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const response = await api.post('/aportes', {
          bc_valor: Number(valor),
        })
        onPaymentSuccess(response.data.aporteId)
        toast.success(`Aporte realizado com sucesso!`)
      } catch (dbError: any) {
        const mensagemErro = dbError.response?.data?.error || 'Pagamento bem-sucedido, mas falha ao registrar o aporte.'
        onPaymentError(mensagemErro)
      }
    } else {
      onPaymentError('Ocorreu um erro inesperado durante o pagamento.')
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement id="payment-element" />
        <button
            disabled={isProcessing || !stripe || !elements}
            className="w-full bg-sky-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors"
        >
            <span>
                {isProcessing ? 'Processando...' : `Pagar R$ ${valor.toFixed(2)}`}
            </span>
        </button>
    </form>
  )
}


export default function RealizarAportes() {
  const [codInvestidor, setCodInvestidor] = useState<number | null>(null)
  const [bcValor, setBcValor] = useState<number | ''>('')
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const { user } = useAuth()

  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (user?.codUsuario) {
      api
        .get(`/investidor/${user.codUsuario}`)
        .then((res) => {
          setCodInvestidor(res.data.codInvestidor)
        })
        .catch((err) => {
          console.error('Erro ao buscar investidor:', err)
          setErro('Não foi possível encontrar os dados do investidor.')
        })
    }
  }, [user])

  const handleInitiatePayment = async () => {
    setMensagem(null)
    setErro(null)
    setCarregando(true)

    if (!codInvestidor) {
      setErro('Investidor não encontrado. Verifique se você está logado.')
      setCarregando(false)
      return
    }
    if (bcValor === '' || Number(bcValor) <= 0) {
      setErro('O valor do aporte deve ser maior que zero.')
      setCarregando(false)
      return
    }

    try {
      const amountInCents = Math.round(Number(bcValor) * 100)
      const response = await api.post('/criar-payment-intent', {
        amount: amountInCents,
      })
      setClientSecret(response.data.clientSecret)
    } catch (error: any) {
      const mensagemErro = error.response?.data?.error || 'Erro ao iniciar o pagamento.'
      setErro(mensagemErro)
    } finally {
      setCarregando(false)
    }
  }
  
  const handlePaymentSuccess = (msg: string) => {
    setMensagem(msg)
    setClientSecret(null)
    setBcValor('')
  }
  
  const handlePaymentError = (errMsg: string) => {
    setErro(errMsg)
  }

  const appearance: import('@stripe/stripe-js').Appearance = { theme: 'stripe', labels: 'floating' };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <Header
        title="Realizar Aporte"
        description="Realize um aporte para apoiar projetos da AGEVAP."
      />
      
      {!clientSecret ? (
        <form onSubmit={(e) => { e.preventDefault(); handleInitiatePayment(); }} className="space-y-4">
          <div>
            <label
              htmlFor="bc_valor"
              className="block text-sm font-medium text-gray-700"
            >
              Valor do Aporte (R$)
            </label>
            <input
              id="bc_valor"
              type="number"
              value={bcValor}
              onChange={(e) =>
                setBcValor(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 500,00"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={carregando || !bcValor}
            className="w-full bg-sky-950 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors"
          >
            {carregando ? 'Carregando...' : 'Ir para Pagamento'}
          </button>
        </form>
      ) : (
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <CheckoutForm 
            onPaymentSuccess={handlePaymentSuccess} 
            onPaymentError={handlePaymentError}
            valor={Number(bcValor)}
          />
        </Elements>
      )}

      {/* {mensagem && (
        <p className="mt-4 text-green-600 font-medium text-center">{mensagem}</p>
      )} */}
      {erro && (
        <div className="mt-4 text-red-600 font-medium text-center space-y-2">
            <p>{erro}</p>
            <button 
                onClick={() => { setErro(null); setClientSecret(null); }} 
                className="text-sm text-sky-900 hover:underline"
            >
                Tentar novamente
            </button>
        </div>
      )}
    </div>
  )
}
