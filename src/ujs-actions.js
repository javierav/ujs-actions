import delegate from './delegate';

export default class UJSActions {
  static start() {
    return new UJSActions().start();
  }

  constructor() {
    this.started = false;
  }

  start() {
    this.started = true;

    // observe ajax:success event
    delegate(window, 'ajax:success', '[data-replace]', this.htmlActionWrapper('replace'));
    delegate(window, 'ajax:success', '[data-append]', this.htmlActionWrapper('append'));
    delegate(window, 'ajax:success', '[data-prepend]', this.htmlActionWrapper('prepend'));
    delegate(window, 'ajax:success', '[data-inner]', this.htmlActionWrapper('inner'));
    delegate(window, 'ajax:success', '[data-remove]', this.removeAction);
    delegate(window, 'ajax:success', '[data-add-class]', this.classActionWrapper('add'));
    delegate(window, 'ajax:success', '[data-remove-class]', this.classActionWrapper('remove'));
    delegate(window, 'ajax:success', '[data-toggle-class]', this.classActionWrapper('toggle'));
    delegate(window, 'ajax:success', '[data-replace-class]', this.classActionWrapper('replace'));
  }

  htmlActionWrapper(type) {
    return (element, evt) => {
      this.htmlActions(type, element, evt);
    };
  }

  classActionWrapper(type) {
    return (element, evt) => {
      this.classActions(type, element, evt);
    };
  }

  htmlActions(type, element, evt) {
    const newContentHTML = evt.detail[0];
    const dataAttr = element.dataset[type];
    const contentType = evt.detail[2].getResponseHeader('Content-Type');
    let targetElement;

    if (contentType.match(/\b(?:java|ecma)script\b/)) {
      return;
    }

    // determine target element
    if (dataAttr === 'true') {
      targetElement = element;
    } else {
      targetElement = document.querySelector(dataAttr);
    }

    switch (type) {
      case 'replace':
        targetElement.outerHTML = newContentHTML;
        break;

      case 'inner':
        targetElement.innerHTML = newContentHTML;
        break;

      case 'append':
        targetElement.innerHTML = targetElement.innerHTML + newContentHTML;
        break;

      case 'prepend':
        targetElement.innerHTML = newContentHTML + targetElement.innerHTML;
        break;
    }
  }

  removeAction(element, evt) {
    const dataAttr = element.dataset.remove;
    let targetElement;

    // determine target element
    if (dataAttr === 'true') {
      targetElement = element;
    } else {
      targetElement = document.querySelector(dataAttr);
    }

    // remove element from DOM
    targetElement.remove();
  }

  classActions(type, element, evt) {
    const actionTargetAttr = element.dataset.actionTarget;
    const classAttr = element.dataset[`${type}Class`];
    let targetElement;

    if (actionTargetAttr == 'true' || actiontargetAttr === undefined) {
      targetElement = element;
    } else {
      targetElement = document.querySelector(actionTargetAttr);
    }

    switch (type) {
      case 'add':
        targetElement.classList.add(classAttr);
        break;

      case 'remove':
        targetElement.classList.remove(classAttr);
        break;

      case 'toggle':
        targetElement.classList.toggle(classAttr);
        break;

      case 'replace':
        const [oldClass, newClass] = classAttr.split(':');
        targetElement.classList.replace(oldClass, newClass);
        break;
    }
  }
}
