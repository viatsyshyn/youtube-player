# Youtube Player

Youtube Player with customizable UI

## Installation

Please replace x.x.x with latest tag

> bower install https://github.com/viatsyshyn/youtube-player/releases/download/x.x.x/youtube-player.zip

## Example usage

Please link folowing css and scripts

```html
<link href="bower_components/youtube-player/dist/index.css" type="text/css" rel="stylesheet">
<script src="//www.youtube.com/iframe_api"></script>
<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/youtube-player/dist/youtube-player-compiled.js"></script>
```

This package expects following html to be used as a base for your player

```html
<div style="background-image: url(https://i.ytimg.com/vi/z9mq0zGNydY/maxresdefault.jpg)" video-id="z9mq0zGNydY" class="video-player">
  <div class="video-cnt"></div>
</div>
```

Also you may add sound bar (.mute and .full are optional)

```html
<div class="sound-bar">
  <div class="level"></div>
  <div class="mute"></div>
  <div class="full"></div>
</div>
```

Timer

```html
<div class="timer"></div>
```

Play/Pause button

```html
<div class="play-pause"></div>
```

And progress bar

```html
<div class="progress-bar">
  <div class="elapsed"></div>
</div>
```

To initialize your player do following

```javascript
jQuery('.video-player').youtube_player();
```

This package also emits following events

```javascript
jQuery('.video-player') 
  .on('ended', function (x) { // video has ended or stop method called
    return $(x.target).parent().css('background', 'red');
  }).on('paused', function (x) { // video is paused
    return $(x.target).parent().css('background', 'yellow');
  }).on('playing', function (x) { // video starts playing
    return $(x.target).parent().css('background', 'green');
  }).on('initialized', function (x) { // player is initialized
    return $(x.target).parent().css('background', 'skyblue');
  });
```

You can play/pause/stop video via js

```javascript
$('button.play-pause').click(function () {
  var $item3 = $('.item3');
  var player = $item3.data('youtube-player');
  $item3.hasClass('playing') ? player.pause() : player.play();
});
  
$('button.stop').click(function () {
  $('.item3').data('youtube-player').stop();
});
```
