// @source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
//
const makeIterable = (array) => {
  if (array.next) {
    return array;
  }

  let nextIndex = 0;

  return {
    next: () =>
      nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {done: true}
  };
};

const throttledAll = (source, concurrency = 5) =>
  new Promise((res, rej) => {
    const it = makeIterable(source);

    let i = 0;
    let collected = 0;
    let lastRun = 0;
    let iteratorDone = false;
    let error = false;
    let responses = [];

    const runNext = () => {
      /**
       * Do not proceed if we've already caught an error.
       */
      if (error || iteratorDone) {
        return;
      }

      const next = it.next();

      /**
       * Do not proceed if we're done
       */
      if (next.done) {
        iteratorDone = true;
        return;
      }

      runner(i++, next.value);
    };

    const didSucceed = (id, result) => {
      collected++;

      responses[id] = result;

      if (iteratorDone && collected > lastRun) {
        res(responses);
      } else {
        runNext();
      }
    };

    const didError = e => {
      error = true;
      rej(e);
    };

    const runner = (id, fn) => {
      lastRun = id;

      try {
        fn()
          .then(resp => didSucceed(id, resp))
          .catch(didError);
      } catch (e) {
        didError(e);
      }
    };

    for (let ii = 0; ii < concurrency; ii++) {
      runNext();
    }

  })
;

if (typeof Promise !== 'undefined') {
  Promise.throttledAll = throttledAll;
}

module.exports = throttledAll;
