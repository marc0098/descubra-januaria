import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, X, ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  countLabel?: string;
  placeholder: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  bgColor?: string;
}

export default function PageHeader({
  title,
  subtitle,
  count = 0,
  countLabel = 'resultados',
  placeholder,
  searchTerm,
  onSearchChange,
  bgColor = 'bg-transparent'
}: PageHeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  return (
    <section className={`${bgColor} lg:bg-white`}>
      {/* Mobile: Header estilo app nativo */}
      <div className="lg:hidden">
        <div className="px-4 pt-4 pb-3 bg-surface-container">
          {/* Título com contagem inline */}
          <div className="flex items-center gap-2 mb-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-1.5 -ml-1 rounded-full hover:bg-on-surface/5 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </button>
            <h1 className="font-headline text-xl font-bold text-on-surface">{title}</h1>
            {count > 0 && (
              <span className="text-xs text-on-surface-variant ml-1">({count})</span>
            )}
          </div>

          {/* Search compacto estilo nativo */}
          <div className="relative">
            <div className={`
              flex items-center bg-surface-container-low border border-outline-variant/20 rounded-2xl px-4 py-2.5
              transition-all duration-200
              ${isSearchFocused ? 'border-primary/40 ring-1 ring-primary/20' : 'border-transparent'}
            `}>
              <Search className="w-4 h-4 text-on-surface-variant mr-2" />
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="flex-1 bg-transparent text-on-surface text-sm placeholder:text-on-surface-variant/60 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-2 p-1 rounded-full bg-on-surface-variant/10 hover:bg-on-surface-variant/20 transition-colors"
                >
                  <X className="w-3 h-3 text-on-surface-variant" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Mantém o estilo original */}
      <div className="hidden lg:block max-w-[1200px] 2xl:max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 2xl:px-20 pt-14 pb-6 2xl:pb-8 bg-white">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant mb-2"
        >
          Januária · {count} {countLabel}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5"
        >
          <h1 className="font-headline text-[clamp(1.75rem,6vw,2.75rem)] font-bold text-on-surface leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="font-sans text-[13px] text-on-surface-variant mt-1 max-w-sm leading-snug">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={15} />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 pl-10 pr-10 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </motion.div>
      </div>

      {/* Divisor */}
      <div className="hidden lg:block border-t border-outline-variant/20" />
    </section>
  );
}