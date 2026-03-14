# TODO — Ermiş Hukuk Bürosu Website

## Kritik (Breaking)

- [x] `truncate` filtresi `.eleventy.js`'e eklendi
- [x] `_whatsapp-float.scss` silindi (kullanılmıyordu)

---

## Yüksek Öncelik

- [x] Border-radius güncellendi (sm: 2px, md: 4px, lg: 6px)
- [ ] `_lawyers.scss` içindeki hardcoded hex renkleri (`#e0e0e0`, `#fafafa` vb.) design token'larla değiştir
- [x] 404 sayfası oluşturuldu
- [x] Breadcrumb URL düzeltildi (`#` → `/#makaleler`)
- [ ] `services.json` (6 kategori) ile `.eleventy.js` (10 koleksiyon) uyumsuzluğunu gider
- [ ] Eksik 3 hukuk dalı sayfasını oluştur: Ticaret Hukuku, İş Hukuku, Gayrimenkul Hukuku

---

## Orta Öncelik (SEO & UX)

- [ ] Article schema'ya `image`, `description`, `articleBody` ekle — `structured-data.njk`
- [ ] Organization schema'ya `sameAs`, `foundingDate` ekle
- [ ] `background-attachment: fixed` kaldır veya alternatifle değiştir — `_breadcrumb.scss`
- [ ] Hero parallax'a viewport kontrolü ekle — `site.js`
- [ ] Avukat kartlarına baro numarası, sertifika, deneyim yılı ekle — `lawyers.json`
- [ ] Print CSS ekle (`@media print`)
- [ ] Bazı görsellere `loading="lazy"` attribute'u eksik — kontrol et

---

## Düşük Öncelik (Uzun Vadeli)

- [ ] SSS (FAQ) bölümü ekle
- [ ] Müvekkil referansları / başarı hikayeleri bölümü ekle
- [ ] İletişim formu ekle (şu an sadece telefon/WhatsApp linki var)
- [ ] Scroll animasyon gecikme sistemi 9 öğeyle sınırlı — `_animations.scss`
- [ ] Sass sürümünü güncelle (`^1.52.3` → güncel)
- [ ] Service Worker / PWA desteği ekle

---

## Tamamlanan

- [x] Homepage carousel → modern BEM hero layout
- [x] `_cards.scss` kart bileşeni oluşturuldu
- [x] 7 makale içeriği güncellendi
- [x] Pagination → load-more butonu
- [x] Sitemap güncellendi
