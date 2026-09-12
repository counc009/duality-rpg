function addOptions(select, options, selected=1, first='', disabled=true) {
  let empty = document.createElement('option');
  if (disabled) { empty.setAttribute('disabled', ''); }
  empty.setAttribute('value', first);
  empty.textContent = first;
  if (selected == 0) {
    empty.setAttribute('selected', '');
  }
  select.appendChild(empty);

  for (const [idx, o] of options.entries()) {
    let option = document.createElement('option');
    option.setAttribute('value', o);
    option.textContent = o;
    if (idx + 1 == selected) {
      option.setAttribute('selected', '');
    }
    select.appendChild(option);
  }
}

function clearChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

class CheckBox {
  constructor(where) {
    this.par = document.createElement('label');
    where.appendChild(this.par);

    this.input = document.createElement('input');
    this.input.setAttribute('type', 'checkbox');
    where.appendChild(this.input);
  }

  remove() {
    this.par.remove();
    this.input.remove();
  }

  get checked() {
    return this.input.checked;
  }

  set checked(b) {
    this.input.checked = b;
  }

  set display(s) {
    this.par.style.display = (s == 'inline-block' ? 'inline' : s);
    this.input.style.display = s;
  }

  set text(t) {
    this.par.textContent = t;
  }

  set onchange(f) {
    this.input.onchange = f;
  }
}

class LabeledSelector {
  constructor(where) {
    this.par = document.createElement('label');
    where.appendChild(this.par);

    this.select = document.createElement('select');
    where.appendChild(this.select);
  }

  remove() {
    this.par.remove();
    this.select.remove();
  }

  get value() {
    return this.select.value;
  }

  set value(v) {
    this.select.value = v;
  }

  set display(s) {
    this.par.style.display = (s == 'inline-block' ? 'inline' : s);
    this.select.style.display = s;
  }

  set text(t) {
    this.par.textContent = t;
  }

  set options(vs) {
    clearChildren(this.select);
    addOptions(this.select, vs);
  }

  set onchange(f) {
    this.select.onchange = f;
  }
}
