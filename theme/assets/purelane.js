(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealObserver = null;
  var heroRegistry = Object.create(null);
  var sceneRaf = null;
  var mx = 0;
  var my = 0;

  function qsa(root, sel) {
    return [].slice.call((root || document).querySelectorAll(sel));
  }

  function initReveal(root) {
    var nodes = qsa(root || document, '.purelane .rv:not(.in)');
    if (!nodes.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    }

    nodes.forEach(function (el) { revealObserver.observe(el); });
  }

  function destroyHero(sectionId) {
    var entry = heroRegistry[sectionId];
    if (!entry) return;
    if (entry.timer) clearInterval(entry.timer);
    if (entry.io) entry.io.disconnect();
    entry.cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
    delete heroRegistry[sectionId];
  }

  function initHero(root) {
    var stages = qsa(root || document, '[data-purelane-hero]');
    stages.forEach(function (wrap) {
      var sectionId = wrap.getAttribute('data-section-id') || wrap.id || String(Math.random());
      destroyHero(sectionId);

      var hstage = wrap.querySelector('[data-purelane-hstage]') || wrap.querySelector('.hstage');
      if (!hstage) return;

      var slides = qsa(hstage, '.hslide');
      var dotsWrap = wrap.querySelector('[data-purelane-hdots]') || wrap.querySelector('.hdots');
      var dots = dotsWrap ? qsa(dotsWrap, 'button') : [];
      if (!slides.length) return;

      var index = 0;
      var timer = null;
      var cleanups = [];

      function go(n) {
        index = (n + slides.length) % slides.length;
        slides.forEach(function (s, i) { s.classList.toggle('on', i === index); });
        dots.forEach(function (d, i) { d.classList.toggle('on', i === index); });
      }

      function play() {
        if (timer || reduce || slides.length < 2) return;
        timer = setInterval(function () { go(index + 1); }, 3800);
        if (heroRegistry[sectionId]) heroRegistry[sectionId].timer = timer;
      }

      function stop() {
        if (timer) {
          clearInterval(timer);
          timer = null;
          if (heroRegistry[sectionId]) heroRegistry[sectionId].timer = null;
        }
      }

      dots.forEach(function (dot, i) {
        var onClick = function () {
          stop();
          go(i);
          play();
        };
        dot.addEventListener('click', onClick);
        cleanups.push(function () { dot.removeEventListener('click', onClick); });
      });

      var onEnter = function () { stop(); };
      var onLeave = function () { play(); };
      hstage.addEventListener('mouseenter', onEnter);
      hstage.addEventListener('mouseleave', onLeave);
      cleanups.push(function () {
        hstage.removeEventListener('mouseenter', onEnter);
        hstage.removeEventListener('mouseleave', onLeave);
      });

      var io = null;
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) play();
            else stop();
          });
        }, { threshold: 0.2 });
        io.observe(hstage);
      } else {
        play();
      }

      heroRegistry[sectionId] = { timer: timer, io: io, cleanups: cleanups };
    });
  }

  function setScene(stage, n) {
    if (!stage) return;
    var current = parseInt(stage.getAttribute('data-d'), 10) || 1;
    if (n === current) return;
    stage.setAttribute('data-d', String(n));
    qsa(stage, '.scene').forEach(function (s, i) {
      s.classList.toggle('on', i + 1 === n);
    });
  }

  function pickScene() {
    var stage = document.querySelector('[data-purelane-scenes]');
    if (!stage) return;
    var zones = qsa(document, '.purelane [data-scene]');
    var focus = window.scrollY + window.innerHeight * 0.5;
    var n = 1;
    zones.forEach(function (z) {
      var top = 0;
      var el = z;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      var scene = parseInt(z.getAttribute('data-scene'), 10);
      if (scene && top <= focus) n = scene;
    });
    setScene(stage, n);
  }

  var isNavigating = false;
  var navTimer = null;

  function syncRail() {
    if (isNavigating) return;
    var railLinks = qsa(document, '.rail a');
    if (!railLinks.length) return;

    var viewH = window.innerHeight || 800;
    var focusY = viewH * 0.35;
    var activeIdx = 0;

    for (var i = 0; i < railLinks.length; i++) {
      var a = railLinks[i];
      var href = a.getAttribute('href');
      var target = (!href || href === '#' || href === '#top') ? (document.querySelector('#top') || document.querySelector('.hero')) : document.querySelector(href);
      if (target) {
        var rect = target.getBoundingClientRect();
        if (rect.top <= focusY && rect.bottom > focusY) {
          activeIdx = i;
          break;
        } else if (rect.top <= focusY) {
          activeIdx = i;
        }
      }
    }

    railLinks.forEach(function (a, i) {
      a.classList.toggle('on', i === activeIdx);
    });
  }

  function frame() {
    sceneRaf = null;
    var y = window.scrollY || window.pageYOffset;
    var hdr = document.getElementById('hdr');
    if (hdr) hdr.classList.toggle('up', y > 90);

    pickScene();
    syncRail();

    if (reduce) return;

    var waterLayers = qsa(document, '[data-purelane-water] .wl');
    waterLayers.forEach(function (wl, i) {
      var d = [0.05, 0.09, 0.03, 0.02][i] || 0.05;
      wl.style.setProperty('--px', (mx * d * 130).toFixed(1) + 'px');
      wl.style.setProperty('--py', (-y * d + my * d * 90).toFixed(1) + 'px');
    });

    var prods = qsa(document, '[data-purelane-hero]');
    prods.forEach(function (prod) {
      var f = Math.min(y / 700, 1);
      prod.style.transform =
        'translate3d(' +
        (mx * -16).toFixed(2) +
        'px,' +
        (-f * 54 + my * -10).toFixed(2) +
        'px,0) scale(' +
        (1 - f * 0.06).toFixed(3) +
        ')';
      prod.style.opacity = String(Math.max(0.45, 1 - f * 0.55));
    });
  }

  function onScroll() {
    if (!sceneRaf) sceneRaf = requestAnimationFrame(frame);
  }

  function syncScenes(root) {
    var scenes = qsa(root || document, '[data-purelane-scenes]');
    scenes.forEach(function (el) {
      el.setAttribute('data-d', '1');
      var s1 = el.querySelector('.scene.s1');
      if (s1) s1.classList.add('on');
    });
  }

  function initRotator(root) {
    var rotators = qsa(root || document, '#rot, .rot');
    rotators.forEach(function (rot) {
      var rimgs = qsa(rot, '.frame .pimg');
      var rdots = qsa(rot, '.dots i');
      var rcapB = rot.querySelector('.cap b');
      var rcapS = rot.querySelector('.cap span');
      if (!rimgs.length) return;
      var ri = 0, rtimer = null;
      function rstep() {
        rimgs[ri].classList.remove('on');
        if (rdots[ri]) rdots[ri].classList.remove('on');
        ri = (ri + 1) % rimgs.length;
        rimgs[ri].classList.add('on');
        if (rdots[ri]) rdots[ri].classList.add('on');
        if (rcapB) rcapB.innerHTML = rimgs[ri].getAttribute('data-name') || '';
        if (rcapS) rcapS.textContent = rimgs[ri].getAttribute('data-note') || '';
      }
      if (!reduce && 'IntersectionObserver' in window) {
        var rio = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting && !rtimer) rtimer = setInterval(rstep, 2900);
            else if (!e.isIntersecting && rtimer) { clearInterval(rtimer); rtimer = null; }
          });
        }, { threshold: 0.25 });
        rio.observe(rot);
      }
    });
  }

  function initRail() {
    var railLinks = qsa(document, '.rail a');
    railLinks.forEach(function (a, idx) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          var target = href === '#top' ? (document.querySelector('#top') || document.querySelector('.hero') || document.body) : document.querySelector(href);
          if (target) {
            e.preventDefault();
            isNavigating = true;
            railLinks.forEach(function (link, i) {
              link.classList.toggle('on', i === idx);
            });
            target.scrollIntoView({ behavior: 'smooth' });
            if (navTimer) clearTimeout(navTimer);
            navTimer = setTimeout(function () {
              isNavigating = false;
              syncRail();
            }, 850);
          }
        }
      });
    });
  }

  function init(root) {
    syncScenes(root);
    initReveal(root);
    initHero(root);
    initRotator(root);
    initRail();
    onScroll();
  }

  function onSectionLoad(event) {
    var section = event && event.target;
    if (!section) return;
    init(section);
  }

  function onSectionUnload(event) {
    var section = event && event.target;
    if (!section) return;
    var hero = section.querySelector('[data-purelane-hero]');
    if (hero) {
      var id = hero.getAttribute('data-section-id');
      if (id) destroyHero(id);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  if (!reduce && window.matchMedia('(min-width: 1024px)').matches) {
    window.addEventListener(
      'mousemove',
      function (e) {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        onScroll();
      },
      { passive: true }
    );
  }

  document.addEventListener('shopify:section:load', onSectionLoad);
  document.addEventListener('shopify:section:unload', onSectionUnload);
  document.addEventListener('shopify:section:reorder', function () { init(document); });
})();
