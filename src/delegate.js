export default function delegate(element, eventType, selector, handler) {
  element.addEventListener(eventType, (...args) => {
    const dataTarget = args[0].target.closest(selector);

    if (dataTarget) {
      handler.call(this, dataTarget, ...args);
    }
  });
}
