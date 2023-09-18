<template>
  <div class="term-of-service">
    <h2>{{ $t("服務條款") }}</h2>
    <ul>
      <li>
        <p class="title">{{ $t("termsOfService.title1") }}</p>
        <p>
          {{ $t("termsOfService.content1") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title2") }}</p>
        <p>
          {{ $t("termsOfService.content2") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title3") }}</p>
        <p>
          {{ $t("termsOfService.content55") }}
        </p>
        <p>
          {{ $t("termsOfService.content3") }}
        </p>
        <p>
          {{ $t("termsOfService.content4") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title4") }}</p>
        <p>
          {{ $t("termsOfService.content5") }}
        </p>
        <p>
          {{ $t("termsOfService.content6") }}
        </p>
        <p>
          {{ $t("termsOfService.content7") }}
        </p>
        <p>
          {{ $t("termsOfService.content8") }}
        </p>
        <p>
          {{ $t("termsOfService.content9") }}
        </p>
        <p>
          {{ $t("termsOfService.content10") }}
        </p>
        <p>
          {{ $t("termsOfService.content11") }}
        </p>
        <p>
          {{ $t("termsOfService.content12") }}
        </p>
        <p>
          {{ $t("termsOfService.content13") }}
        </p>
        <p>
          {{ $t("termsOfService.content14") }}
        </p>
        <p>
          {{ $t("termsOfService.content15") }}
        </p>
        <p>
          {{ $t("termsOfService.content16") }}
        </p>
        <p>
          {{ $t("termsOfService.content17") }}
        </p>
        <p>
          {{ $t("termsOfService.content18") }}
        </p>
        <p>
          {{ $t("termsOfService.content19") }}
        </p>
        <p>
          {{ $t("termsOfService.content20") }}
        </p>
        <p>
          {{ $t("termsOfService.content21") }}
        </p>
        <p>
          {{ $t("termsOfService.content22") }}
        </p>
        <!-- <p>
              {{ $t("termsOfService.content23") }}
            </p> -->
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title5") }}</p>
        <p>
          {{ $t("termsOfService.content24") }}
        </p>
        <p>
          {{ $t("termsOfService.content56") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title6") }}</p>
        <p>
          {{ $t("termsOfService.content25") }}
        </p>
        <p>
          {{ $t("termsOfService.content26") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title7") }}</p>
        <p>
          {{ $t("termsOfService.content27") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title8") }}</p>
        <p>
          {{ $t("termsOfService.content28") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title9") }}</p>
        <p>
          {{ $t("termsOfService.content29") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title10") }}</p>
        <p>
          {{ $t("termsOfService.content30") }}
        </p>
        <p>
          {{ $t("termsOfService.content31") }}
        </p>
        <p>
          {{ $t("termsOfService.content32") }}
        </p>
        <p>
          {{ $t("termsOfService.content33") }}
        </p>
        <p>
          {{ $t("termsOfService.content34") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title11") }}</p>
        <p>
          {{ $t("termsOfService.content35") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title12") }}</p>
        <p>
          {{ $t("termsOfService.content36") }}
          <span>{{ $t("termsOfService.content57") }}</span>
        </p>
        <p>
          {{ $t("termsOfService.content37") }}
        </p>
        <p>
          {{ $t("termsOfService.content38") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title13") }}</p>
        <p>
          {{ $t("termsOfService.content39") }}
        </p>
        <p>
          {{ $t("termsOfService.content40") }}
        </p>
        <p>
          {{ $t("termsOfService.content41") }}
        </p>
        <p>
          {{ $t("termsOfService.content42") }}
        </p>
        <p>
          {{ $t("termsOfService.content43") }}
        </p>
        <p>
          {{ $t("termsOfService.content44") }}
        </p>
        <p>
          {{ $t("termsOfService.content46") }}
        </p>
        <p>
          {{ $t("termsOfService.content47") }}
        </p>
        <p>
          {{ $t("termsOfService.content48") }}
        </p>
        <p>
          {{ $t("termsOfService.content49") }}
        </p>
        <p>
          {{ $t("termsOfService.content50") }}
        </p>
        <p>
          {{ $t("termsOfService.content51") }}
        </p>
        <p>
          {{ $t("termsOfService.content51") }}
        </p>
        <p>
          {{ $t("termsOfService.content53") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("termsOfService.title14") }}</p>
        <p>
          {{ $t("termsOfService.content54") }}
        </p>
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
}
p {
  font-size: 14px;
  color: $content-text-2;
  line-height: 1.6;
}
.title {
  margin-bottom: 2px;
  font-size: 16px;
  color: $title2;
}
</style>
