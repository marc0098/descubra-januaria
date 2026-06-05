import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso do portal Descubra Januária. Regras para navegação, uso de conteúdo, reivindicação de estabelecimentos e responsabilidades.',
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
            Última atualização: junho de 2026
          </p>
        </header>

        <section className="mt-10 space-y-6 text-on-surface-variant leading-relaxed">
          <p>
            Bem-vindo ao <strong>Descubra Januária</strong>. Ao acessar e utilizar
            este portal, você concorda com os termos e condições descritos abaixo.
            Caso não concorde, recomendamos que não utilize o site.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">1. Sobre o Portal e a Origem dos Dados</h2>
          <p>
            O Descubra Januária é um portal independente de divulgação turística e cultural da cidade de
            Januária, MG. Com o objetivo de fomentar o turismo e impulsionar o comércio local, as informações
            sobre atrativos, hospedagem, gastronomia, eventos e serviços exibidas inicialmente neste site são
            de caráter estritamente informativo e coletadas a partir de <strong>fontes públicas oficiais</strong>,
            guias municipais e canais de ampla divulgação dos próprios estabelecimentos.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">2. Atualização e Reivindicação de Páginas</h2>
          <p>
            O portal incentiva a participação ativa e a curadoria do comércio local:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Reivindicação de Conteúdo:</strong> Caso você seja o proprietário legal ou representante de um
              estabelecimento listado, poderá reivindicar a página do seu negócio para gerenciar, corrigir ou atualizar
              fotos, horários, cardápios, contatos e serviços.
            </li>
            <li>
              <strong>Planos e Funcionalidades:</strong> O portal disponibiliza a inserção básica de dados públicos de
              forma promocional ou sob condições específicas da plataforma, reservando-se o direito de oferecer planos de
              destaque, ferramentas avançadas de automação ou recursos adicionais de visibilidade mediante contratação.
            </li>
            <li>
              <strong>Solicitação de Remoção (Opt-Out):</strong> Respeitamos integralmente a sua decisão comercial. Se você
              não deseja que sua empresa ou serviço seja divulgado neste portal, basta solicitar a exclusão através dos
              nossos canais de atendimento. O conteúdo será removido em até 48 horas úteis, sem qualquer burocracia.
            </li>
          </ul>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">3. Uso do Conteúdo</h2>
          <p>
            O conteúdo institucional deste site (textos descritivos próprios, identidade visual e marcas do portal) é
            protegido por direitos autorais. É permitida a reprodução para fins não comerciais e informativos, desde que
            citada a fonte (Descubra Januária).
          </p>
          <p>
            As imagens e logomarcas dos estabelecimentos cadastrados pertencem aos seus respectivos proprietários ou são
            de uso público, sendo utilizadas aqui exclusivamente para fins de divulgação e publicidade do próprio local.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">4. Limitação de Responsabilidade</h2>
          <p>
            Nos esforçamos para manter o portal organizado e funcional, porém, como as informações comerciais mudam rapidamente,
            <strong> não garantimos a exatidão absoluta dos dados</strong>. Preços, cardápios, horários de funcionamento e
            disponibilidade de vagas devem ser confirmados pelo usuário diretamente com cada estabelecimento antes da visita.
          </p>
          <p>
            O Descubra Januária não se responsabiliza por:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Danos decorrentes de informações desatualizadas fornecidas por terceiros ou coletadas de fontes públicas;</li>
            <li>Alterações de última hora em eventos, preços ou serviços dos locais listados;</li>
            <li>Transações comerciais, reservas, pagamentos ou contratos firmados entre os usuários e os estabelecimentos divulgados.</li>
          </ul>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">5. Links Externos</h2>
          <p>
            Este site contém links para plataformas de terceiros (como Google Maps, redes sociais Instagram/Facebook,
            sistemas de reservas e WhatsApp dos estabelecimentos). Não temos controle e não somos responsáveis pelas
            políticas de privacidade, funcionamento ou conteúdo desses links externos.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">6. Conduta do Usuário</h2>
          <p>
            É vedado utilizar este portal para fins ilegais, difamatórios, ofensivos, para disseminar informações falsas
            sobre os locais ou que violem direitos de terceiros. Reservamo-nos o direito de remover comentários, avaliações
            ou bloquear usuários que violem estas condições.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">7. Alterações nestes Termos e Serviços</h2>
          <p>
            Estes Termos de Uso e o modelo de serviços do portal podem ser atualizados periodicamente para refletir novas
            funcionalidades, ferramentas de monetização ou mudanças jurídicas. Recomendamos a leitura regular desta página.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">8. Canal de Atendimento e Suporte</h2>
          <p>
            Para reivindicar seu estabelecimento, atualizar dados, solicitar a remoção de sua página ou conhecer as ferramentas
            de divulgação do portal, entre em contato através do e-mail: <strong>contato@descubrajanuaria.com.br</strong> ou
            pelo WhatsApp: <strong>(38) 99266-4400</strong>.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">9. Foro</h2>
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