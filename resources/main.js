$(_ => {
  // token validation
  jwt = Cookies.get('kakaoJWT');
  if(jwt) {
    $.ajax({
      url: '/kakao/api/verify',
      data: JSON.stringify({ token: jwt }),
      contentType: 'application/json',
      method: 'POST',
      success: (res) => { 
        if(res) main();
        else window.location.href = '/kakao';
      },
      error: _ => { window.location.href = '/kakao'; }
    });
  }
  else window.location.href = '/kakao';
});

function main() {
  eventListener();
  socket = io.connect('https://luftaquila.io', { path: "/kakao/socket", query: `token=${jwt}` });
  //socket.on('connect_error', _ => window.location.href = '/kakao' );
  socket.on('connect', _ => { });
  socket.on('init', data => {
    initData = data;
    renderFriendsTab(data.friendsList);
    renderChannelTab(data.channelList);
  });
  socket.on('chat', data => {
    data.sender = Long.fromValue(data.sender).toString();
    data.channel = Long.fromValue(data.channel).toString();
    data.logId = Long.fromValue(data.logId).toString();
    
    // if channel is rendered before
    if(initData.channelList.find(o => o.channelId == data.channel)) {
      const target = $('ul#chatContactTab li[data-channelid="' + data.channel + '"]');
      target.find('div.chat-time').text(new Date(data.sendTime * 1000).format('HH:MM'));
      target.find('p.text-truncate').text(data.text);
      $('ul#chatContactTab li:first-child').before(target);
      target.attr('data-lastchattime', data.sendTime);
    }
    else { // if channel is not rendered before: new appeared
      socket.emit('requestChannelInfo', { channelId: data.channel }, res => {
        $('ul#chatContactTab').prepend(channelTabContent(res));
      });
    }
    
    // render unread Count badge
    const target = $('ul#chatContactTab li[data-channelid="' + data.channel + '"]');
    if(data.unread) {
      target.addClass('unread');
      if(target.find('div.badge').not('div#mychatbadge').length) target.find('div.badge').not('div#mychatbadge').text(data.unread);
      else target.find('div.contacts-texts').append(`<div class="badge badge-rounded badge-primary ml-1">${data.unread}</div>`);
    }
    else {
      target.removeClass('unread');
      target.find('div.badge').not('div#mychatbadge').remove();
    }
    
    // update message if chatroom is opened
    if(data.channel == $('div#chatroom').attr('data-channelid')) {
      const lastChatDayBox = $('div#messageBody div.container div.message-day:last-child div.message-divider');
      if(lastChatDayBox.attr('data-label') == new Date(data.sendTime * 1000).format('yyyy. m. d')) {
        lastChatDayBox.parent().append(messageTemplate(data));
      }
      else {
        const newMessageDay = `
          <!-- Message Day Start -->
            <div class="message-day">
              <div class="message-divider sticky-top pb-2" data-label="${new Date(data.sendTime * 1000).format('yyyy. m. d')}">&nbsp;</div>
            </div>
            <!-- Message Day End -->`;
        lastChatDayBox.parent().parent().append(newMessageDay);
        $('div.message-day:last-child').append(messageTemplate(data));
      }
      scrollToChatEnd();
    }
  });
}

function renderFriendsTab(friendsList) {
  const target = $('#friendsTab').html('');
  friendsList = friendsList.sort((a, b) => a.name.localeCompare(b.name));
  /* 가나다순 초성별 정렬
  const startLetters = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  
  const firstWord = '';
  const charCode = firstWord.charCodeAt(0) - 0xAC00;
  const startLetter = (((charCode - (charCode % 28)) / 28 ) - (((charCode - (charCode % 28)) / 28 ) % 21)) / 21;
  */
  
  for(let friend of friendsList) target.append(friendsTabContent(friend));
}

function renderChannelTab(channelList) {
  const target = $('#chatContactTab').html('');
  channelList = channelList.sort((a, b) => parseFloat(b.lastChatTime) - parseFloat(a.lastChatTime));
  for(let channel of channelList) target.append(channelTabContent(channel));
  
  // channel click event listener
  $('ul#chatContactTab li.contacts-item').click(async function() {
    $('ul#chatContactTab li.contacts-item').removeClass('active');
    $(this).addClass('active');
    const channelId = $(this).attr('data-channelid');
    $('div#chatintro').attr('style', 'display:none!important');
    $('div#chatroom').css('display', 'flex').attr('data-channelid', channelId).html(await chatContent(channelId));
    scrollToChatEnd();
    
    $(".main").addClass("main-visible");
    $('[data-close]').click(function(e) {
      e.preventDefault();
      $(".main").removeClass("main-visible");
    });
    $("#transmit").click(function(e) {
      e.preventDefault();
      transmitChat();
    });
  });
}

function transmitChat() {
  socket.emit('requestChatSend', { channel: $('div#chatroom').attr('data-channelid'), text: $('textarea#messageInput').val() }, res => {
    if(res.sendTime) {
      $('textarea#messageInput').val(''); // empty input field
      
      // update channelist
      const target = $('ul#chatContactTab li[data-channelid="' + res.channel + '"]');
      target.find('div.chat-time').text(new Date(res.sendTime * 1000).format('HH:MM'));
      target.find('p.text-truncate').text(res.text);
      $('ul#chatContactTab li:first-child').before(target);
      target.attr('data-lastchattime', res.sendTime);
      
      const lastChatDayBox = $('div#messageBody div.container div.message-day:last-child div.message-divider');
      if(lastChatDayBox.attr('data-label') == new Date(res.sendTime * 1000).format('yyyy. m. d')) {
        lastChatDayBox.parent().append(messageTemplate(res));
      }
      else {
        const newMessageDay = `
          <!-- Message Day Start -->
            <div class="message-day">
              <div class="message-divider sticky-top pb-2" data-label="${new Date(res.sendTime * 1000).format('yyyy. m. d')}">&nbsp;</div>
            </div>
            <!-- Message Day End -->`;
        lastChatDayBox.parent().parent().append(newMessageDay);
        $('div.message-day:last-child').append(messageTemplate(res));
      }
      scrollToChatEnd();
    }
  });
}

function eventListener() {
  const keys = {};
  window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    if($('textarea#messageInput').is(':focus') && !keys[16] && keys[13]) {
      e.preventDefault();
      transmitChat();
    }
  });
  window.addEventListener('keyup', function(e) { delete keys[e.keyCode] });
}

function scrollToChatEnd() {
  document.querySelector('.chat-finished').scrollIntoView({
      block: 'end',
      behavior: 'auto' //"auto"  | "instant" | "smooth",
  });
}
function getUserInfo(userId) { return initData.friendsList.find(o => o.userId == userId); }
function getChannelInfo(channelId) { return initData.channelList.find(o => o.channelId == channelId); }