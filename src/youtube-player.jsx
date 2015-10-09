'use strict';

/**
 * Created by Volodymyr on 10/8/2015.
 */

+function ($) {
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  function toTime(x) {
    x = Math.floor(x);

    var m = Math.floor(x / 60),
      s = x % 60;

    function xx(x) { return (x > 9 ? '' : '0') + x.toString(10); }

    return xx(m) + ':' + xx(s);
  }

  var onYouTubeIframeAPIReadyQueue = [];
  window.onYouTubeIframeAPIReady = function () {
    while (onYouTubeIframeAPIReadyQueue.length) {
      setTimeout(onYouTubeIframeAPIReadyQueue.shift(), 1);
    }
  };

  function queuePlayerInit(cb) {
    if (window.YT && window.YT.Player) setTimeout(cb, 1);

    onYouTubeIframeAPIReadyQueue.push(cb);
  }

  if (window.YT && window.YT.Player) window.onYouTubeIframeAPIReady();

  $.fn.extend({
    youtube_player: function (options) {
      this.each(function () {
        console.info(this);

        var $wnd = $(window),
          $body = $('body'),
          $videoPlayer = $(this),
          $progress = $videoPlayer.find('.progress-bar'),
          $elapsed = $progress.find('.elapsed'),
          $volume = $videoPlayer.find('.sound-bar'),
          $level = $volume.find('.level'),
          $timer = $videoPlayer.find('.timer'),
          $playPause = $videoPlayer.find('.play-pause'),
          $videoCnt = $videoPlayer.find('.video-cnt').hide(),

          videoPlayer_id = $videoCnt.attr('id') || ('yt-' + Math.random().toString(36).substr(2)),
          videoId = $videoPlayer.attr('video-id'),
          initialHeight = $videoPlayer.height();

        var interval = null,
          player = null,
          currentVideoId = videoId;

        $videoPlayer.toggleClass('mobile', isMobile);
        $videoCnt.attr('id', videoPlayer_id);

        queuePlayerInit(function () {
          player = new YT.Player(videoPlayer_id, {
            videoId: currentVideoId,
            playerVars: {
              autoplay: $videoPlayer.hasClass('playing') ? 1 : 0,
              controls: 0,
              //hl: 'uk-ua',
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
              showinfo: 0,
              color: 'white',
              iv_load_policy: 3,
              theme: 'light'
            },
            events: {
              'onReady': function (event) {
                player = event.target;
                $videoCnt = $('#' + videoPlayer_id).hide().addClass('initialized');
                $level.width(player.getVolume() + '%');

                player.setSize($videoPlayer.width(), $videoPlayer.height());

                if (isMobile) {
                  $videoCnt.show();
                  $videoPlayer.addClass('playing');
                }
              },
              'onStateChange': function (newState) {
                switch (newState.data) {
                  case 0: //ended
                    stop(true);
                    $videoPlayer.trigger('ended');
                    break;

                  case 2: //paused
                    pause(true);
                    $videoPlayer.trigger('paused');
                    break;

                  case 1: //playing
                    $videoCnt.show();
                    $videoPlayer.addClass('playing').trigger('playing');
                    interval = setInterval(function () {
                      $timer.show().html('<strong>' + toTime(player.getCurrentTime()) + '</strong> / ' + toTime(player.getDuration()));
                      $elapsed.width(100 * player.getCurrentTime() / player.getDuration() + '%');
                    }, 1000);
                    break;
                }
              }
            }
          });
        });

        $progress.click(function (e) {
          var ratio = (e.pageX - $progress.offset().left) / $progress.outerWidth();
          $elapsed.addClass('quick-animation').width(ratio * 100 + '%');
          player && player.seekTo(Math.round(player.getDuration() * ratio), true);

          setTimeout(function () {
            $elapsed.removeClass('quick-animation');
          }, 100);
          return false;
        });

        $volume.click(function (e) {
          var ratio = (e.pageX - $volume.offset().left) / $volume.outerWidth() * 100;
          ratio = Math.max(0, Math.min(100, ratio));
          player && player.setVolume(ratio);
          $level.width(ratio + '%');
        });

        $playPause.click(function () {
          $videoPlayer.hasClass('playing') ? pause() : play();
          return false;
        });

        function onWindowResize() {
          var navBarHeight = $('.navbar').height(),
            bodyHeight = Math.ceil($body.height()),
            pageHeight = bodyHeight - navBarHeight,
            videoWidth = Math.ceil($videoPlayer.width()),
            videoHeight = Math.ceil(9 * videoWidth / 16),
            isAbsolute = $videoCnt.hasClass('absolute');

          if (isAbsolute && videoHeight < pageHeight) {
            videoHeight = pageHeight;
            videoWidth = Math.ceil(16 * pageHeight / 9);
          }

          if (!$videoPlayer.hasClass('fixed-height'))
            $videoPlayer.css('height', Math.min(videoHeight, pageHeight) + 'px');

          player && player.setSize(videoWidth, videoHeight);

          return isAbsolute;
        }

        function play() {
          $wnd.on('resize.' + videoPlayer_id, onWindowResize);
          var isAbsolute = onWindowResize();

          if (currentVideoId != videoId) {
            player && player.loadVideoById(videoId, 0, 'large');
            currentVideoId = videoId;
          }

          setTimeout(function () {
            player && player.playVideo();
          }, isAbsolute ? 150 : 1000);
        }

        function pause(isEvent_) {
          if (!isMobile) {
            $videoPlayer.removeClass('playing');
          }
          $wnd.off('resize.' + videoPlayer_id);
          $videoPlayer.css('height', initialHeight || '');
          clearInterval(interval);
          isEvent_ || player && player.pauseVideo();
        }

        function stop(isEvent_) {
          pause(isEvent_);
          $videoCnt.hide();
          $elapsed.width(0);
          isEvent_ || player && player.stopVideo();
        }

        return {
          play: play,
          pause: pause,
          stop: stop
        }
      });
    }
  });

}(jQuery);
