function createPlayer(audio_data){
    /*Default Icons (uses font awesome)*/
    let icons = [{
        volume_icon : 'fa-volume-up',
        volume_mute_icon : 'fa-volume-mute',
        play_icon : 'fa-play-circle',
        pause_icon : 'fa-pause-circle',
        stop_icon : 'fa-stop-circle',
        loading_icon : 'fa-sync-alt',
        prev_icon: 'fa-backward',
        next_icon: 'fa-forward',
    }];
    icons = icons[0];
    /*End default Icons*/
    let options = audio_data[0];
    let wrapper = document.querySelector(options.wrapper_id);
    let total_songs = options.playlist.length;
    let audio_location = options.playlist[0].audio_url;
    let audio_title = options.playlist[0].audio_title;    
    let theme = options.theme;
    let autoplay = options.autoplay;
    if(autoplay == undefined)
    {
        autoplay = true;
    }
    let element_class = 'aud-light';
    if(theme == 'dark'){
        element_class = 'aud-dark';
    }
    let mainPlayer = `
    <div class="aud-element ${element_class}">
    <audio preload="metadata">
    <source src="${audio_location}" type="audio/mpeg">
    </audio>
        <span class="aud-title">${audio_title}</span>
        <input type="range" class="audio-progress" min="0" step="0.25" value="0"/>
        <div class="aud-left">
            <span class="c-min">0</span>:<span class="c-sec">00</span>
        </div><!--left-->
        <div class="aud-right">
            <span class="min">0</span>.<span class="sec">00</span>
        </div><!--left-->
        <div class="aud-row">
            <div class="aud-col">
                <i class="fas ${icons.volume_icon} mute-icon"></i>
            </div><!--col-->
            <div class="aud-col">
                <i class="far ${icons.play_icon} player-icon"></i>
            </div><!--col-->
            <div class="aud-col">
                <i class="far ${icons.stop_icon} stop-icon"></i>
            </div><!--col-->
        </div><!--row-->
        <div class="playlist-wrap"></div>
    </div><!--element-->
    `;
    wrapper.innerHTML = mainPlayer;
    let audio_element = wrapper.querySelector('audio');
    let progress_bar = wrapper.querySelector('.audio-progress');
    let mute_btn = wrapper.querySelector('.mute-icon');
    let row = wrapper.querySelector('.aud-row');
    //times
    audio_element.onloadedmetadata = function() {
        let audio_duration = audio_element.duration;
        let aud_minutes = Math.floor(audio_duration / 60);
        let aud_seconds = Math.floor(audio_duration - aud_minutes*60);
        wrapper.querySelector('.sec').innerText = aud_seconds;
        wrapper.querySelector('.min').innerText = aud_minutes;
    }
    //play pause
    let playerIcon = wrapper.querySelector('.player-icon');
    playerIcon.addEventListener('click', function(){
        if(audio_element.paused){
            audio_element.play();
            change_icon(icons, playerIcon, true);
            }
            else{
            audio_element.pause();
            change_icon(icons, playerIcon, false);
        }
    })
    //progress bar and time update
    audio_element.addEventListener('timeupdate', function() {
        let minutes = Math.floor(audio_element.currentTime / 60);
        let seconds = (audio_element.currentTime).toFixed(0);
        if(seconds >= 60)
        {
            seconds = seconds - (minutes*60);
        }
        if(seconds < 10)
        {
            seconds = '0'+seconds;
        }
        let playPercent = 100 * (audio_element.currentTime / audio_element.duration);
        wrapper.querySelector('.c-min').innerHTML = minutes;
        wrapper.querySelector('.c-sec').innerHTML = seconds;
        progress_bar.value = audio_element.currentTime;
        progress_bar.max = audio_element.duration;
        let progress_bar_bg = 'linear-gradient(to right, rgb(129, 129, 189) '+playPercent+'%, rgb(242, 242, 242) '+playPercent+'%)';
        if(theme == 'dark'){
            progress_bar_bg = 'linear-gradient(to right, rgb(129, 129, 189) '+playPercent+'%, rgb(68,68,68) '+playPercent+'%)';
        }
        progress_bar.style.background = progress_bar_bg;
    });
    //seek bar
    progress_bar.addEventListener('change', function(){
        audio_element.currentTime = progress_bar.value;
    });
    //stop
    wrapper.querySelector('.stop-icon').addEventListener('click', function(){
        audio_element.pause();
        audio_element.currentTime = 0;
        change_icon(icons, playerIcon, false);
    });
    //mute
    mute_btn.addEventListener('click', function(){
        if(audio_element.muted == false){
            audio_element.muted = true;
            mute_btn.classList.remove(icons.volume_icon);
            mute_btn.classList.add(icons.volume_mute_icon);
        }
        else{
            audio_element.muted = false;
            mute_btn.classList.remove(icons.volume_mute_icon);
            mute_btn.classList.add(icons.volume_icon);
        }
    });
    //playlist
    if(total_songs > 1){
        for(let i = 0; i < total_songs; i++){
            let playlist_title = options.playlist[i].audio_title;
            let playlist_url = options.playlist[i].audio_url;
            let playing_class = '';
            if(i == 0){
                playing_class = 'playing';
            }
            let playlist_items = `<a href="javascript:;" class="playlist-item ${playing_class}" data-id="${i}" data-title="${playlist_title}" data-src="${playlist_url}">${playlist_title}</a>`;
            wrapper.querySelector('.playlist-wrap').innerHTML += playlist_items;
        }
        //
        let each_list = wrapper.getElementsByClassName('playlist-item');
        for (let i = 0; i < each_list.length; i++) {
            each_list[i].addEventListener('click', function(){
                for(let single_item of each_list){
                    single_item.classList.remove('playing');
                };
                this.classList.add('playing');
                auto_play(icons, wrapper, audio_element, playerIcon, false);
            });
        }
        //next prev
        row.insertAdjacentHTML('beforeend', `<div class="aud-col"><i class="fas ${icons.next_icon} next-icon"></i></div>`);
        row.insertAdjacentHTML('afterbegin', `<div class="aud-col"><i class="fas ${icons.prev_icon} prev-icon"></i></div>`);
        let next_song = wrapper.querySelector('.next-icon');
        let prev_song = wrapper.querySelector('.prev-icon');
        next_song.addEventListener('click', function(){
            auto_play(icons, wrapper, audio_element, playerIcon, true);
        })
        prev_song.addEventListener('click', function(){
            auto_play(icons, wrapper, audio_element, playerIcon, false, true);
        })
    }
    //end playlist
    //audio ended.
    audio_element.addEventListener('ended', function(){
        change_icon(icons, playerIcon, false);
        if(total_songs > 1 && autoplay){
            //the reason it's name is auto
            auto_play(icons, wrapper, audio_element, playerIcon, true);
        }
    });
}
//true = play icon => pause icon
function change_icon(icons, playerIcon, reverse){
    if(reverse){
        playerIcon.classList.remove(icons.play_icon);
        playerIcon.classList.add(icons.pause_icon);
    }
    else{
        playerIcon.classList.remove(icons.pause_icon);
        playerIcon.classList.add(icons.play_icon);
    }
}
//auto play
function auto_play(icons, wrapper, audio_element, playerIcon, auto = false, prev = false){
    let current_playing = wrapper.querySelector('.playing');
    let current_playing_alt = current_playing;
    if(auto){
        //play next element
        current_playing.classList.remove('playing');
        current_playing = current_playing.nextElementSibling;
        if(current_playing == null){
            current_playing = current_playing_alt;
            current_playing.classList.add('playing');
            return;
        }
        current_playing.classList.add('playing');
    }
    if(prev){
        current_playing.classList.remove('playing');
        current_playing = current_playing.previousElementSibling;
        if(current_playing == null){
            current_playing = current_playing_alt;
            current_playing.classList.add('playing');
            return;
        }
        current_playing.classList.add('playing');
    }
    wrapper.querySelector('.aud-title').innerHTML = `<i class="fas ${icons.loading_icon} aud-loading"></i> Loading..`;
    wrapper.querySelector('source').src = current_playing.dataset.src;
    audio_element.load();
    audio_element.play();
    change_icon(icons, playerIcon, true);
    audio_element.addEventListener('canplaythrough', function(){
        wrapper.querySelector('.aud-title').innerHTML = current_playing.dataset.title;
    });
}