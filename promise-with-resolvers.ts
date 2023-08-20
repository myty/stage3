export {};

declare global {
  interface PromiseConstructor {
    /**
     * Creates a new Promise and returns methods to resolve or reject it.
     */
    withResolvers<TResolve = void, TReject = void>(): {
      /**
       * Resolves the promise
       */
      resolve: TResolve extends void ? () => void
        : (value: TResolve | PromiseLike<TResolve>) => void;

      /**
       * Rejects the promise
       */
      reject: TReject extends void ? () => void : (reason: TReject) => void;

      /**
       * The promise that was created.
       */
      promise: Promise<TResolve>;
    };
  }
}

if (!Promise.withResolvers) {
  Promise.withResolvers = function withResolvers<
    TResolve = void,
    TReject = void,
  >() {
    let methods: {
      resolve: TResolve extends void ? () => void
        : (value: TResolve | PromiseLike<TResolve>) => void;
      reject: TReject extends void ? () => void : (reason: TReject) => void;
    };

    const promise = new Promise<TResolve>((resolve, reject) => {
      methods = {
        resolve: (value?: TResolve | PromiseLike<TResolve>) => {
          Promise.resolve(value).then((result) => {
            resolve(result!);
          });
        },
        reject: (reason?: TReject) => {
          reject(reason);
        },
      } as typeof methods;
    });

    return { promise, ...methods! };
  };
}
