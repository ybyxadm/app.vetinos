// Importa o Firebase Auth para proteger o sistema globalmente
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { db } from "../src/firebase.js";

const auth = getAuth();

// BLINDAGEM GLOBAL DE ROTA: Expulsa se não estiver logado
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "acesso.html";
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSidebarLayout, { once: true });
} else {
  initializeSidebarLayout();
}

function renderSidebar(activePage = 'dashboard') {
  const sidebarHTML = `
    <div class="p-5 border-b border-slate-200 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="bg-primary text-white font-bold px-3 py-1.5 rounded-lg text-md transition-colors shadow-sm">Vetinos</span>
        <span class="text-xs font-bold text-slate-700">YBYX Corp</span>
      </div>
      <button onclick="handleLogout()" title="Sair do Sistema" class="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 rounded-lg font-semibold transition-colors border border-red-200">
        Sair
      </button>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto text-sm">
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Módulo Ativo</div>
      <div class="space-y-1">
        <div class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-900 bg-slate-50 font-semibold">
          <span class="flex items-center gap-2">📦 Farmácia & Estoque</span>
        </div>
        <div class="pl-4 space-y-1 border-l-2 border-slate-200 ml-3">
          <a href="estoque.html" class="block w-full text-left px-3 py-2 rounded-lg text-xs ${activePage === 'estoque' ? 'font-semibold text-primary bg-primary-light' : 'font-medium text-slate-600 hover:bg-slate-50'} transition-colors">Cadastro & Produtos</a>
          <a href="validades.html" class="block w-full text-left px-3 py-2 rounded-lg text-xs ${activePage === 'validades' ? 'font-semibold text-primary bg-primary-light' : 'font-medium text-slate-600 hover:bg-slate-50'} transition-colors">Validades & Lotes</a>
          <a href="inventario.html" class="block w-full text-left px-3 py-2 rounded-lg text-xs ${activePage === 'inventario' ? 'font-semibold text-primary bg-primary-light' : 'font-medium text-slate-600 hover:bg-slate-50'} transition-colors">Inventário & Contagem</a>
        </div>
      </div>
      <div class="pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Outros Módulos</div>
      <a href="cadastro.html" class="block w-full text-left px-3 py-2.5 rounded-xl ${activePage === 'cadastro' ? 'font-semibold text-primary bg-primary-light' : 'text-slate-700 hover:bg-slate-50 font-medium'} transition-colors">👥 Cadastros (Tutores & Pet)</a>
      <div class="pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Sistema</div>
      <a href="dashboard.html" class="block w-full text-left px-3 py-2.5 rounded-xl ${activePage === 'dashboard' ? 'font-semibold text-primary bg-primary-light' : 'text-slate-700 hover:bg-slate-50 font-medium'} transition-colors">⚙️ Configurações & Hub</a>
      <a href="usuarios.html" class="block w-full text-left px-3 py-2.5 rounded-xl ${activePage === 'usuarios' ? 'font-semibold text-primary bg-primary-light' : 'text-slate-700 hover:bg-slate-50 font-medium'} transition-colors">🔒 Usuários & Permissões</a>
    </nav>
  `;

  const sidebarEl = document.getElementById('app-sidebar');
  if (sidebarEl) sidebarEl.innerHTML = sidebarHTML;
}
window.renderSidebar = renderSidebar;

window.toggleMobileSidebar = function(forceClose = false) {
  const body = document.getElementById('app-body');
  if (!body) return;
  const shouldOpen = forceClose ? false : !body.classList.contains('sidebar-open');
  body.classList.toggle('sidebar-open', shouldOpen);
  const button = document.getElementById('mobile-menu-button');
  if (button) button.setAttribute('aria-expanded', String(shouldOpen));
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.hidden = !shouldOpen;
};

window.handleLogout = function() {
  signOut(auth).then(() => {
    window.location.href = "acesso.html";
  }).catch((error) => {
    console.error("Erro ao sair:", error);
  });
};

window.applyTheme = function(primary, hover, lightBg) {
  document.documentElement.style.setProperty('--ybyx-primary', primary);
  document.documentElement.style.setProperty('--ybyx-primary-hover', hover);
  document.documentElement.style.setProperty('--ybyx-primary-light', lightBg);
  localStorage.setItem('ybyx_primary', primary);
  localStorage.setItem('ybyx_hover', hover);
  localStorage.setItem('ybyx_light', lightBg);
};

function initializeSidebarLayout() {
  const body = document.getElementById('app-body');
  const menuButton = document.getElementById('mobile-menu-button');
  if (body && menuButton) {
    const overlay = document.createElement('button');
    overlay.id = 'sidebar-overlay';
    overlay.type = 'button';
    overlay.setAttribute('aria-label', 'Fechar menu');
    overlay.hidden = true;
    overlay.addEventListener('click', () => window.toggleMobileSidebar(true));
    body.appendChild(overlay);

    menuButton.addEventListener('click', () => window.toggleMobileSidebar());
  }

  if (localStorage.getItem('ybyx_sidebar_right') === 'true' && body) {
    body.classList.add('flex-row-reverse');
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('#app-sidebar a')) window.toggleMobileSidebar(true);
  });

  const p = localStorage.getItem('ybyx_primary');
  const h = localStorage.getItem('ybyx_hover');
  const l = localStorage.getItem('ybyx_light');
  if (p && h) {
    document.documentElement.style.setProperty('--ybyx-primary', p);
    document.documentElement.style.setProperty('--ybyx-primary-hover', h);
    if (l) document.documentElement.style.setProperty('--ybyx-primary-light', l);
  }
});