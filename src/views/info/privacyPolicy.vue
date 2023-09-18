<template>
  <div class="privacy-policy">
    <h2>{{ $t("隱私政策") }}</h2>
    <ul>
      <li>
        {{ $t("privacy.content1") }}
      </li>
      <li>
        {{ $t("privacy.content2") }}
      </li>
      <li>
        {{ $t("privacy.content3") }}
      </li>
      <li>
        {{ $t("privacy.content4") }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  font-size: 16px;
  line-height: 150%;
  color: $title;
  margin: 0 0 16px 0;
}
ul {
  padding: 16px 20px;
  background: $group-content-box-bg;
  border-radius: $border-radius-md;
}
li {
  margin-bottom: 20px;
  font-size: 14px;
  color: $title2;
  line-height: 1.6;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
