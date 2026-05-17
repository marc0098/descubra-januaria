import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, UtensilsCrossed, Bed, Calendar, MapPin, Loader2 } from 'lucide-react';

interface Stats {
  guias: number;
  restaurantes: number;
  hoteis: number;
  eventos: number;
  pontos: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ guias: 0, restaurantes: 0, hoteis: 0, eventos: 0, pontos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [guiasSnap, restaurantesSnap, hoteisSnap, eventosSnap, pontosSnap] = await Promise.all([
          getDocs(query(collection(db, 'guias'))),
          getDocs(query(collection(db, 'gastronomia'))),
          getDocs(query(collection(db, 'hoteis'))),
          getDocs(query(collection(db, 'eventos'))),
          getDocs(query(collection(db, 'pontos'))),
        ]);
        
        setStats({
          guias: guiasSnap.size,
          restaurantes: restaurantesSnap.size,
          hoteis: hoteisSnap.size,
          eventos: eventosSnap.size,
          pontos: pontosSnap.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: 'Guias', value: stats.guias, icon: Users, color: 'bg-blue-500' },
    { label: 'Restaurantes', value: stats.restaurantes, icon: UtensilsCrossed, color: 'bg-orange-500' },
    { label: 'Hotéis', value: stats.hoteis, icon: Bed, color: 'bg-cyan-500' },
    { label: 'Eventos', value: stats.eventos, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Pontos', value: stats.pontos, icon: MapPin, color: 'bg-green-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bem-vindo ao Painel Admin</h2>
        <p className="text-gray-600">
          Gerencie todo o conteúdo do site Descubra Januária. Use o menu lateral para navegar entre os módulos.
        </p>
      </div>
    </div>
  );
}