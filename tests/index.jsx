
/**
 * Created by Volodymyr on 10/8/2015.
 */

+function ($) {

  $(function () {
    $('.video-player')
      .on('ended', function () {
        $(this).parent().css('background', 'red');
      })
      .on('paused', function () {
        $(this).parent().css('background', 'yellow');
      })
      .on('playing', function () {
        $(this).parent().css('background', 'green');
      })
      .youtube_player();
  })

}(jQuery);
