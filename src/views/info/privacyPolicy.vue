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
  color: $primary-title;
  margin: 0 0 16px 0;
}
li {
  margin-bottom: 20px;
  font-size: 12px;
  color: $primary-text;
  line-height: 1.5;
}
</style>
