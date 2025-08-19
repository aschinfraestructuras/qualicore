export class UIEnhancements {
  private static theme: 'light' | 'dark' | 'auto' = 'auto';
  private static animations: boolean = true;
  private static compactMode: boolean = false;
  private static highContrast: boolean = false;

  // Configurar tema
  static setTheme(theme: 'light' | 'dark' | 'auto') {
    this.theme = theme;
    this.applyTheme();
  }

  // Aplicar tema
  private static applyTheme() {
    const root = document.documentElement;
    
    if (this.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', this.theme);
    }

    // Salvar preferência
    localStorage.setItem('qualicore-theme', this.theme);
  }

  // Obter tema atual
  static getCurrentTheme(): 'light' | 'dark' {
    const root = document.documentElement;
    return root.getAttribute('data-theme') as 'light' | 'dark' || 'light';
  }

  // Alternar tema
  static toggleTheme() {
    const current = this.getCurrentTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  // Configurar animações
  static setAnimations(enabled: boolean) {
    this.animations = enabled;
    const root = document.documentElement;
    
    if (enabled) {
      root.classList.remove('no-animations');
    } else {
      root.classList.add('no-animations');
    }

    localStorage.setItem('qualicore-animations', enabled.toString());
  }

  // Verificar se animações estão ativas
  static areAnimationsEnabled(): boolean {
    return this.animations;
  }

  // Configurar modo compacto
  static setCompactMode(enabled: boolean) {
    this.compactMode = enabled;
    const root = document.documentElement;
    
    if (enabled) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }

    localStorage.setItem('qualicore-compact', enabled.toString());
  }

  // Verificar modo compacto
  static isCompactMode(): boolean {
    return this.compactMode;
  }

  // Configurar alto contraste
  static setHighContrast(enabled: boolean) {
    this.highContrast = enabled;
    const root = document.documentElement;
    
    if (enabled) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    localStorage.setItem('qualicore-high-contrast', enabled.toString());
  }

  // Verificar alto contraste
  static isHighContrast(): boolean {
    return this.highContrast;
  }

  // Carregar preferências
  static loadPreferences() {
    const savedTheme = localStorage.getItem('qualicore-theme') as 'light' | 'dark' | 'auto';
    const savedAnimations = localStorage.getItem('qualicore-animations');
    const savedCompact = localStorage.getItem('qualicore-compact');
    const savedHighContrast = localStorage.getItem('qualicore-high-contrast');

    if (savedTheme) this.setTheme(savedTheme);
    if (savedAnimations !== null) this.setAnimations(savedAnimations === 'true');
    if (savedCompact !== null) this.setCompactMode(savedCompact === 'true');
    if (savedHighContrast !== null) this.setHighContrast(savedHighContrast === 'true');
  }

  // Inicializar melhorias de UI
  static initialize() {
    this.loadPreferences();
    this.setupThemeListener();
    this.setupKeyboardShortcuts();
    this.setupFocusManagement();
    this.setupScrollRestoration();
  }

  // Configurar listener de tema do sistema
  private static setupThemeListener() {
    if (this.theme === 'auto') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        this.applyTheme();
      });
    }
  }

  // Configurar atalhos de teclado
  private static setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + K para pesquisa
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        this.focusSearch();
      }

      // Ctrl/Cmd + / para alternar tema
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        this.toggleTheme();
      }

      // Ctrl/Cmd + Shift + C para modo compacto
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        this.setCompactMode(!this.compactMode);
      }

      // Escape para fechar modais
      if (event.key === 'Escape') {
        this.closeModals();
      }
    });
  }

  // Focar na pesquisa
  private static focusSearch() {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="pesquisa"], input[placeholder*="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }

  // Fechar modais
  private static closeModals() {
    const modals = document.querySelectorAll('.modal, [role="dialog"]');
    modals.forEach(modal => {
      const closeButton = modal.querySelector('[data-dismiss="modal"], .close, [aria-label="Close"]');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
    });
  }

  // Configurar gestão de foco
  private static setupFocusManagement() {
    // Manter foco dentro de modais
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const modal = document.querySelector('.modal[style*="display: block"], .modal.show');
        if (modal) {
          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    });
  }

  // Configurar restauração de scroll
  private static setupScrollRestoration() {
    // Salvar posição de scroll
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('scroll-position', window.scrollY.toString());
    });

    // Restaurar posição de scroll
    window.addEventListener('load', () => {
      const savedPosition = sessionStorage.getItem('scroll-position');
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('scroll-position');
      }
    });
  }

  // Melhorar acessibilidade
  static enhanceAccessibility() {
    // Adicionar labels automáticos
    this.addAutoLabels();
    
    // Melhorar contraste
    this.enhanceContrast();
    
    // Adicionar skip links
    this.addSkipLinks();
  }

  // Adicionar labels automáticos
  private static addAutoLabels() {
    const inputs = document.querySelectorAll('input:not([id]), textarea:not([id]), select:not([id])');
    inputs.forEach((input, index) => {
      const id = `auto-label-${index}`;
      input.setAttribute('id', id);
      
      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = this.generateLabelText(input as HTMLInputElement);
      
      input.parentNode?.insertBefore(label, input);
    });
  }

  // Gerar texto de label
  private static generateLabelText(input: HTMLInputElement): string {
    const placeholder = input.placeholder;
    const name = input.name;
    const type = input.type;
    
    if (placeholder) return placeholder;
    if (name) return name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
    
    switch (type) {
      case 'email': return 'Email';
      case 'password': return 'Password';
      case 'search': return 'Pesquisar';
      default: return 'Campo';
    }
  }

  // Melhorar contraste
  private static enhanceContrast() {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // Verificar contraste e aplicar melhorias se necessário
      if (this.needsContrastImprovement(color, backgroundColor)) {
        element.classList.add('enhanced-contrast');
      }
    });
  }

  // Verificar se precisa de melhoria de contraste
  private static needsContrastImprovement(color: string, backgroundColor: string): boolean {
    // Implementação simplificada - em produção usar biblioteca de contraste
    return color === backgroundColor || color === 'transparent';
  }

  // Adicionar skip links
  private static addSkipLinks() {
    const skipLinks = [
      { href: '#main-content', text: 'Saltar para conteúdo principal' },
      { href: '#navigation', text: 'Saltar para navegação' },
      { href: '#search', text: 'Saltar para pesquisa' }
    ];

    const skipContainer = document.createElement('div');
    skipContainer.className = 'skip-links';
    skipContainer.setAttribute('aria-label', 'Skip links');

    skipLinks.forEach(link => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      a.className = 'skip-link';
      skipContainer.appendChild(a);
    });

    document.body.insertBefore(skipContainer, document.body.firstChild);
  }

  // Configurar lazy loading
  static setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
  }

  // Configurar infinite scroll
  static setupInfiniteScroll(container: HTMLElement, loadMoreCallback: () => void) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadMoreCallback();
        }
      });
    });

    const sentinel = document.createElement('div');
    sentinel.className = 'scroll-sentinel';
    container.appendChild(sentinel);
    observer.observe(sentinel);
  }

  // Configurar drag and drop
  static setupDragAndDrop(container: HTMLElement, onDrop: (files: FileList) => void) {
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      container.classList.add('drag-over');
    });

    container.addEventListener('dragleave', () => {
      container.classList.remove('drag-over');
    });

    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('drag-over');
      
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        onDrop(files);
      }
    });
  }

  // Configurar tooltips
  static setupTooltips() {
    const elements = document.querySelectorAll('[data-tooltip]');
    
    elements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = (e.target as HTMLElement).dataset.tooltip || '';
        document.body.appendChild(tooltip);
        
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
      });

      element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
          tooltip.remove();
        }
      });
    });
  }

  // Configurar notificações toast
  static showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  // Configurar loading states
  static setLoadingState(element: HTMLElement, loading: boolean) {
    if (loading) {
      element.classList.add('loading');
      element.setAttribute('aria-busy', 'true');
    } else {
      element.classList.remove('loading');
      element.removeAttribute('aria-busy');
    }
  }

  // Configurar skeleton loading
  static createSkeletonLoader(container: HTMLElement, itemCount: number = 5) {
    container.innerHTML = '';
    
    for (let i = 0; i < itemCount; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-item';
      skeleton.innerHTML = `
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text"></div>
      `;
      container.appendChild(skeleton);
    }
  }
}
