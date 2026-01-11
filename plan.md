Reorganização e Estabilização de Testes:
Mover arquivos em __tests__ para subpastas (unit, integration, properties, infra).
Atualizar setup.ts com mocks globais da supabase para simular um usuário autenticado, evitando falhas em testes de UI.
Navegação de Alta Performance:
Migrar as páginas do dashboard para um Route Group (dashboard) (ex: layout.tsx) para manter a Sidebar fixa e evitar re-renderizações.
Implementar transições de "slide" lateral usando motion/react no conteúdo principal.
Imersividade com Skeletons:
Configurar React.Suspense em page.tsx e páginas internas, utilizando o componente Skeleton como estado de carregamento visual.
Integração de Dados Real:
Vincular o userId do Supabase nos widgets de tarefas e notas, removendo estados mockados para permitir testes reais do usuário.
Revitalização da Landing Page:
Atualizar o DashboardPreview.tsx com uma imagem real do dashboard atualizado.
Adicionar um efeito de paralaxe/scrolling baseado no movimento do mouse para demonstrar a profundidade da UI.

Further Considerations
Mocks de API: Recomendação de usar o mock do Supabase que retorne um user fixo para que os testes de integração verifiquem se as queries estão usando o ID correto.
Otimização de Assets: O preview da landing page será tratado com next/image para garantir que o efeito de scroll não impacte a performance de carregamento da página.
Escalabilidade: A separação dos testes em pastas permitirá rodar apenas os testes de infra em CI/CD rápidos, deixando os properties para validações mais profundas.