
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string>('Inizializzazione...');

  useEffect(() => {
    console.log('Index page - User state:', user);
    
    // Aggiorniamo le informazioni di debug
    setDebugInfo(`Stato utente: ${user ? 'Autenticato' : 'Non autenticato'}`);
    
    // Redirect to dashboard if logged in, otherwise to login
    if (user) {
      console.log('User is authenticated, redirecting to dashboard');
      setDebugInfo(prevState => `${prevState}\nReindirizzamento al dashboard...`);
      navigate('/dashboard', { replace: true });
    } else {
      console.log('User is not authenticated, redirecting to login');
      setDebugInfo(prevState => `${prevState}\nReindirizzamento al login...`);
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Aggiungiamo un rendering esplicito per evitare problemi di schermata bianca
  // e mostrare le informazioni di debug
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-sportivo-blue">Sportivo Connect Hub</h1>
        <p className="text-xl text-gray-600 mb-4">Caricamento in corso...</p>
        
        <div className="mt-6 p-4 bg-gray-100 rounded text-left">
          <h2 className="font-semibold mb-2">Informazioni di debug:</h2>
          <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      </div>
    </div>
  );
};

export default Index;
