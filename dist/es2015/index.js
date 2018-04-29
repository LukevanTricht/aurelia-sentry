var _dec, _class;

import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

const USER_CONTEXT_EVENT = 'sentry:user-context:set';

export let SentryAppender = (_dec = inject(EventAggregator), _dec(_class = class SentryAppender {
  constructor(ea) {
    if (!ea) ea = new EventAggregator();
    this._eventSubscription = ea.subscribe(USER_CONTEXT_EVENT, data => {
      this.setUserContext(data);
    });
  }

  error(logger, message, ...rest) {
    this.captureMessage('error', message, rest);
  }

  info(logger, message, ...rest) {
    this.captureMessage('info', message, rest);
  }

  warn(logger, message, ...rest) {
    this.captureMessage('warning', message, rest);
  }

  debug(logger, message, ...rest) {
    this.captureMessage('info', message, rest);
  }

  captureMessage(level, message, rest) {
    let raven = this.getRaven();

    if (typeof raven !== 'undefined') {
      let extra = Object.assign({}, ...rest);
      let data = { level, extra };

      raven.captureMessage(message, data);
    }
  }

  getRaven() {
    return window.Raven;
  }

  setUserContext(userContext) {
    let raven = this.getRaven();

    if (typeof raven !== 'undefined') {
      raven.setUserContext(userContext);
    }
  }
}) || _class);