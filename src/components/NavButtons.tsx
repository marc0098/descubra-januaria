import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Mountain, Utensils, Compass, Bed, Calendar, MapPin, ArrowLeft, ArrowRight
} from 'lucide-react';

interface NavButtonsProps {
  currentPage: string;
}

const pages = [
  { id: 'cavernas', label: 'Cavernas', icon: Mountain, path: '/cavernas', color: 'bg-cavernas' },
  { id: 'gastronomia', label: 'Gastronomia', icon: Utensils, path: '/gastronomia', color: 'bg-gastronomia' },
  { id: 'guias', label: 'Guias', icon: Compass, path: '/guias', color: 'bg-guias' },
  { id: 'estadias', label: 'Hospedagem', icon: Bed, path: '/estadias', color: 'bg-hospedagem' },
  { id: 'eventos', label: 'Eventos', icon: Calendar, path: '/eventos', color: 'bg-eventos' },
  { id: 'pontos', label: 'Pontos', icon: MapPin, path: '/pontos', color: 'bg-pontos' },
];

export default function NavButtons({ currentPage }: NavButtonsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = pages.findIndex(p => p.id === currentPage);
  const currentPageData = pages[currentIndex];
  
  const otherPages = pages.filter(p => p.id !== currentPage);

  return (
    <section className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10">
      <div className="bg-surface-container rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Explore mais
          </span>
          <span className="font-sans text-[9px] text-on-surface-variant/50">
            {currentPageData?.label}
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scrollbar-hide pb-2">
          {otherPages.map((page) => {
            const Icon = page.icon;
            return (
              <motion.button
                key={page.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(page.path)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${page.color} text-white shrink-0 group hover:shadow-lg transition-all duration-300`}
              >
                <Icon size={14} className="group-hover:scale-110 transition-transform" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                  {page.label}
                </span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}