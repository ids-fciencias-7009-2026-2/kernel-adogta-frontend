import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import FormularioCuestionario from '../components/profile/QuestionnaireForm';
import perfilBackground from '../assets/Adogta_dashboard.png';

const PaginaCuestionario = () => {
  const navegar = useNavigate();
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (!enviado) {
      return undefined;
    }

    const temporizador = setTimeout(() => {
      navegar('/');
    }, 10000);

    return () => clearTimeout(temporizador);
  }, [enviado, navegar]);

  return (
    <AuthLayout
      title="Cuestionario"
      backgroundImage={perfilBackground}
      showBackButton={true}
      backPath="/profile"
    >
      {enviado ? (
        <div className="bg-white rounded-2xl shadow-xl max-w-[720px] w-full border border-adogta-border px-8 py-10 text-center">
          <h2 className="text-adogta-primary text-xl font-semibold">
            Gracias por responder el custionario!
          </h2>
          <p className="text-adogta-primary/80 text-sm mt-3 leading-relaxed">
            Tomaremos en cuenta tus respuestas para presentarte a los compñaeros que serán más compatibles contigo.
          </p>
          <p className="text-adogta-primary/60 text-xs mt-4">
            Serás redirigido automáticamente en breve.
          </p>
        </div>
      ) : (
        <FormularioCuestionario alEnviarExitoso={() => setEnviado(true)} />
      )}
    </AuthLayout>
  );
};

export default PaginaCuestionario;
