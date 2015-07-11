var D2Slider = function(args) {
	var root = document.querySelector(args),
		slidesEl = root.querySelector('.slides'),
		autoEl = root.querySelector('.auto'),
		pagerEl = root.querySelector('.pager');

	var autoTimer,
		current = -1,
		reserved = -1,
		length = (function() {
		var slideEls = slidesEl.querySelectorAll('li');

		var i = 0;

		for (; i < slideEls.length; i++) {
			var item = slideEls[i];

			item.addEventListener('transitionend', function() {
				var id = parseInt(this.getAttribute('data-slide-id'));

				if (reserved < 0) return;

				// Whether transition target or not reserved
				if (id !== current) return;

				if (reserved < current) {
					moveToPrev();
				} else if (reserved > current) {
					moveToNext();
				} else {
					reserved = -1;
				}
			});

			item.setAttribute('data-slide-id', i);
			item.setAttribute('data-prev-id', i - 1 < 0 ? slideEls.length - 1 : i - 1);
			item.setAttribute('data-next-id', i + 1 > slideEls.length - 1 ? 0 : i + 1);

			var pageEl = createPage(i);

			pageEl.addEventListener('click', function (e) {
				reserved = parseInt(e.currentTarget.getAttribute('data-slide-id'));

				if (reserved < current) {
					moveToPrev();
				} else {
					moveToNext();
				}
			});

			pagerEl.appendChild(pageEl);
		}

		return i;
	})();

	function moveTo(id, direction) {
		var currentSlide;
		var prevSlide;
		var nextSlide;

		if (current > -1) {
			currentSlide = getSlide(current);
			prevSlide = getSlide(getSideSlideId(currentSlide, 0));
			nextSlide = getSlide(getSideSlideId(currentSlide, 1));

			removeClass(currentSlide, 'current');
			removeClass(prevSlide, 'hidden');
			removeClass(nextSlide, 'hidden');
			removeClass(prevSlide, 'prev');
			removeClass(nextSlide, 'next');
		}

		currentSlide = getSlide(id);
		prevSlide = getSlide(getSideSlideId(currentSlide, 0));
		nextSlide = getSlide(getSideSlideId(currentSlide, 1));

		if (!direction) {
			addClass(prevSlide, 'hidden');
		} else {
			addClass(nextSlide, 'hidden');
		}

		addClass(currentSlide, 'current');
		addClass(prevSlide, 'prev');
		addClass(nextSlide, 'next');

		current = id;

		changePage(current);
	}

	function moveToPrev() {
		moveTo(current - 1 < 0 ? length - 1 : current - 1, 0);
	}

	function moveToNext() {
		moveTo(current + 1 > length - 1 ? 0 : current + 1, 1);
	}

	function getSlide(id) {
		return slidesEl.querySelector('li[data-slide-id="' + id + '"');
	}

	function getSideSlideId(slide, direction) {
		return parseInt(slide.getAttribute('data-' + (!direction ? 'prev-id' : 'next-id')));
	}

	function changePage(id) {
		var currentPageEl = pagerEl.querySelector('.current');

		if (currentPageEl) {
			removeClass(currentPageEl, 'current');
		}

		var pageEl = pagerEl.querySelector('a[data-slide-id="' + id + '"]');

		addClass(pageEl, 'current');
	}

	function createPage(id) {
		var anchor = document.createElement('a');
		var span = document.createElement('span');

		anchor.setAttribute('data-slide-id', id);

		span.textContent = (id + 1);

		addClass(span, 'blind');

		anchor.appendChild(span);

		return anchor;
	}

	function autoPlay() {
		if (autoTimer == null) {
			autoTimer = setInterval(function() {moveToNext();}, 3000);
		} else {
			clearInterval(autoTimer);
		}
	}

	// Slide Into Previous Image
	root.querySelector('.navi.prev').addEventListener('click', moveToPrev);

	// Slide Into Next Image
	root.querySelector('.navi.next').addEventListener('click', moveToNext);

	autoEl.querySelector('.play').addEventListener('click', function() {
		autoPlay();

		this.style.display = 'none';
		autoEl.querySelector('.stop').style.display = 'inline-block';
	});

	autoEl.querySelector('.stop').addEventListener('click', function() {
		autoPlay();

		this.style.display = 'none';
		autoEl.querySelector('.play').style.display = 'inline-block';
	});

	function addClass(el, cls) {
		if (el.classList) {
			el.classList.add(cls);
		} else {
			el.className += ' ' + cls;
		}
	}

	function removeClass(el, cls) {
		if (el.classList) {
			el.classList.remove(cls);
		} else {
			el.className = el.className.replace(cls, '');
		}
	}

	moveTo(0);
};
