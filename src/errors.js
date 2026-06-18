export class UriControlError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
  }
}

export class UriParseError extends UriControlError {}
export class RouteNotFoundError extends UriControlError {}
export class PolicyDeniedError extends UriControlError {}
export class HandlerNotFoundError extends UriControlError {}
export class HandlerExecutionError extends UriControlError {}
