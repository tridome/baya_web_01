/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article'),
		$music = $('#background-music');

	// Video Overlay.
	var $videoOverlay = $('#video-overlay'),
		$introVideo = $('#intro-video'),
		$videoTitle = $('#video-title'),
		$toggleVideo = $('#toggle-video'),
		$restartVideo = $('#restart-video'),
		$skipVideo = $('#skip-video'),
		$videoProgress = $('#video-progress'),
		$videoTime = $('#video-time');

	// Function to hide video overlay and show content.
	function hideVideoOverlay() {
		console.log('Hiding video overlay');
		$videoOverlay.addClass('hidden');
		$wrapper.addClass('visible');
		if ($music.length) {
			$music[0].muted = false;
			$music[0].play().catch(function(error) {
				console.log('Music play failed:', error);
			});
		}
	}

	// Function to show and reset video overlay.
	function showVideoOverlay() {
		console.log('Showing video overlay, hash:', location.hash);
		if ($videoOverlay.hasClass('hidden')) {
			$videoOverlay.removeClass('hidden');
			$wrapper.removeClass('visible');
			$introVideo[0].currentTime = 0;
			$introVideo[0].pause();
			$toggleVideo.text('Play');
			$videoTitle.removeClass('hidden');
			$videoProgress.val(0);
			updateTimeDisplay(0, $introVideo[0].duration || 0);
		}
	}

	// Update progress bar and time display.
	function updateProgress() {
		if ($introVideo[0].duration) {
			var percent = ($introVideo[0].currentTime / $introVideo[0].duration) * 100;
			$videoProgress.val(percent);
			updateTimeDisplay($introVideo[0].currentTime, $introVideo[0].duration);
		}
	}

	// Format time as MM:SS.
	function formatTime(seconds) {
		var minutes = Math.floor(seconds / 60);
		var secs = Math.floor(seconds % 60);
		return minutes + ':' + (secs < 10 ? '0' : '') + secs;
	}

	// Update time display.
	function updateTimeDisplay(currentTime, duration) {
		$videoTime.text(formatTime(currentTime) + ' / ' + formatTime(duration));
	}

	// Video setup.
	if ($videoOverlay.length && $introVideo.length && $videoTitle.length && $toggleVideo.length && $restartVideo.length && $skipVideo.length && $videoProgress.length && $videoTime.length) {
		$videoTitle.on('click', function() {
			$introVideo[0].play().catch(function(error) {
				console.log('Video play failed:', error);
			});
			$videoTitle.addClass('hidden');
		});

		$toggleVideo.on('click', function() {
			if ($introVideo[0].paused) {
				$introVideo[0].play().catch(function(error) {
					console.log('Video play failed:', error);
				});
				$toggleVideo.text('Pause');
				$videoTitle.addClass('hidden');
			} else {
				$introVideo[0].pause();
				$toggleVideo.text('Play');
			}
		});

		$restartVideo.on('click', function() {
			$introVideo[0].currentTime = 0;
			$introVideo[0].pause();
			$toggleVideo.text('Play');
			$videoTitle.removeClass('hidden');
			$videoProgress.val(0);
			updateTimeDisplay(0, $introVideo[0].duration || 0);
		});

		$introVideo.on('timeupdate', updateProgress);

		$videoProgress.on('click', function(e) {
			var pos = (e.pageX - $(this).offset().left) / $(this).width();
			$introVideo[0].currentTime = pos * $introVideo[0].duration;
			updateProgress();
		});

		$introVideo.on('ended', function() {
			hideVideoOverlay();
		});

		$skipVideo.on('click', function() {
			$introVideo[0].pause();
			hideVideoOverlay();
		});

		$window.on('hashchange', function(event) {
			console.log('Hash changed to:', location.hash);
			if (location.hash === '#play-video') {
				event.preventDefault();
				event.stopPropagation();
				showVideoOverlay();
			} else if (location.hash === '' || location.hash === '#') {
				event.preventDefault();
				event.stopPropagation();
				$main._hide();
			} else if ($main_articles.filter(location.hash).length > 0) {
				event.preventDefault();
				event.stopPropagation();
				$main._show(location.hash.substr(1));
			}
		});

		$(document).ready(function() {
			console.log('Document ready, initial hash:', location.hash);
			if (location.hash === '#play-video') {
				showVideoOverlay();
			}
			// Direct click handler for Intro link
			$('a[href="#play-video"]').on('click', function(e) {
				e.preventDefault();
				showVideoOverlay();
				location.hash = '#play-video';
			});
		});
	} else {
		console.error('Video overlay elements not found:', {
			videoOverlay: $videoOverlay.length,
			introVideo: $introVideo.length,
			videoTitle: $videoTitle.length,
			toggleVideo: $toggleVideo.length,
			restartVideo: $restartVideo.length,
			skipVideo: $skipVideo.length,
			videoProgress: $videoProgress.length,
			videoTime: $videoTime.length
		});
		$wrapper.addClass('visible');
	}

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Fix: Flexbox min-height bug on IE.
	if (browser.name == 'ie') {
		var flexboxFixTimeoutId;
		$window.on('resize.flexbox-fix', function() {
			clearTimeout(flexboxFixTimeoutId);
			flexboxFixTimeoutId = setTimeout(function() {
				if ($wrapper.prop('scrollHeight') > $window.height())
					$wrapper.css('height', 'auto');
				else
					$wrapper.css('height', '100vh');
			}, 250);
		}).triggerHandler('resize.flexbox-fix');
	}

	// the other buttons
document.addEventListener('DOMContentLoaded', () => {
    const flowcharts = document.querySelectorAll('.flowchart');
    flowcharts.forEach(flowchart => {
        const header = flowchart.querySelector('.flowchart-header');
        header.addEventListener('click', () => {
            flowchart.classList.toggle('visible');
        });
    });
});
	
	// Nav.
	var $nav = $header.children('nav'),
		$nav_li = $nav.find('li');

	// Add "middle" alignment classes if we're dealing with an even number of items.
	if ($nav_li.length % 2 == 0) {
		$nav.addClass('use-middle');
		$nav_li.eq(($nav_li.length / 2)).addClass('is-middle');
	}

	// Dropdown functionality for mobile (using vanilla JavaScript).
	$(document).ready(function() {
		console.log('Initializing dropdown logic');
		const nav = document.querySelector('#header nav');
		if (!nav) {
			console.error('Navigation element not found: #header nav');
			return;
		}

		// Define breakpoints matching CSS
		const mobileBreakpoint = window.matchMedia('(max-width: 736px)'); // Toggle vs. hover
		const layoutBreakpoint = window.matchMedia('(max-width: 480px)'); // Vertical vs. horizontal
		let isMobile = mobileBreakpoint.matches;
		let isVertical = layoutBreakpoint.matches;

		// Update state on resize
		const updateState = () => {
			const wasMobile = isMobile;
			const wasVertical = isVertical;
			isMobile = mobileBreakpoint.matches;
			isVertical = layoutBreakpoint.matches;

			console.log('isMobile:', isMobile, 'isVertical:', isVertical, 'Window width:', window.innerWidth);

			// Clear dropdowns on layout or mode transition
			if (wasMobile !== isMobile || wasVertical !== isVertical) {
				document.querySelectorAll('.dropdown-menu').forEach(menu => {
					menu.style.display = 'none';
					console.log('Cleared dropdown display for:', menu);
				});
			}
		};

		mobileBreakpoint.addEventListener('change', updateState);
		layoutBreakpoint.addEventListener('change', updateState);
		updateState(); // Initial check

		// Event delegation for dropdown toggle, only for .dropdown
		nav.addEventListener('click', (e) => {
			const dropdown = e.target.closest('.dropdown');
			if (!dropdown) {
				return; // Ignore clicks outside .dropdown
			}
			console.log('Click event on:', e.target);
			const link = e.target.closest('.dropdown > a');
			if (!link) {
				console.warn('No dropdown link found for click event');
				return;
			}
			if (!isMobile) {
				console.log('Skipping toggle - Not in mobile mode, window width:', window.innerWidth);
				return; // Skip if not mobile
			}

			e.preventDefault();
			const menu = dropdown.querySelector('.dropdown-menu');
			if (!menu) {
				console.warn('Dropdown menu not found for:', dropdown);
				return;
			}

			console.log('Toggling dropdown menu, current display:', menu.style.display);
			menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
			console.log('New display state:', menu.style.display);

			// Close other open dropdowns
			document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
				if (otherMenu !== menu && otherMenu.style.display === 'block') {
					otherMenu.style.display = 'none';
					console.log('Closed other dropdown:', otherMenu);
				}
			});
		});

		// Close dropdowns when clicking outside
		document.addEventListener('click', (e) => {
			if (!isMobile) return; // Skip if not mobile
			const dropdown = e.target.closest('.dropdown');
			if (!dropdown) {
				console.log('Clicked outside dropdown, closing all, window width:', window.innerWidth);
				document.querySelectorAll('.dropdown-menu').forEach(menu => {
					menu.style.display = 'none';
				});
			}
		});
	});

	// Main.
	var delay = 325,
		locked = false;

	$main._show = function(id, initial) {
		var $article = $main_articles.filter('#' + id);
		if ($article.length == 0) return;
		if (locked || (typeof initial != 'undefined' && initial === true)) {
			$body.addClass('is-switching');
			$body.addClass('is-article-visible');
			$main_articles.removeClass('active');
			$header.hide();
			$footer.hide();
			$main.show();
			$article.show();
			$article.addClass('active');
			locked = false;
			setTimeout(function() {
				$body.removeClass('is-switching');
			}, (initial ? 1000 : 0));
			return;
		}
		locked = true;
		if ($body.hasClass('is-article-visible')) {
			var $currentArticle = $main_articles.filter('.active');
			$currentArticle.removeClass('active');
			setTimeout(function() {
				$currentArticle.hide();
				$article.show();
				setTimeout(function() {
					$article.addClass('active');
					$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
					setTimeout(function() {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		} else {
			$body.addClass('is-article-visible');
			setTimeout(function() {
				$header.hide();
				$footer.hide();
				$main.show();
				$article.show();
				setTimeout(function() {
					$article.addClass('active');
					$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
					setTimeout(function() {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		}
	};

	$main._hide = function(addState) {
		var $article = $main_articles.filter('.active');
		if (!$body.hasClass('is-article-visible')) return;
		if (typeof addState != 'undefined' && addState === true)
			history.pushState(null, null, '#');
		if (locked) {
			$body.addClass('is-switching');
			$article.removeClass('active');
			$article.hide();
			$main.hide();
			$footer.show();
			$header.show();
			$body.removeClass('is-article-visible');
			locked = false;
			$body.removeClass('is-switching');
			$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
			return;
		}
		locked = true;
		$article.removeClass('active');
		setTimeout(function() {
			$article.hide();
			$main.hide();
			$footer.show();
			$header.show();
			setTimeout(function() {
				$body.removeClass('is-article-visible');
				$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
				setTimeout(function() {
					locked = false;
				}, delay);
			}, 25);
		}, delay);
	};

	// Articles.
	$main_articles.each(function() {
		var $this = $(this);
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on('click', function() {
				location.hash = '';
			});
		$this.on('click', function(event) {
			event.stopPropagation();
		});
	});

	// Events.
	$body.on('click', function(event) {
		if ($body.hasClass('is-article-visible'))
			$main._hide(true);
	});

	$window.on('keyup', function(event) {
		if (event.keyCode === 27 && $body.hasClass('is-article-visible'))
			$main._hide(true);
	});

	$window.on('hashchange', function(event) {
		if (location.hash === '' || location.hash === '#') {
			event.preventDefault();
			event.stopPropagation();
			$main._hide();
		} else if (location.hash === '#play-video') {
			event.preventDefault();
			event.stopPropagation();
			showVideoOverlay();
		} else if ($main_articles.filter(location.hash).length > 0) {
			event.preventDefault();
			event.stopPropagation();
			$main._show(location.hash.substr(1));
		}
	});

	// Scroll restoration.
	if ('scrollRestoration' in history)
		history.scrollRestoration = 'manual';
	else {
		var oldScrollPos = 0,
			scrollPos = 0,
			$htmlbody = $('html,body');
		$window.on('scroll', function() {
			oldScrollPos = scrollPos;
			scrollPos = $htmlbody.scrollTop();
		}).on('hashchange', function() {
			$window.scrollTop(oldScrollPos);
		});
	}

	// Initialize.
	$main.hide();
	$main_articles.hide();
	$(document).ready(function() {
		if (location.hash === '#play-video') {
			showVideoOverlay();
		} else if (location.hash !== '' && location.hash !== '#') {
			$main._show(location.hash.substr(1), true);
		}
	});

	// Music Toggle.
	if ($music.length) {
		$music.prop('volume', 0.5);
		$window.on('load', function() {
			$music[0].muted = true;
			$music[0].play().catch(function(error) {
				console.log('Autoplay blocked:', error);
			});
		});
		var $toggle = $('#music-toggle');
		if ($toggle.length) {
			$toggle.on('click', function() {
				if ($music[0].paused) {
					$music[0].muted = false;
					$music[0].play().catch(function(error) {
						console.log('Play failed:', error);
					});
					$toggle.removeClass('paused');
				} else {
					$music[0].pause();
					$toggle.addClass('paused');
				}
			});
		} else {
			console.error('Toggle element not found:', { toggle: $toggle.length });
		}
	} else {
		console.error('Music element not found:', { music: $music.length });
	}

})(jQuery);