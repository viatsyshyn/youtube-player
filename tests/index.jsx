
/**
 * Created by Volodymyr on 10/8/2015.
 */

+function ($) {

  $(function () {
    $('.video-player')
      .on('ended', x => $(x.target).parent().css('background', 'red'))
      .on('paused', x => $(x.target).parent().css('background', 'yellow'))
      .on('playing', x => $(x.target).parent().css('background', 'green'))
      .youtube_player();
  })

}(jQuery);
