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
          currentVideoId = videoId,
          currentVolume = null;

        $videoPlayer.toggleClass('mobile', isMobile);
        $videoCnt.attr('id', videoPlayer_id);

        queuePlayerInit(() => {
          new YT.Player(videoPlayer_id, {
            videoId: currentVideoId,
            playerVars: {
              autoplay: 0,
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
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
        });

        function onPlayerStateChange(newState) {
          switch (newState.data) {
            //ended
            case 0:
              stop(true);
              break;

            //playing
            case 1:
              onPlayStart();
              break;

            //paused
            case 2:
              pause(true);
              break;
          }
        }

        function onPlayerReady(event) {
          player = event.target;

          if (currentVolume !== null)
            player.setVolume(currentVolume);

          $videoCnt = $('#' + videoPlayer_id).hide().addClass('initialized');
          $level.width(player.getVolume() + '%');

          updateProgressBarAndTimer();

          if ($videoPlayer.hasClass('starting'))
            setTimeout(x => play(), 1);

          $videoPlayer.removeClass('starting').trigger('initialized');

          if (isMobile) {
            $videoCnt.show();
            $videoPlayer.addClass('playing');
          }
        }

        function updateProgressBarAndTimer() {
          $timer.html('<strong>' + toTime(player.getCurrentTime()) + '</strong> / ' + toTime(player.getDuration()));
          $elapsed.width(100 * player.getCurrentTime() / player.getDuration() + '%');
        }

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
          var isAbsolute = $videoCnt.hasClass('absolute'),
            playerWidth = Math.ceil($videoPlayer.width()),
            pageHeight = Math.ceil($body.height()) - (options ? options.offsetTop | 0 : 0),
            videoWidth = playerWidth,
            videoHeight = Math.ceil(9 * videoWidth / 16);

          if (isAbsolute && videoHeight < pageHeight)
            videoHeight = pageHeight;

          videoHeight = Math.min(videoHeight, pageHeight);
          videoWidth = Math.ceil(16 * videoHeight / 9);

          if (!$videoPlayer.hasClass('fixed-height'))
            $videoPlayer.css('height', videoHeight + 'px');

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

          player || $videoPlayer.addClass('starting');

          setTimeout(() => player && player.playVideo(), isAbsolute ? 150 : 600);
        }

        function onPlayStart() {
          $videoCnt.show();
          $videoPlayer.addClass('playing');
          onWindowResize();

          setTimeout(() => $videoPlayer.trigger('playing'), 1);

          interval = setInterval(updateProgressBarAndTimer, 1000);
        }

        function pause(isEvent_) {
          isMobile || $videoPlayer.removeClass('playing');
          $wnd.off('resize.' + videoPlayer_id);
          $videoPlayer.css('height', initialHeight || '');
          clearInterval(interval);
          isEvent_ || player && player.pauseVideo();

          setTimeout(() => $videoPlayer.trigger('paused'), 1);
        }

        function stop(isEvent_) {
          isEvent_ && pause(isEvent_);

          isMobile || $videoPlayer.removeClass('playing');

          $videoCnt.hide();
          $elapsed.width(0);
          isEvent_ || player && player.stopVideo();

          setTimeout(() => $videoPlayer.trigger('ended'), 34);
        }

        function volume(x_) {
          if (x_ !== undefined) {
            currentVolume = Math.max(0, Math.min(100, x_ | 0));
            player && player.setVolume(currentVolume);
          }

          return player ? player.getVolume() : undefined;
        }

        $videoPlayer.data('youtube-player', {
          play: play,
          pause: pause,
          stop: stop,
          volume: volume
        });
      });

      return this;
    }
  });

}(jQuery);
