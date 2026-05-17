import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Cavernas from '@/pages/Cavernas';
import Guias from '@/pages/Guias';
import GuiaPeruacu from '@/pages/GuiaPeruacu';
import Estadias from '@/pages/Estadias';
import Eventos from '@/pages/Eventos';
import Pontos from '@/pages/Pontos';
import Gastronomia from '@/pages/Gastronomia';
import { AuthProvider } from '@/admin/context/AuthContext';
import AdminLayout from '@/admin/components/AdminLayout';
import AdminLogin from '@/admin/pages/AdminLogin';
import Dashboard from '@/admin/pages/Dashboard';
import AdminGuias from '@/admin/pages/AdminGuias';
import AdminGastronomia from '@/admin/pages/AdminGastronomia';
import AdminHoteis from '@/admin/pages/AdminHoteis';
import AdminEventos from '@/admin/pages/AdminEventos';
import AdminPontos from '@/admin/pages/AdminPontos';
import AdminBanners from '@/admin/pages/AdminBanners';
import Migracao from '@/admin/pages/Migracao';
import { ProtectedRoute } from '@/admin/components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Site Público */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cavernas" element={<Cavernas />} />
            <Route path="guias" element={<Guias />} />
            <Route path="guias/peruacu" element={<GuiaPeruacu />} />
            <Route path="estadias" element={<Estadias />} />
            <Route path="eventos" element={<Eventos />} />
            <Route path="pontos" element={<Pontos />} />
            <Route path="gastronomia" element={<Gastronomia />} />
          </Route>

          {/* Admin */}
          <Route path="/adimin" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="guias" element={<AdminGuias />} />
            <Route path="gastronomia" element={<AdminGastronomia />} />
            <Route path="hoteis" element={<AdminHoteis />} />
            <Route path="eventos" element={<AdminEventos />} />
            <Route path="pontos" element={<AdminPontos />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="migracao" element={<Migracao />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
