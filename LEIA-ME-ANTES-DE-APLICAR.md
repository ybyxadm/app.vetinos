# Correções de navegação e estoque — Vetinos

As alterações desta branch foram preparadas para revisão e teste local antes de qualquer publicação no ambiente oficial.

## Arquivos alterados

- `docs/assets/js/sidebar.js`: padroniza o carregamento da barra lateral, mantém a verificação de sessão, cria o botão de menu em telas pequenas e inclui o acesso a Relatórios.
- `docs/assets/js/products-store.js`: cria uma fonte única para leitura e gravação local do catálogo.
- `docs/estoque.html`: corrige a inicialização da lista e usa o catálogo compartilhado.
- `docs/inventario.html`: lê e atualiza o mesmo catálogo utilizado pelo Estoque.
- `docs/validades.html`: exibe as validades dos produtos e preserva registros legados.
- `docs/relatorios.html`: adiciona relatório de estoque com totais e listagem de produtos.
- `docs/usuarios.html`: corrige a ordem de carregamento da barra lateral.

## Baixar a branch no computador

Na pasta local do projeto, execute:

```powershell
git fetch app
git checkout -b fix/estoque-sidebar-relatorios app/fix/estoque-sidebar-relatorios
npm install
npm run build
```

Se a branch local já existir, use:

```powershell
git fetch app
git checkout fix/estoque-sidebar-relatorios
git pull app fix/estoque-sidebar-relatorios
```

## Testes locais

1. Inicie o projeto conforme os comandos configurados no repositório.
2. Entre no sistema e abra Cadastro de Produtos.
3. Confirme que a lista inicial aparece sem precisar cadastrar outro item.
4. Cadastre um produto.
5. Abra Inventário e confirme que o produto aparece.
6. Ajuste a contagem e aplique; confira a quantidade em Cadastro de Produtos e Relatórios.
7. Abra Validades e confirme a exibição da validade.
8. Navegue pelos menus em desktop e celular.
9. Confira o console do navegador e teste sair/entrar novamente.

## Limitação de armazenamento

O catálogo permanece no `localStorage` do navegador, preservando a estrutura que já existia no código atual. Portanto:

- Os módulos compartilham os produtos no mesmo navegador e na mesma origem.
- Os dados não são compartilhados automaticamente entre computadores ou usuários.
- Esta alteração não implementa sincronização pelo Cloud Firestore.
- Não foi feita migração de dados nem alteração das regras Firebase.

Não considerar a integração multiusuário/multiunidade concluída até implementar e validar o serviço de dados no Firestore, com isolamento por organização e unidade.

## Publicação

Esta branch não altera a branch `main` e não executa deploy. Após revisar e validar os testes locais, a integração na branch principal e a publicação devem ser autorizadas separadamente.
