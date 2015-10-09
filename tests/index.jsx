
/**
 * Created by Volodymyr on 10/8/2015.
 */

+function ($) {

  $(function () {
    $('.video-player')
      .on('ended', x => $(this).parent().css('background', 'red'))
      .on('paused', x => $(this).parent().css('background', 'yellow'))
      .on('playing', x => $(this).parent().css('background', 'green'))
      .youtube_player();
  })

}(jQuery);
