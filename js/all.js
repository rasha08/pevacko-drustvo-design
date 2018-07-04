(() => {
  class DOM {
    createListener(selector = '', type = 'click', callback = () => { }) {
      this.select(selector).addEventListener(type, callback)
    }

    select(elementString = '') {
      let element = _.trim(elementString)
      let method = ''
      if (_.startsWith(element, '#')) {
        method = 'getElementById';
        element = element.slice(1);
      } else if (_.startsWith(element, '.')) {
        method = 'getElementsByClassName';
        element = element.slice(1);
      } else {
        method = 'querySelector'
      }

      return document[method](element) || {
        classList: [],
        addEventListener: () => { }
      };
    }
  }

  const dom = new DOM();

  class Modal {
    constructor(modalSelector, triggerId = '', closerId = '#close', timeToBeActive = 0, successCallBackTrigger = '#modal-success', successCallBack, cancelCallBack) {
      this.selector = modalSelector;
      this.triggerId = triggerId;
      this.closerId = closerId
      this.timeToBeActive = _.toSafeInteger(timeToBeActive);
      this.successCallBackTrigger = successCallBackTrigger;
      this.successCallBack = successCallBack || this.closeModal;
      this.cancelCallBack = cancelCallBack || this.closeModal; 

      this.createTriggerListeners();
    }

    createTriggerListeners() {
      if (!this.triggerId) {
        this.openModal();
      } else {
        this.createTriggerListener()
      }

      this.createCloserListener();
      this.createSuccessCallbackListener();
      this.closeModalAfterTimeExpiresIfSet();
    }

    openModal() {
      dom.select(this.selector).classList.add('open')
    }

    closeModal() {
      dom.select(this.selector).classList.remove('open')
    }

    createTriggerListener() {
      dom.createListener(this.triggerId, 'click', () => this.openModal());
    }

    createCloserListener() {
      dom.createListener(this.closerId, 'click', () => {
        this.closeModal();
        this.cancelCallBack();
      });
    }

    createSuccessCallbackListener() {
      dom.createListener(this.successCallBackTrigger, 'click', () => this.successCallBack());
    }

    closeModalAfterTimeExpiresIfSet() {
      if (this.timeToBeActive !== 0) {
        setTimeout(() => this.closeModal(), this.timeToBeActive);
      }
    }
  }

  window.Modal = Modal
})();