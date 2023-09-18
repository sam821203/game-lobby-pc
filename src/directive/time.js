import moment from "moment";

export default {
  mounted(el, bind) {
    el.innerHTML = moment(bind.value)
      .tz("America/Sao_Paulo")
      .format("DD/MM/YYYY");
  },
};
