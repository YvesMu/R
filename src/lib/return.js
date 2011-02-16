const RestError = require("./error");

class Return {
  /** @type {number} */
  _code = 200;

  /** @type {any} */
  _data = null;

  /** @type {RestError} */
  _error = null;

  /** @type {RestError[]} */
  _errors = [];

  /**
   * @param {number} code HTTP status code to return if the request is successful
   * @param {any} data Data to return
   * @param {RestError | Error | string | number | { code: number, message: string }} error Error to return
   */
  constructor(code = 200, data = null, error = null) {
    this.code = code;
    this.data = data;
    this.setError(error);
  }

  /** @returns {number} */
  get code() {
    return this._code;
  }

  /** @param {number} code */
  set code(code) {
    this._code = Number(code);
  }

  /**
   * Returns {@link Return.data|`this.data`} if there is no error, otherwise returns {@link Return.error|`this.error`} and {@link Return.errors|`this.errors`}
   *
   * When in development mode, the error stack is also returned
   *
   * @returns {any}
   */
  get data() {
    if (this._error) {
      const errorResult = { error: this.error.message, errors: this.errors };
      if (process.env.NODE_ENV === "development") {
        errorResult.stack = this.error.stack.split("\n");
      }
      return errorResult;
    }
    return this._data;
  }

  /** @param {any} data */
  set data(data) {
    this._data = data;
  }

  /** @returns {RestError} */
  get error() {
    return this._error;
  }

  /** @param {RestError | Error | string | number | { code: number, message: string }} error */
  set error(error) {
    this._error = null;
    if (!error) return;
    let errorCode = 500;
    let errorMessage = "An error occurred.";
    switch (true) {
      case error instanceof RestError:
        this._error = error;
        break;
      case error instanceof Error:
        this._error = new RestError(errorCode, error.message);
        break;
      case typeof error === "string":
        errorMessage = error;
        break;
      case typeof error === "number":
        errorCode = error;
        break;
      case typeof error === "object":
        if (error.code) errorCode = error.code;
        if (error.message) errorMessage = error.message;
        break;
      default:
        error = null;
        break;
    }
    if (this.code !== errorCode) this.code = errorCode;
    if (!this._error) this._error = new RestError(errorCode, errorMessage);
  }

  /** @returns {RestError[]} */
  get errors() {
    return this._errors;
  }

  /**
   * Checks if {@link Return.code|`this.code`} is between 200 and 299
   *
   * @returns {boolean}
   */
  get ok() {
    return this.code >= 200 && this.code < 300;
  }

  /**
   * Sets the {@link Return.error|`this.error`} property and adds it to the {@link Return.errors|`this.errors`} array
   *
   * @param {RestError | Error | string | number | { code: number, message: string }} error
   *
   * @returns {Return}
   */
  setError(error) {
    this.error = error;
    this._errors.push(this.error);
    return this;
  }

  /**
   * @param {any} data Data to return
   * @param {number} code The HTTP status code to return - defaults to 200
   *
   * @returns {Return}
   */
  static success(data, code = 200) {
    return new Return(code, data);
  }

  /**
   * @param {RestError | Error | string | number | { code: number, message: string }} error
   * @param {number} code The HTTP status code to return - defaults to 500
   *
   * @returns {Return}
   */
  static error(error, code = 500) {
    return new Return(code, null, error);
  }

  /**
   * @param {Promise} promise Promise to wait for
   * @param {number} errorCode Code to use if the promise rejects - use `undefined` to use the error code
   * @param {number} successCode Code to use if the promise resolves - defaults to 200
   *
   * @returns {Promise<Return>}
   */
  static async from(promise, errorCode = undefined, successCode = 200) {
    const instance = new this();
    try {
      instance.data = await promise;
      instance.code = successCode;
    } catch (error) {
      instance.error = error;
      instance.code = errorCode || instance.error.code;
    }
    return instance;
  }
}

module.exports = Return;
