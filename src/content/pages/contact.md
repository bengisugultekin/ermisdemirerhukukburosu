---
title: "İletişim"
description: "Ermiş Hukuk Bürosu iletişim bilgileri"
layout: "layouts/contact.njk"
permalink: "/contact/"
templateEngine: njk
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
    <div class="google-map" style="position: relative;">
      <iframe
        src="{{ site.contact.mapEmbedUrl }}"
        width="100%"
        height="400"
        style="border:0; display: block;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Ermiş Hukuk Bürosu Konum"
      ></iframe>
      <a
        href="{{ site.contact.mapOpenUrl }}"
        target="_blank"
        rel="noopener noreferrer"
        class="map-open-link"
        style="position: absolute; bottom: 12px; right: 12px; background: #fff; padding: 8px 14px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); font-size: 14px; color: #333; text-decoration: none; display: flex; align-items: center; gap: 6px; font-weight: 500; transition: box-shadow 0.2s;"
        onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.25)'"
        onmouseout="this.style.boxShadow='0 2px 6px rgba(0,0,0,0.2)'"
      >
        <i class="fas fa-external-link-alt"></i>
        Google Maps'te aç
      </a>
    </div>
  </div>
</div>
<div class="gap-40"></div>
