<template>
  <div></div>
</template>

<script setup>
import { agentac } from "@/utils/getAgent";
import { getAgentStyleApi } from "@/api/info.js";
import { typeB } from "@/utils/verifyAgent";

const getAgentStyle = async () => {
  // 打API
  const { data } = await getAgentStyleApi(agentac);
  console.log(data.data.lobbystyle);
  switch (data.data.lobbystyle) {
    case "B":
      break;
    case "A":
      typeB();
      break;
  }
};
getAgentStyle();
</script>
