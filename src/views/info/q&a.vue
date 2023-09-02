<template>
  <div class="questions">
    <h2>{{ $t("常見問題") }}</h2>
    <ul>
      <li
        v-for="(item, index) in allQA"
        :key="item.id"
        :id="item.id"
        :class="['item-wrap', { isOpen: open === index }]"
        @click="readQA(index, item.id)"
      >
        <div class="item-box">
          <img
            src="@/assets/images/modal/list_open3.png"
            alt=""
            class="list-open"
          />
          <p class="item-title">
            {{ $t(item.title) }}
          </p>
        </div>
        <div class="content" v-show="showContent === index">
          <p>{{ $t(item.content) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue-demi";

const showContent = ref(-1);
const open = ref(-1);
const allQA = ref([
  {
    id: 1,
    title: "question.title1",
    content: "question.content1",
  },
  {
    id: 2,
    title: "question.title2",
    content: "question.content2",
  },
  {
    id: 3,
    title: "question.title3",
    content: "question.content3",
  },
  {
    id: 4,
    title: "question.title4",
    content: "question.content4",
  },
  {
    id: 5,
    title: "question.title5",
    content: "question.content5",
  },
  {
    id: 6,
    title: "question.title6",
    content: "question.content6",
  },
  {
    id: 7,
    title: "question.title7",
    content: "question.content7",
  },
  {
    id: 8,
    title: "question.title8",
    content: "question.content8",
  },
  {
    id: 9,
    title: "question.title9",
    content: "question.content9",
  },
  {
    id: 10,
    title: "question.title10",
    content: "question.content10",
  },
  {
    id: 11,
    title: "question.title11",
    content: "question.content11",
  },
  {
    id: 12,
    title: "question.title12",
    content: "question.content12",
  },
  {
    id: 13,
    title: "question.title13",
    content: "question.content13",
  },
  {
    id: 14,
    title: "question.title14",
    content: "question.content14",
  },
  {
    id: 15,
    title: "question.title15",
    content: "question.content15",
  },
  {
    id: 16,
    title: "question.title16",
    content: "question.content16",
  },
  {
    id: 17,
    title: "question.title17",
    content: "question.content17",
  },
  {
    id: 18,
    title: "question.title18",
    content: "question.content18",
  },
  {
    id: 19,
    title: "question.title19",
    content: "question.content19",
  },
  {
    id: 20,
    title: "question.title20",
    content: "question.content20",
  },
  {
    id: 21,
    title: "question.title21",
    content: "question.content21",
  },
  {
    id: 22,
    title: "question.title22",
    content: "question.content22",
  },
  // {
  //   id: 23,
  //   title: "question.title23",
  //   content: "question.content23",
  // },
]);

const readQA = (index) => {
  if (showContent.value === index) {
    showContent.value = -1;
    open.value = -1;
  } else {
    showContent.value = index;
    open.value = index;
  }
};
</script>

<style lang="scss" scoped>
h2 {
  margin: 0 0 16px 0;
  font-size: 16px;
  line-height: 150%;
  color: $primary-title;
}
ul {
  padding-right: 8px;
}
li {
  width: 100%;
  height: auto;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
  &:last-child {
    border-bottom: 0;
  }
  .item-box {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 40px;
    line-height: 40px;
    margin-bottom: 4px;
    background-color: $modal-key;
    border-radius: 6px;
    .item-title {
      width: 100%;
      font-size: 12px;
      color: $primary-white;
    }
    .list-open {
      width: 6px;
      margin-left: 3%;
      margin-right: 2%;
      mix-blend-mode: plus-lighter;
      transform: rotate(0deg);
      transition: transform 0.2s ease;
    }
  }
  .content {
    width: 100%;
    padding-top: 12px;
    padding-bottom: 12px;
    margin-bottom: 12px;
    font-size: 12px;
    color: $primary-text;
    line-height: 1.5;
    background-color: #351748;
    border-radius: 6px;
    p {
      padding-left: 4%;
      padding-right: 4%;
    }
  }
  &.isOpen {
    margin-bottom: 0;
    .list-open {
      transform: rotate(90deg);
    }
  }
}
</style>
