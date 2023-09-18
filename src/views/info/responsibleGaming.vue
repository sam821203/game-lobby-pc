<template>
  <div class="responsible-gaming">
    <h2>{{ $t("理性博彩") }}</h2>
    <div class="content-wrap">
      <p>
        {{ $t("responsible.content1") }}
      </p>
      <ul>
        <li>
          <p class="title">{{ $t("responsible.title1") }}</p>
          <p>
            {{ $t("responsible.content2") }}
          </p>
          <p>
            {{ $t("responsible.content3") }}
          </p>
          <p>
            {{ $t("responsible.content4") }}
          </p>
          <p>
            {{ $t("responsible.content5") }}
          </p>
          <p>
            {{ $t("responsible.content6") }}
          </p>
          <p>
            {{ $t("responsible.content7") }}
            <br />
            <a href="https://www.begambleaware.org/" target="_blank"
              >www.gambleaware.co.uk</a
            >
          </p>
        </li>
        <li>
          <p class="title">{{ $t("responsible.title2") }}</p>
          <p>
            {{ $t("responsible.content8") }}
          </p>
          <p>
            {{ $t("responsible.content9") }}
          </p>
          <p>
            {{ $t("responsible.content10") }}
          </p>
          <p>
            {{ $t("responsible.content11") }}
          </p>
          <p>
            {{ $t("responsible.content12") }}
          </p>
          <p>
            {{ $t("responsible.content13") }}
          </p>
          <p>
            {{ $t("responsible.content14") }}
          </p>
          <p>
            {{ $t("responsible.content15") }}
          </p>
          <p>
            {{ $t("responsible.content16") }}
          </p>
          <p>
            {{ $t("responsible.content17") }}
          </p>
          <p>
            {{ $t("responsible.content18") }}
          </p>
          <p>
            {{ $t("responsible.content19") }}
          </p>
          <p>
            {{ $t("responsible.content20") }}
          </p>
          <p>
            {{ $t("responsible.content21") }}
          </p>
        </li>
        <li>
          <p class="title">{{ $t("responsible.title3") }}</p>
          <p>
            <a href="https://www.gamblersanonymous.org.uk/" target="_blank"
              >www.gamblersanonymous.org.uk
            </a>
          </p>
        </li>
        <li>
          <p class="title">{{ $t("responsible.title4") }}</p>
          <p>
            <a href="https://ccgr.org.uk/?page_id=1240&lang=en" target="_blank"
              >https://ccgr.org.uk/?page_id=1240&lang=en</a
            >
          </p>
          <p>{{ $t("responsible.content22") }}</p>
        </li>
        <li>
          <p class="title">{{ $t("responsible.title5") }}</p>
          <p>
            <a href="https://www.gamblingtherapy.org/" target="_blank"
              >www.gamblingtherapy.org</a
            >
          </p>
        </li>
        <li>
          <p class="title">{{ $t("responsible.title6") }}</p>
          <p>
            {{ $t("responsible.content23") }}
          </p>
        </li>
        <li>
          <p class="title">{{ $t("responsible.title7") }}</p>
          <p>
            {{ $t("responsible.content24") }}
          </p>
        </li>
        <li>
          <p class="title">{{ $t("responsible.title8") }}</p>
          <p>
            {{ $t("responsible.content25") }}
          </p>
          <p>
            {{ $t("responsible.content26") }}
            <span
              ><a href="https://www.netnanny.com/" target="_blank"
                >www.netnanny.com</a
              ></span
            >
          </p>
          <p>
            {{ $t("responsible.content27") }}
            <span
              ><a href="https://27labs.com/proxy/index.php" target="_blank"
                >www.cybersitter.com</a
              ></span
            >
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  margin: 0 0 16px 0;
  font-size: 16px;
  line-height: 1.5;
  color: $title;
}
.content-wrap {
  padding: 16px 20px;
  background: $group-content-box-bg;
  border-radius: $border-radius-md;
  > p {
    margin-bottom: 12px;
    font-size: 14px;
    color: $title2;
    line-height: 1.5;
  }
}
li {
  margin-bottom: 20px;
  font-size: 14px;
  color: $title2;
  line-height: 1.5;
}
a {
  color: rgba(42, 130, 228, 1);
}
</style>
