(() => {
  let elemBlockCounter = 0;

  const elementsToLookFor = ".feed-shared-update-v3, .feed-shared-update-v2";
  const elementsToDecorate = [];
  const escapeStringForconstiableName = (string) =>
    "elem" +
    string.replace(/[^a-z0-9]/g, (s) => {
      const c = s.charCodeAt(0);
      return ("000" + c.toString(16)).slice(-4);
    });

  const waitForElement = (selector, fn) => {
    if (window.MutationObserver || window.WebKitMutationObserver) {
      const listeners = [];
      const doc = window.document;
      const MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver;
      let observer;
      listeners.push({
        selector: selector,
        fn: fn,
      });

      const check = () => {
        listeners.forEach((listener) => {
          const elements = doc.querySelectorAll(listener.selector);

          for (const element of elements) {
            if (!element.__elementTreated) {
              element.__elementTreated = true;

              const identifier = escapeStringForconstiableName(
                listener.selector
              );

              elementsToDecorate[identifier] =
                elementsToDecorate[identifier] || [];
              elementsToDecorate[identifier].push(element);

              listener.fn.call(element, element);
            }
          }
        });
      };

      if (!observer) {
        observer = new MutationObserver(check);
        observer.observe(doc.documentElement, {
          childList: true,
          subtree: true,
        });
      }
      check();
    }
  };

  const removeNoise = () => {
    const els = document.querySelectorAll(elementsToLookFor);
    for (const el of els) {
      if (
        el &&
        el.outerHTML.match(
          /((likes|celebrates|loves|supports) this|finds this (funny|insightful)|anniversary|Just finished the course|s job update)/
        )
      ) {
        el.remove();
        elemBlockCounter++;
      }
    }
  };

  waitForElement(elementsToLookFor, removeNoise);
})();
