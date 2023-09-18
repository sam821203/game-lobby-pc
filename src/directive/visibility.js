export default {
  mounted(el, bind) {
    bind.value
      ? (el.style.visibility = "visible")
      : (el.style.visibility = "hidden");
  },
  updated(el, bind) {
    bind.value
      ? (el.style.visibility = "visible")
      : (el.style.visibility = "hidden");
  },
};
