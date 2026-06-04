import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso do portal Descubra Januária. Regras para navegação, uso de conteúdo e responsabilidades.',
  alternates: { canonical: 'https://descubrajanuaria.com.br/termos' },
  robots: { index: true, follow: true },
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[900px] mx-auto">
      <article className="prose prose-lg max-w-none">
        <header>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary uppercase mb-4">
            Termos de Uso
          </h1>
          <p className="text-on-surface-variant text-sm">
            Última atualização: janeiro de 2026
          </p>
        </header>

        <section className="mt-10 space-y-6 text-on-surface-variant leading-relaxed">
          <p>
            Bem-vindo ao <strong>Descubra Januária</strong>. Ao acessar e utilizar
            este portal, você concorda com os termos e condições descritos abaixo.
            Caso não concorde, recomendamos que não utilize o site.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">1. Sobre o Portal</h2>
          <p>
            O Descubra Januária é um portal de divulgação turística da cidade de
            Januária, MG. As informações sobre atrativos, hospedagem, gastronomia,
            eventos e guias são fornecidas pelos próprios estabelecimentos e
            profissionais cadastrados.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">2. Uso do Conteúdo</h2>
          <p>
            O conteúdo deste site (textos, imagens, marcas) é protegido por direitos
            autorais. É permitida a reprodução para fins não comerciais, desde que
            citada a fonte. Para uso comercial, entre em contato.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">3. Limitação de Responsabilidade</h2>
          <p>
            Nos esforçamos para manter as informações atualizadas e precisas, mas
            não garantimos a exatidão absoluta. Preços, horários e disponibilidade
            devem ser confirmados diretamente com cada estabelecimento antes da visita.
            O Descubra Januária não se responsabiliza por danos decorrentes de
            informações imprecisas ou alterações de última hora.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">4. Links Externos</h2>
          <p>
            Este site pode conter links para sites de terceiros (Google Maps,
            Instagram, sites de hotéis, etc.). Não somos responsáveis pelo conteúdo
            desses sites externos.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">5. Conduta do Usuário</h2>
          <p>
            É vedado utilizar este portal para fins ilegais, difamatórios, ofensivos
            ou que violem direitos de terceiros. Reservamo-nos o direito de remover
            conteúdos e bloquear usuários que violem estas condições.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">6. Alterações</h2>
          <p>
            Estes Termos podem ser atualizados periodicamente. Recomendamos a leitura
            regular desta página.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">7. Foro</h2>
          <p>
            Fica eleito o foro da comarca de Januária/MG para dirimir quaisquer
            questões relativas a estes Termos, com renúncia a qualquer outro, por
            mais privilegiado que seja.
          </p>
        </section>
      </article>
    </main>
  );
}
