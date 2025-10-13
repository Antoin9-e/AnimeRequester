export default class MultiSelectDropdown {
  constructor(root, { options = [], placeholder = 'Choisir...' } = {}) {
    this.root = root;
    this.options = options.map((o) => ({ label: String(o), value: String(o), selected: false }));
    this.placeholder = placeholder;
    this._render();
    this._bind();
  }

  _render() {
    this.root.classList.add('mr-0');
    // Render only the combo in the parent root. The list will be rendered as a portal
    this.root.innerHTML = `
      <div class="msd flex items-center justify-between border border-gray-300 px-3 py-2 rounded-md bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded="false">
        <div class="msd__selection text-gray-700 truncate" aria-hidden="true">${this.placeholder}</div>
        <div class="msd__caret text-gray-500 ml-2">▾</div>
      </div>
    `;
    this.selectionEl = this.root.querySelector('.msd__selection');
    this.comboEl = this.root.querySelector('.msd');

    // Create a portal list element appended to document.body so it's fixed and outside parent flow
    this._createPortalList();
    this._refreshList();
    this._updateSelectionText();
  }

  _createPortalList() {
    // remove previous if exists
    if (this.portalEl && this.portalEl.parentElement) this.portalEl.parentElement.removeChild(this.portalEl);
    this.portalEl = document.createElement('div');
    this.portalEl.className = 'msd__portal';
    // use fixed positioning so it's outside normal flow
    this.portalEl.style.position = 'fixed';
    this.portalEl.style.left = '0px';
    this.portalEl.style.top = '0px';
    this.portalEl.style.zIndex = '9999';
    this.portalEl.style.display = 'none';

    this.listEl = document.createElement('ul');
    this.listEl.className = 'msd__list mt-2 border border-gray-200 bg-white rounded-md py-1 max-h-56 overflow-auto shadow-lg';
    this.listEl.setAttribute('role', 'listbox');
    this.listEl.setAttribute('aria-multiselectable', 'true');
    this.portalEl.appendChild(this.listEl);
    document.body.appendChild(this.portalEl);
  }

  _refreshList() {
    // Rebuild list inside portal
    this.listEl.innerHTML = '';
    this.options.forEach((opt, idx) => {
      const li = document.createElement('li');
      // Tailwind classes for item
      li.className = 'msd__item px-3 py-2 flex items-center hover:bg-gray-100 focus:bg-gray-100';
      li.setAttribute('role', 'option');
      li.setAttribute('data-value', opt.value);
      li.setAttribute('aria-selected', String(opt.selected));
      // make item focusable for keyboard navigation
      li.tabIndex = 0;
      li.innerHTML = `
        <label class="msd__label flex items-center gap-2 w-full cursor-pointer">
          <input type="checkbox" class="msd__checkbox form-checkbox h-4 w-4 text-blue-600" ${opt.selected ? 'checked' : ''} />
          <span class="msd__text text-gray-700 truncate">${opt.label}</span>
        </label>
      `;
      this.listEl.appendChild(li);
    });
  }

  _bind() {
    this._onDocumentClick = (e) => {
      if (!this.root.contains(e.target) && !(this.portalEl && this.portalEl.contains(e.target))) this.close();
    };
    document.addEventListener('click', this._onDocumentClick);

    this.comboEl.addEventListener('click', (e) => {
      this.toggle();
    });

    this.listEl.addEventListener('click', (e) => {
      const li = e.target.closest('.msd__item');
      if (!li) return;
      const value = li.getAttribute('data-value');
      this.toggleValue(value);
      const cb = li.querySelector('.msd__checkbox');
      cb.focus();
    });

    this.comboEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.open();
        const first = this.listEl.querySelector('.msd__item');
        first && first.focus();
      }
    });

    // Keyboard navigation for list items
    this.listEl.addEventListener('keydown', (e) => {
      const items = Array.from(this.listEl.querySelectorAll('.msd__item'));
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[idx + 1] || items[0];
        next && next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[idx - 1] || items[items.length - 1];
        prev && prev.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
        this.comboEl.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const focused = document.activeElement;
        if (focused && focused.classList.contains('msd__item')) {
          const value = focused.getAttribute('data-value');
          this.toggleValue(value);
        }
      }
    });
  }

  toggle() {
    if (this.comboEl.getAttribute('aria-expanded') === 'true') this.close();
    else this.open();
  }

  open() {
    this.comboEl.setAttribute('aria-expanded', 'true');
    // Position portal list under the combo element
    const rect = this.comboEl.getBoundingClientRect();
    // left and top relative to viewport
    this.portalEl.style.left = `${rect.left}px`;
    this.portalEl.style.top = `${rect.bottom}px`;
    this.portalEl.style.minWidth = `${rect.width}px`;
    this.portalEl.style.display = 'block';
    this.listEl.classList.remove('hidden');
  }

  close() {
    this.comboEl.setAttribute('aria-expanded', 'false');
    this.listEl.classList.add('hidden');
    if (this.portalEl) this.portalEl.style.display = 'none';
  }

  setOptions(values) {
    this.options = values.map((o) => ({ label: String(o), value: String(o), selected: false }));
    this._refreshList();
    this._updateSelectionText();
  }

  toggleValue(value) {
    const opt = this.options.find((o) => o.value === value);
    if (!opt) return;
    opt.selected = !opt.selected;
    this._refreshList();
    this._updateSelectionText();
    this.root.dispatchEvent(new CustomEvent('change', { detail: this.getSelected() }));
  }

  getSelected() {
    return this.options.filter((o) => o.selected).map((o) => o.value);
  }

  _updateSelectionText() {
    const selected = this.getSelected();
    if (selected.length === 0) this.selectionEl.textContent = this.placeholder;
    else if (selected.length === 1) this.selectionEl.textContent = selected[0];
    else this.selectionEl.textContent = `${selected.length} sélectionnés`;
  }

  destroy() {
    document.removeEventListener('click', this._onDocumentClick);
    this.root.innerHTML = '';
    if (this.portalEl && this.portalEl.parentElement) this.portalEl.parentElement.removeChild(this.portalEl);
  }
}
