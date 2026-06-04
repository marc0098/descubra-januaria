import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre o Descubra Januária',
  description: 'Conheça o projeto Descubra Januária: portal oficial de turismo da cidade de Januária, Norte de Minas Gerais. Promovemos as Cavernas do Peruaçu, a cachaça artesanal e o ecoturismo regional.',
  alternates: { canonical: 'https://descubrajanuaria.com.br/sobre' },
};

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1200px] mx-auto">
      <article className="prose prose-lg max-w-none">
        <header>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary uppercase mb-4">
            Sobre o Descubra Januária
          </h1>
          <p className="text-on-surface-variant text-lg">
            O portal oficial de promoção do turismo em Januária, Minas Gerais.
          </p>
        </header>

        <section className="mt-10 space-y-6 text-on-surface-variant leading-relaxed">
          <p>
            O <strong>Descubra Januária</strong> nasceu com a missão de conectar visitantes
            às riquezas naturais, históricas e culturais do <strong>Norte de Minas Gerais</strong>.
            Localizada às margens do Rio São Francisco, Januário guarda em seu território
            o majestoso <strong>Parque Nacional Cavernas do Peruaçu</strong> — Patrimônio
            Mundial da UNESCO desde 2025 —, cachoeiras, trilhas, sítios arqueológicos
            com pinturas rupestres de até 12 mil anos, e uma tradição gastronômica única
            que tem na cachaça artesanal um de seus maiores símbolos.
          </p>

          <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary uppercase mt-10">
            O que você encontra aqui
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cavernas do Peruaçu</strong> — informações sobre as principais grutas, trilhas e agendamento de visitas.</li>
            <li><strong>Pontos Turísticos</strong> — roteiro urbano pela história, arquitetura e paisagens da cidade.</li>
            <li><strong>Hospedagem</strong> — hotéis, pousadas e chalés para todos os perfis de viajante.</li>
            <li><strong>Gastronomia</strong> — restaurantes, pratos típicos e a famosa cachaça artesanal.</li>
            <li><strong>Eventos</strong> — agenda cultural com festas tradicionais, shows e festivais.</li>
            <li><strong>Guias Credenciados</strong> — contato direto com condutores autorizados pelo ICMBio.</li>
          </ul>

          <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary uppercase mt-10">
            Nosso compromisso
          </h2>
          <p>
            Promovemos o turismo sustentável, valorizando a cultura local, a economia
            regional e a preservação ambiental. Todo o conteúdo é gerido em parceria
            com guias, pousadeiros, restaurantes e produtores locais de Januária.
          </p>
        </section>
      </article>
    </main>
  );
}
