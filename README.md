# aud-js
Vanilla JavaScript audio player
## Instructions
*Add the aud.css and aud.js files inside your <head> tag.
*Add your own fontawesome.js link inside your <head> tag.
*Call the createPlayer() function with the following options as shown.
```javascript
let aud_options_3 = [{
    //wrapper_id is where you want the audio player to appear
    wrapper_id: '#wrapper-id',
    playlist : [
        {
            audio_url: 'audios/bensound-ukulele.mp3',
            audio_title: 'Don\'t look back in anger'
        },
    ],
    theme: 'light',
}];
createPlayer(aud_options_3);
```
## Setting up playlist
You don't have to do anything special to setup multiple songs/playlist. Just pass in more than 1 song inside the playlist array as shown.
```javascript
let aud_options_2 = [{
    wrapper_id: "#wrapper-id-2",
    playlist : [
        {
            audio_url: "audios/bensound-extremeaction.mp3",
            audio_title: "Don't look back in anger"
        },
        {
            audio_url: "audios/bensound-happyrock.mp3",
            audio_title: "(Probably) All In The Mind"
        },
        {
            audio_url: "audios/bensound-ukulele.mp3",
            audio_title: "Fuckin' in the bushes"
        },
    ],
    theme: 'dark',
    autoplay: false,
}];
createPlayer(aud_options_2);
```
##  Changing the default icons
Look inside the aud.js file from line 4-11 for the icon classes. Replace them with your preferred icons.
```javascript
volume_icon : 'fa-volume-up',
volume_mute_icon : 'fa-volume-mute',
play_icon : 'fa-play-circle',
pause_icon : 'fa-pause-circle',
stop_icon : 'fa-stop-circle',
loading_icon : 'fa-sync-alt',
prev_icon: 'fa-backward',
next_icon: 'fa-forward',
```
Currently there are 2 themes for this audio player. Dark and Light. Simply pass in theme: "dark" or theme: "light". You can also disable auto play by setting autoplay:false.

## [Demo](https://srkr.me/aud)

Sample audios by [Bensound](https://www.bensound.com/)



