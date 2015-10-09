
/**
 * Created by Volodymyr on 10/8/2015.
 */

+function ($) {

  $(function () {
    $('.video-player')
      .on('ended', x => $(x.target).parent().css('background', 'red'))
      .on('paused', x => $(x.target).parent().css('background', 'yellow'))
      .on('playing', x => $(x.target).parent().css('background', 'green'))
      .on('initialized', x => $(x.target).parent().css('background', 'skyblue'))
      .youtube_player();

    $('button.play-pause').click(function () {
      var $item3 = $('.item3');
      var player = $item3.data('youtube-player');
      $item3.hasClass('playing') ? player.pause() : player.play();
    });

    $('button.stop').click(function () {
      $('.item3').data('youtube-player').stop();
    })
  })

}(jQuery);
