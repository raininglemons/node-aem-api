module.exports = (g) => {
  const it = g();
  const error = e => !console.log(e)/* && process(it.throw(e))*/;
  const process = promise => /*!console.log(promise) && */promise.value && promise.value.then(next).catch(error);
  const next = val => process(it.next(val));
  next();
};
