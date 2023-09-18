<template>
  <table>
    <tr>
      <td colspan="2">
        <span class="item">{{ $t("單號") }}:</span>
        <!-- <br /> -->
        <span class="num">{{ tabledata.oid }}</span>
      </td>
      <td>
        <span class="item">{{ $t("存款類型") }}:</span>
        <!-- <br /> -->
        <span class="num">{{ tabledata.type }}</span>
      </td>
    </tr>
  </table>
</template>
<script setup>
import { defineProps, onMounted, ref } from "vue"; //, toRefs, ref
import request from "@/utils/request.js";
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  logType: {
    type: String,
    default: "",
  },
});
const tabledata = ref("");

const getdata = async () => {
  const { data } = await request()({
    url: `/member/trade_log/${props.id}/?logtype=${props.logType}`,
    method: "get",
  });
  data.data.data.content = JSON.parse(data.data.data.content);
  tabledata.value = data.data.data;
};

onMounted(() => {
  getdata();
});
</script>
<style lang="scss" scoped>
table {
  text-align: center;
  width: 100%;
  padding-right: 1rem;
  border-collapse: collapse;

  tr {
    text-align: left;
    // border: 5px solid transparent;
    td {
      border: 1px solid transparent;
    }
    td {
      border: $similar-table-border;
      padding: 0.2rem;
      .item {
        color: $similar-table-title;
      }
      .num {
        margin-left: 2%;
      }
    }
  }
}
</style>
