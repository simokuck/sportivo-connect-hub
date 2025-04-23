
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if logged in, otherwise to login
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Aggiungiamo un rendering esplicito per evitare problemi di schermata bianca
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-sportivo-blue">Sportivo Connect Hub</h1>
        <p className="text-xl text-gray-600">Caricamento in corso...</p>
      </div>
    </div>
  );
};

export default Index;
