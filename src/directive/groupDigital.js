const groupDigital = (num) => num.toLocaleString();

export default {
  mounted(el, bind) {
    el.innerHTML = groupDigital(bind.value);
  },
  updated(el, bind) {
    el.innerHTML = groupDigital(bind.value);
  },
};
