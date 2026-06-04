import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade do portal Descubra Januária, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).',
  alternates: { canonical: 'https://descubrajanuaria.com.br/privacidade' },
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[900px] mx-auto">
      <article className="prose prose-lg max-w-none">
        <header>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary uppercase mb-4">
            Política de Privacidade
          </h1>
          <p className="text-on-surface-variant text-sm">
            Última atualização: janeiro de 2026
          </p>
        </header>

        <section className="mt-10 space-y-6 text-on-surface-variant leading-relaxed">
          <p>
            Esta Política de Privacidade descreve como o portal <strong>Descubra Januária</strong>
            coleta, usa e protege as informações dos seus visitantes, em conformidade
            com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">1. Dados Coletados</h2>
          <p>Coletamos as seguintes informações:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Dados de navegação</strong>: endereço IP, tipo de navegador, sistema operacional, páginas visitadas e tempo de sessão (via Vercel Analytics).</li>
            <li><strong>Cookies</strong>: cookies técnicos necessários para o funcionamento do site e preferências de tema (claro/escuro).</li>
            <li><strong>Dados de contato</strong>: quando você preenche formulários ou interage via WhatsApp com estabelecimentos listados.</li>
          </ul>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">2. Finalidades de Uso</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Melhorar a experiência do usuário;</li>
            <li>Analisar métricas de访问 agregadas e anônimas;</li>
            <li>Responder a contatos e solicitações;</li>
            <li>Cumprir obrigações legais.</li>
          </ul>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">3. Compartilhamento</h2>
          <p>
            Não vendemos seus dados. Eventuais compartilhamentos ocorrem apenas com
            prestadores de serviço essenciais (Firebase/Google Cloud, Vercel) sob
            contratos de confidencialidade, ou quando exigido por lei.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">4. Direitos do Titular</h2>
          <p>
            Conforme a LGPD, você pode solicitar a qualquer momento: confirmação da
            existência de tratamento, acesso, correção, anonimização, portabilidade
            ou eliminação dos seus dados. Entre em contato pelo e-mail
            <strong> contato@descubrajanuaria.com.br</strong>.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">5. Segurança</h2>
          <p>
            Utilizamos HTTPS, cabeçalhos de segurança (HSTS, CSP, X-Frame-Options) e
            autenticação via Firebase Authentication com App Check para proteger
            comunicações e prevenir acessos não autorizados.
          </p>

          <h2 className="font-headline text-2xl font-bold text-primary uppercase mt-8">6. Encarregado de Dados (DPO)</h2>
          <p>
            Para questões relativas a esta política, contate nosso encarregado pelo
            e-mail <strong>privacidade@descubrajanuaria.com.br</strong>.
          </p>
        </section>
      </article>
    </main>
  );
}
