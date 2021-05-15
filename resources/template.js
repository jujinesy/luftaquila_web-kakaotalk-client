function friendsTabContent(friend) {
  return `
    <!-- friends Item Start -->
      <li class="contacts-item" data-userId="${friend.userId}">
        <a class="contacts-link" href="#">
          <div class="avatar bg-info text-light">
            ${friend.profileImageUrl ? '<img src="/kakao/data/user/' + friend.userId + '/profile.jpg" alt="">' : '<span><i class="fad fa-user"></i></span>'}
          </div>
          <div class="contacts-content">
            <div class="contacts-info">
              <h6 class="chat-name text-truncate">${friend.name}</h6>
            </div>
            <div class="contacts-texts">
              <p class="text-muted mb-0">${friend.statusMessage ? friend.statusMessage : ''}</p>
            </div>
          </div>
        </a>
      </li>
      <!-- friends Item End -->
  `;
}

function channelTabContent(channel) {
  const chatTime = new Date(channel.lastChatTime * 1000);
  const isChatTimeToday = chatTime.toDateString() == new Date().toDateString();
  const profileImg = channel.roomImageUrl ? '<img src="/kakao/data/channel/' + channel.channelId + '/profile.jpg" alt="">' : (channel.userCount == 2 ? (getUserInfo(JSON.parse(channel.userList)[0].userId).profileImageUrl ? '<img src="/kakao/data/user/' + JSON.parse(channel.userList)[0].userId + '/profile.jpg" alt="" >' : '<span><i class="fad fa-user"></i></span>') : '<span><i class="fad fa-user-friends"></i></span>');
  return `
    <!-- Chat Item Start -->
    <li class="contacts-item ${channel.newMessageCount ? 'unread' : '' }" data-channelid="${channel.channelId}" data-lastchattime="${channel.lastChatTime}">
      <a class="contacts-link">
        <div class="avatar avatar-online bg-info text-light"> ${channel.userCount == 1 ? '<img src="/kakao/data/myself/profile.jpg" alt="">' : profileImg} </div>
        <div class="contacts-content">
          <div class="contacts-info">
            <h6 class="chat-name text-truncate">${channel.name ? channel.name : '<div id="mychatbadge" class="badge badge-rounded badge-primary">Me</div>'}</h6>
            <div class="chat-time">${isChatTimeToday ? chatTime.format('HH:MM') : chatTime.format('m월 d일')}</div>
          </div>
          <div class="contacts-texts">
            <p class="text-truncate">${channel.lastChatText}</p>
            ${channel.newMessageCount ? `<div class="badge badge-rounded badge-primary ml-1">${channel.newMessageCount}</div>` : '' }
          </div>
        </div>
      </a>
    </li>
    <!-- Chat Item End -->
  `;
}

async function chatContent(channelId) {
  const channel = getChannelInfo(channelId);
  const userList = JSON.parse(channel.userList);
  channel.isDirectChat = channel.userCount == 2;
  const chatTime = new Date(channel.lastChatTime * 1000);
  const isChatTimeToday = chatTime.toDateString() == new Date().toDateString();
  const profileImg = channel.userCount == 1 ? '<img src="/kakao/data/myself/profile.jpg" alt="">' : (channel.roomImageUrl ? '<img src="/kakao/data/channel/' + channel.channelId + '/profile.jpg" alt="">' : (channel.userCount == 2 ? (getUserInfo(userList[0].userId).profileImageUrl ? '<img src="/kakao/data/user/' + userList[0].userId + '/profile.jpg" alt="" >' : '<span><i class="fad fa-user"></i></span>') : '<span><i class="fad fa-user-friends"></i></span>'));
  const header = `
    <!-- Chat Header Start-->
    <div class="chat-header">
      <!-- Chat Back Button (Visible only in Small Devices) -->
      <button class="btn btn-secondary btn-icon btn-minimal btn-sm text-muted d-xl-none" type="button" data-close="" style="margin-right: 1rem;">
        <svg class="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
      </button>
      <!-- Chat participant's Name -->
      <div class="media chat-name align-items-center text-truncate">
        <div class="avatar avatar-online bg-info text-light d-none d-sm-inline-block mr-3"> ${profileImg} </div>
        <div class="media-body align-self-center ">
          <h6 class="text-truncate mb-0" style='width: 9rem'>${channel.name}</h6>
          <small class="text-muted">${channel.isDirectChat ? (getUserInfo(userList[0].userId).statusMessage ? getUserInfo(userList[0].userId).statusMessage : '') : (channel.userCount == 1 ? '<div id="mychatroombadge" class="badge badge-rounded badge-primary" style="font-size: 1.2rem">Me</div>' : channel.userCount + '명') }</small>
        </div>
      </div>
      <!-- Chat Options -->
      <ul class="nav flex-nowrap">
        <li class="nav-item list-inline-item d-none d-sm-block mr-1">
          <a class="nav-link text-muted px-1" data-toggle="collapse" data-target="#searchCollapse" href="#" aria-expanded="false">
            <svg class="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </a>
        </li>
        ${channel.userCount != 1 ? `
        <li class="nav-item list-inline-item d-none d-sm-block mr-1">
          <a class="nav-link text-muted px-1" href="#" title="Mark Read">
            <i class='far fa-check-square' style='line-height: 1.5rem'></i>
          </a>
        </li>` : ``}
        <li class="nav-item list-inline-item d-none d-sm-block mr-0">
          <div class="dropdown">
            <a class="nav-link text-muted px-1" href="#" role="button" title="Details" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <svg class="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item align-items-center d-flex" href="#" data-chat-info-toggle="">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>View Info</span>
              </a>
              <a class="dropdown-item align-items-center d-flex" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                </svg>
                <span>Mute Notifications</span> 
              </a> <!--
              <a class="dropdown-item align-items-center d-flex" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
                <span>Archive</span>
              </a>
              <a class="dropdown-item align-items-center d-flex" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span>Delete</span>
              </a> -->
              <a class="dropdown-item align-items-center d-flex text-danger" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                </svg>
                <span>Leave</span>
              </a>
            </div>
          </div>
        </li>
        <li class="nav-item list-inline-item d-sm-none mr-0">
          <div class="dropdown">
            <a class="nav-link text-muted px-1" href="#" role="button" title="Details" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <svg class="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item align-items-center d-flex" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>Call</span>    
              </a>
              <a class="dropdown-item align-items-center d-flex" href="#" data-toggle="collapse" data-target="#searchCollapse" aria-expanded="false">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span>Search</span>    
              </a>
              <a class="dropdown-item align-items-center d-flex" href="#" data-chat-info-toggle="">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>View Info</span>
              </a>
              <a class="dropdown-item align-items-center d-flex" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                </svg>
                <span>Mute Notifications</span> 
              </a>
              <a class="dropdown-item align-items-center d-flex" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Wallpaper</span>
              </a>
              <a class="dropdown-item align-items-center d-flex" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
                <span>Archive</span>
              </a>
              <a class="dropdown-item align-items-center d-flex" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span>Delete</span>
              </a>
              <a class="dropdown-item align-items-center d-flex text-danger" href="#">
                <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                </svg>
                <span>Block</span>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- Chat Header End-->
    <!-- Search Start -->
    <div class="collapse border-bottom px-3" id="searchCollapse">
      <div class="container-xl py-2 px-0 px-md-3">
        <div class="input-group bg-light ">
          <input type="text" class="form-control form-control-md border-right-0 transparent-bg pr-0" placeholder="Search">
          <div class="input-group-append">
            <span class="input-group-text transparent-bg border-left-0">
              <svg class="hw-20 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- Search End -->
  `;
  
  const body = `
    <!-- Chat Content Start-->
    <div class="chat-content p-2" id="messageBody">
      <div class="container">
        ${await chatBodyGenerator(channelId)}
      </div>
      <!-- Scroll to finish -->
      <div class="chat-finished" id="chat-finished"></div>
    </div>
    <!-- Chat Content End-->
  `;
  
  const footer = `
    <!-- Chat Footer Start-->
    <div class="chat-footer">
      <div class="attachment">
        <div class="dropdown">
          <button class="btn btn-secondary btn-icon btn-minimal btn-sm" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <svg class="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </button>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="#">
              <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>Gallery</span>
            </a>
            <a class="dropdown-item" href="#">
              <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
              <span>Audio</span>
            </a>
            <a class="dropdown-item" href="#">
              <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <span>Document</span>
            </a>
            <a class="dropdown-item" href="#">
              <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>Contact</span>
            </a>
            <a class="dropdown-item" href="#">
              <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Location</span>
            </a>
            <a class="dropdown-item" href="#">
              <svg class="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>Poll</span>
            </a>
          </div>
        </div>
      </div>
      <textarea class="form-control emojionearea-form-control" id="messageInput" rows="1" placeholder="Type your message here..."></textarea>
      <div class="btn btn-primary btn-icon send-icon rounded-circle text-light mb-1" style="transform: scale(0.7);" role="button" id="transmit">
        <svg class="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </div>
    </div>
    <!-- Chat Footer End-->
  `;
  return (header + body + footer);
}

async function chatBodyGenerator(channelId) {
  return await promiseSocket();
  
  function promiseSocket() {
    return new Promise((resolve, reject) => {
      let result = '';
      socket.emit('requestChatLog', { channelId: channelId }, res => {
        res = res.reverse();
        let currentDay = new Date(res[0].sendTime * 1000).toDateString();
        result += `
          <!-- Message Day Start -->
          <div class="message-day">
            <div class="message-divider sticky-top pb-2" data-label="${new Date(res[0].sendTime * 1000).format('yyyy. m. d')}">&nbsp;</div>`;

        for(let chat of res) {
          const thisDay = new Date(chat.sendTime * 1000).toDateString();
          const isMyself = chat.senderId == Long.fromValue(initData.myInfo.id).toString();
          if(currentDay != thisDay) { // if new day starts
            currentDay = thisDay;
            result += `
          </div>
          <!-- Message Day End -->
          <!-- Message Day Start -->
          <div class="message-day">
            <div class="message-divider sticky-top pb-2" data-label="${new Date(chat.sendTime * 1000).format('yyyy. m. d')}">&nbsp;</div>`;
          }
          result += `
            <!-- Message Start -->
            <div class="message ${ isMyself ? 'self' : ''}">
              <div class="message-wrapper">
                <div class="message-content"><span>${chat.text}</span></div>
              </div>
              <div class="message-options">
                <div class="avatar avatar-sm bg-info text-light">${ isMyself ? `<img src="/kakao/data/myself/profile.jpg" alt="">` : (getUserInfo(chat.senderId).profileImageUrl ? `<img src="/kakao/data/user/${chat.senderId}/profile.jpg" alt="">` : '<span style="box-shadow: 0 0 0 0.5rem #fff;"><i class="fad fa-user"></i></span>')}</div>
                <span class="message-date">${new Date(chat.sendTime * 1000).format('HH:MM')}</span>
                <span class="message-status">${''}</span>
                <div class="dropdown">
                  <a class="text-muted" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <svg class="hw-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                    </svg>
                  </a>
                  <div class="dropdown-menu">
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <svg class="hw-18 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                      <span>Copy</span>
                    </a>
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <svg class="hw-18 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                      </svg>
                      <span>Reply</span>
                    </a>
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <svg class="hw-18 rotate-y mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                      </svg>
                      <span>Forward</span>
                    </a>
                    <a class="dropdown-item d-flex align-items-center text-danger" href="#">
                      <svg class="hw-18 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      <span>Delete</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <!-- Message End -->`;
        }
        result += `
          </div>
          <!-- Message Day End -->`;
        resolve(result);
      });
    });
  }
}

function messageTemplate(chat) {
  const isMyself = chat.sender ? (chat.sender == Long.fromValue(initData.myInfo.id).toString()) : true;
  const sender = getUserInfo(chat.senderId);
  return `
    <!-- Message Start -->
    <div class="message ${ isMyself ? 'self' : ''}">
      <div class="message-wrapper">
        <div class="message-content"><span>${chat.text}</span></div>
      </div>
      <div class="message-options">
        <div class="avatar avatar-sm bg-info text-light">${ isMyself ? `<img src="/kakao/data/myself/profile.jpg" alt="">` : (sender && sender.profileImageUrl ? `<img src="/kakao/data/user/${chat.senderId}/profile.jpg" alt="">` : '<span style="box-shadow: 0 0 0 0.5rem #fff;"><i class="fad fa-user"></i></span>')}</div>
        <span class="message-date">${new Date(chat.sendTime * 1000).format('HH:MM')}</span>
        <span class="message-status">${''}</span>
        <div class="dropdown">
          <a class="text-muted" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <svg class="hw-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
            </svg>
          </a>
          <div class="dropdown-menu">
            <a class="dropdown-item d-flex align-items-center" href="#">
              <svg class="hw-18 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <span>Copy</span>
            </a>
            <a class="dropdown-item d-flex align-items-center" href="#">
              <svg class="hw-18 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
              </svg>
              <span>Reply</span>
            </a>
            <a class="dropdown-item d-flex align-items-center" href="#">
              <svg class="hw-18 rotate-y mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
              </svg>
              <span>Forward</span>
            </a>
            <a class="dropdown-item d-flex align-items-center text-danger" href="#">
              <svg class="hw-18 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span>Delete</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- Message End -->`;
}