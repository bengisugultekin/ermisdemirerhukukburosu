---
title: "İletişim"
description: "Ermiş & Demirer Hukuk Bürosu iletişim bilgileri"
layout: "layouts/contact.njk"
permalink: "/contact/"
breadcrumbs:
  - { title: "Anasayfa", url: "/" }
  - { title: "İletişim", url: "/contact/" }
---

<div class="row text-center">
  <div class="col-12">
    <h2 class="section-title">OFİSİMİZE ULAŞIN</h2>
    <h3 class="section-sub-title">KONUMUMUZU BULUN</h3>
  </div>
</div>
<!--/ Title row end -->

<div class="row">
  <div class="col-md-4 mb-4 mb-md-0">
    <div class="ts-service-box-bg text-center h-100">
      <span class="ts-service-icon icon-round">
        <i class="fas fa-map-marker-alt mr-0"></i>
      </span>
      <div class="ts-service-box-content">
        <h4>OFİSİMİZİ ZİYARET EDİN</h4>
        <p>{{ site.contact.addressFull }}</p>
      </div>
    </div>
  </div><!-- Col 1 end -->

  <div class="col-md-4 mb-4 mb-md-0">
    <div class="ts-service-box-bg text-center h-100">
      <span class="ts-service-icon icon-round">
        <i class="fa fa-envelope mr-0"></i>
      </span>
      <div class="ts-service-box-content">
        <h4>MAİL ATIN</h4>
        <p>{{ site.contact.email }}</p>
      </div>
    </div>
  </div><!-- Col 2 end -->

  <div class="col-md-4 mb-4 mb-md-0">
    <div class="ts-service-box-bg text-center h-100">
      <span class="ts-service-icon icon-round">
        <i class="fa fa-phone-square mr-0"></i>
      </span>
      <div class="ts-service-box-content">
        <h4>BİZİ ARAYIN</h4>
        <p>{{ site.contact.phone }}</p>
      </div>
    </div>
  </div><!-- Col 3 end -->
</div><!-- 1st row end -->

<div class="gap-60"></div>

<div class="row">
  <div class="col-lg-12">
    <div class="google-map">
      <div id="map" style="height: 400px;"></div>
    </div>
  </div>
</div>
<div class="gap-40"></div>
