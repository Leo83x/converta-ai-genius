
import Layout from '@/components/Layout';
import EvolutionCustomerForm from '@/components/EvolutionCustomerForm';

const EvolutionCustomer = () => {
  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Criar Cliente Evolution</h1>
          <p className="text-sm md:text-base text-gray-600">
            Registre um novo cliente na Evolution API Cloud com canal WhatsApp ativado.
          </p>
        </div>

        <div className="flex justify-center">
          <EvolutionCustomerForm />
        </div>
      </div>
    </Layout>
  );
};

export default EvolutionCustomer;
