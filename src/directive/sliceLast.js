const sliceLast = (text, limit) => {
  let res = text;
  if (typeof text === "string" && text.length >= limit) {
    res = `${text.slice(0, limit)}...`;
  }

  return res;
};

export default {
  mounted(el, bind) {
    el.innerHTML = sliceLast(bind.value, bind.arg);
  },
  updated(el, bind) {
    el.innerHTML = sliceLast(bind.value, bind.arg);
  },
};
