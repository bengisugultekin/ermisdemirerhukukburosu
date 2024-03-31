/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

jQuery(function ($) {
  'use strict';

  /* ----------------------------------------------------------- */
  /*  Fixed header
  /* ----------------------------------------------------------- */
  $(window).on('scroll', function () {

    // fixedHeader on scroll
    function fixedHeader() {
      var headerTopBar = $('.top-bar').outerHeight();
      var headerOneTopSpace = $('.header-one .logo-area').outerHeight();

      var headerOneELement = $('.header-one .site-navigation');
      var headerTwoELement = $('.header-two .site-navigation');

      if ($(window).scrollTop() > headerTopBar + headerOneTopSpace) {
        $(headerOneELement).addClass('navbar-fixed');
        $('.header-one').css('margin-bottom', headerOneELement.outerHeight());
      } else {
        $(headerOneELement).removeClass('navbar-fixed');
        $('.header-one').css('margin-bottom', 0);
      }
      if ($(window).scrollTop() > headerTopBar) {
        $(headerTwoELement).addClass('navbar-fixed');
        $('.header-two').css('margin-bottom', headerTwoELement.outerHeight());
      } else {
        $(headerTwoELement).removeClass('navbar-fixed');
        $('.header-two').css('margin-bottom', 0);
      }
    }

    fixedHeader();


    // Count Up
    function counter() {
      var oTop;
      if ($('.counterUp').length !== 0) {
        oTop = $('.counterUp').offset().top - window.innerHeight;
      }
      if ($(window).scrollTop() > oTop) {
        $('.counterUp').each(function () {
          var $this = $(this),
            countTo = $this.attr('data-count');
          $({
            countNum: $this.text()
          }).animate({
            countNum: countTo
          }, {
            duration: 1000,
            easing: 'swing',
            step: function () {
              $this.text(Math.floor(this.countNum));
            },
            complete: function () {
              $this.text(this.countNum);
            }
          });
        });
      }
    }

    counter();


    // scroll to top btn show/hide
    function scrollTopBtn() {
      var scrollToTop = $('#back-to-top'),
        scroll = $(window).scrollTop();
      if (scroll >= 50) {
        scrollToTop.fadeIn();
      } else {
        scrollToTop.fadeOut();
      }
    }

    scrollTopBtn();
  });


  $(document).ready(function () {

    // navSearch show/hide
    function navSearch() {
      $('.nav-search').on('click', function () {
        $('.search-block').fadeIn(350);
      });
      $('.search-close').on('click', function () {
        $('.search-block').fadeOut(350);
      });
    }

    navSearch();

    // navbarDropdown
    function navbarDropdown() {
      if ($(window).width() < 992) {
        $('.site-navigation .dropdown-toggle').on('click', function () {
          $(this).siblings('.dropdown-menu').animate({
            height: 'toggle'
          }, 300);
        });

        var navbarHeight = $('.site-navigation').outerHeight();
        $('.site-navigation .navbar-collapse').css('max-height', 'calc(100vh - ' + navbarHeight + 'px)');
      }
    }

    navbarDropdown();


    // back to top
    function backToTop() {
      $('#back-to-top').on('click', function () {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
          scrollTop: 0
        }, 800);
        return false;
      });
    }

    backToTop();


    // banner-carousel
    function bannerCarouselOne() {
      $('.banner-carousel.banner-carousel-1').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: true,
        speed: 600,
        arrows: true,
        prevArrow: '<button type="button" class="carousel-control left" aria-label="carousel-control"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="carousel-control right" aria-label="carousel-control"><i class="fas fa-chevron-right"></i></button>'
      });
      $('.banner-carousel.banner-carousel-1').slickAnimation();
    }

    bannerCarouselOne();


    // banner Carousel Two
    function bannerCarouselTwo() {
      $('.banner-carousel.banner-carousel-2').slick({
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        speed: 600,
        arrows: true,
        prevArrow: '<button type="button" class="carousel-control left" aria-label="carousel-control"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="carousel-control right" aria-label="carousel-control"><i class="fas fa-chevron-right"></i></button>'
      });
    }

    bannerCarouselTwo();


    // pageSlider
    function pageSlider() {
      $('.page-slider').slick({
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        speed: 600,
        arrows: true,
        prevArrow: '<button type="button" class="carousel-control left" aria-label="carousel-control"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="carousel-control right" aria-label="carousel-control"><i class="fas fa-chevron-right"></i></button>'
      });
    }

    pageSlider();


    // Shuffle js filter and masonry
    function projectShuffle() {
      if ($('.shuffle-wrapper').length !== 0) {
        var Shuffle = window.Shuffle;
        var myShuffle = new Shuffle(document.querySelector('.shuffle-wrapper'), {
          itemSelector: '.shuffle-item',
          sizer: '.shuffle-sizer',
          buffer: 1
        });
        $('input[name="shuffle-filter"]').on('change', function (evt) {
          var input = evt.currentTarget;
          if (input.checked) {
            myShuffle.filter(input.value);
          }
        });
        $('.shuffle-btn-group label').on('click', function () {
          $('.shuffle-btn-group label').removeClass('active');
          $(this).addClass('active');
        });
      }
    }

    projectShuffle();


    // testimonial carousel
    function testimonialCarousel() {
      $('.testimonial-slide').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        speed: 600,
        arrows: false
      });
    }

    testimonialCarousel();


    // team carousel
    function teamCarousel() {
      $('.team-slide').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 2,
        arrows: true,
        prevArrow: '<button type="button" class="carousel-control left" aria-label="carousel-control"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="carousel-control right" aria-label="carousel-control"><i class="fas fa-chevron-right"></i></button>',
        responsive: [{
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 481,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }

    teamCarousel();


    // media popup
    function mediaPopup() {
      $('.gallery-popup').colorbox({
        rel: 'gallery-popup',
        transition: 'slideshow',
        innerHeight: '500'
      });
      $('.popup').colorbox({
        iframe: true,
        innerWidth: 600,
        innerHeight: 400
      });
    }

    mediaPopup();

  });


});

//footer
class MyFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML =
      `
<footer id="footer" class="footer bg-overlay">
  <div class="footer-main">
    <div class="container">
      <div class="row justify-content-between">
        <div class="col-lg-4 col-md-6 footer-widget footer-about">
          <h3 class="widget-title">HAKKIMIZDA</h3>
          <img loading="lazy" height="40px" class="footer-logo" src="images/footer-logo.png" alt="ermisdemirerhukuk">
          <p>Ermiş & Demirer Hukuk Bürosu olarak; tarafı olduğunuz her hukuki ilişkide sizleri en iyi şekilde temsil ediyor ve hukuki danışmanlık veriyoruz.</p>
          <div class="footer-social">
            <ul>
              <li><a href="https://wa.me/905324102112" aria-label="Whatsapp"><i
                class="fab fa-whatsapp"></i></a></li>
              <li><a href="https://telegram.com/themefisher" aria-label="Telegram"><i class="fab fa-telegram"></i></a>
              </li>
              <li><a href="https://www.instagram.com/ermisdemirerhukukburosu/" aria-label="Instagram"><i
                class="fab fa-instagram"></i></a></li>
              <li><a href="https://www.linkedin.com/in/necat-ermi%C5%9F-305807109" aria-label="Linkedin"><i class="fab fa-linkedin"></i></a></li>
            </ul>
          </div><!-- Footer social end -->
        </div><!-- Col end -->

        <div class="col-lg-4 col-md-6 footer-widget mt-5 mt-md-0">
          <h3 class="widget-title">ÇALIŞMA SAATLERİMİZ</h3>
          <div class="working-hours">
            Haftanın 6 günü, bayram ve resmi tatiller hariç her gün çalışıyoruz. Acil bir durumda bizimle iletişime geçiniz.
            <br><br> Pazatesi - Cuma: <span class="text-right">08:00 - 19:00 </span>
            <br> Cumartesi: <span class="text-right">10:00 - 15:00</span>
          </div>
        </div><!-- Col end -->

        <div class="col-lg-3 col-md-6 mt-5 mt-lg-0 footer-widget">
          <h3 class="widget-title">HİZMETLERİMİZ</h3>
          <ul class="list-arrow">
            <li><a href="404.html">Aile Hukuku</a></li>
            <li><a href="404.html">Ceza Hukuku</a></li>
            <li><a href="404.html">İcra ve İflas Hukuku</a></li>
            <li><a href="404.html">İş Hukuku</a></li>
            <li><a href="404.html">Ticaret Hukuku</a></li>
          </ul>
        </div><!-- Col end -->
      </div><!-- Row end -->
    </div><!-- Container end -->
  </div><!-- Footer main end -->

  <div class="copyright">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="copyright-info">
            <span>Copyright &copy; <script>
                document.write(new Date().getFullYear())
              </script>, Ermiş & Demirer Hukuk Bürosu</a></span>
          </div>
        </div>

        <div class="col-md-6">
          <div class="footer-menu text-center text-md-right">
            <ul class="list-unstyled">
              <li><a href="about.html">Hakkımızda</a></li>
              <li><a href="services.html">Hizmetlerimiz</a></li>
              <!-- <li><a href="news.html">Yayınlar</a></li> -->
              <li><a href="contact.html">İletişim</a></li>
            </ul>
          </div>
        </div>
      </div><!-- Row end -->

      <div id="back-to-top" data-spy="affix" data-offset-top="10" class="back-to-top position-fixed">
        <button class="btn btn-primary" title="Back to Top">
          <i class="fa fa-angle-double-up"></i>
        </button>
      </div>

    </div><!-- Container end -->
  </div><!-- Copyright end -->
</footer>
  `
  }
}
customElements.define('my-footer', MyFooter)

//header
class MyHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML =
      `
    <header id="header" class="header-one">
      <div class="bg-white">
        <div class="container">
          <div class="logo-area">
            <div class="row align-items-center">
              <div class="logo col-lg-3 text-center text-lg-left mb-3 mb-md-5 mb-lg-0">
                <a class="d-block" href="index.html">
                  <img loading="lazy" src="images/logo.png" alt="Ermis&Demirer">
                </a>
              </div><!-- logo end -->

            <div class="col-lg-9 header-right">
              <ul class="top-info-box">
                <li>
                  <div class="info-box">
                    <div class="info-box-content">
                      <p class="info-box-title">Bizi Arayın</p>
                      <p class="info-box-subtitle">(0532) 410 21 12</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="info-box">
                    <div class="info-box-content">
                      <p class="info-box-title">Bizi Arayın</p>
                      <p class="info-box-subtitle">(0232) 502 39 08</p>
                    </div>
                  </div>
                </li>
                <li class="last">
                  <div class="info-box last">
                    <div class="info-box-content">
                      <p class="info-box-title">Mail Adresimiz</p>
                      <p class="info-box-subtitle">info@ermisdemirerhukuk.av.tr</p>
                    </div>
                  </div>
                </li>

              </ul><!-- Ul end -->
            </div><!-- header right end -->
          </div><!-- logo area end -->
        </div><!-- Row end -->
      </div><!-- Container end -->
    </div>

    <div class="site-navigation">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <nav class="navbar navbar-expand-lg navbar-dark p-0">
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbar-collapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

              <div id="navbar-collapse" class="collapse navbar-collapse">
                <ul class="nav navbar-nav mr-auto">
                  <li class="nav-item"><a class="nav-link" href="index.html">Anasayfa</a></li>

                  <li class="nav-item dropdown">
                    <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">Hakkımızda <i class="fa fa-angle-down"></i></a>
                    <ul class="dropdown-menu" role="menu">
                      <li><a href="about.html">BİZ KİMİZ</a></li>
                    </ul>
                  </li>

                  <li class="nav-item"><a class="nav-link" href="services.html">HİZMETLERİMİZ</a></li>

                  <li class="nav-item dropdown">
                    <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">YAYINLAR <i class="fa fa-angle-down"></i></a>
                    <ul class="dropdown-menu" role="menu">
                      <li><a href="news.html">TÜMÜ</a></li>
                      <li><a href="aile-hukuku.html">AİLE HUKUKU</a></li>
                      <li><a href="news-single.html">CEZA HUKUKU</a></li>
                      <li><a href="news-single.html">İCRA VE İFLAS HUKUKU</a></li>
                      <li><a href="news-single.html">İŞ HUKUKU</a></li>
                      <li><a href="news-single.html">TİCARET HUKUKU</a></li>
                      <li><a href="news-single.html">KİRA HUKUKU</a></li>
                    </ul>
                  </li>

                  <li class="nav-item"><a class="nav-link" href="contact.html">İLETİŞİM</a></li>
                </ul>
              </div>
            </nav>
          </div>
          <!--/ Col end -->
        </div>
        <!--/ Row end -->
      </div>
      <!--/ Container end -->

    </div>
    <!--/ Navigation end -->
  </header>
  <!--/ Header end -->
    `
  }
}

customElements.define('my-header', MyHeader)

//top-bar
class TopBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML =
      `
    <div id="top-bar" class="top-bar">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-8">
            <ul class="top-info text-center text-md-left">
              <li><i class="fas fa-map-marker-alt"></i>
                <p class="info-text">Lider Centrio B Blok, Bayraklı</p>
              </li>
            </ul>
          </div>
        <!--/ Top info end -->

        <div class="col-lg-4 col-md-4 top-social text-center text-md-right">
          <ul class="list-unstyled">
            <li>
              <a title="Whatsapp" href="https://wa.me/905324102112">
                <span class="social-icon"><i class="fab fa-whatsapp"></i></span>
              </a>
              <!-- <a title="Telegram" href="https://telegram.com/themefisher.com">
                <span class="social-icon"><i class="fab fa-telegram"></i></span>
            </a> -->
              <a title="Instagram" href="https://www.instagram.com/ermisdemirerhukukburosu/">
                <span class="social-icon"><i class="fab fa-instagram"></i></span>
              </a>
              <!-- <a title="Linkedin" href="https://www.linkedin.com/in/necat-ermi%C5%9F-305807109">
                  <span class="social-icon"><i class="fab fa-linkedin"></i></span>
              </a> -->
            </li>
          </ul>
        </div>
        <!--/ Top social end -->
      </div>
      <!--/ Content row end -->
    </div>
    <!--/ Container end -->
  </div>
    `
  }
}

customElements.define('top-bar', TopBar)
