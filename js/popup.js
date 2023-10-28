document.addEventListener('DOMContentLoaded', function() {
    const addVideoForm = document.getElementById('addVideoForm');
    const videoUrlInput = document.getElementById('videoUrlInput');
    const videoTitleInput = document.getElementById('videoTitleInput');
    const videoList = document.getElementById('videoList');
    const passwordCheckbox = document.getElementById('passwordCheckbox');
    const passwordInput = document.getElementById('passwordInput');
    const savePasswordButton = document.getElementById('savePasswordButton');
    let isPasswordEnabled = false;
  
    addVideoForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const videoUrl = videoUrlInput.value.trim();
      const videoTitle = videoTitleInput.value.trim();
  
      if (videoUrl) {
        addVideoToList(videoUrl, videoTitle);
        videoUrlInput.value = '';
        videoTitleInput.value = '';
        saveVideoList();
      }
    });
  
    const parseButton = document.getElementById('parseButton');
    parseButton.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const videoUrlInput = document.getElementById('videoUrlInput');
        videoUrlInput.value = tabs[0].url;
      });
    });
  
    function addVideoToList(videoUrl, videoTitle) {
      const existingVideoItem = Array.from(videoList.getElementsByClassName('videoItem')).find(item => {
        const itemUrl = item.querySelector('.videoUrl').getAttribute('href');
        return itemUrl === videoUrl;
      });
  
      if (existingVideoItem) {
        return;
      }
  
      const videoItem = document.createElement('div');
      videoItem.className = 'videoItem';
  
      const videoUrlElement = document.createElement('a');
      videoUrlElement.className = 'videoUrl';
      videoUrlElement.href = videoUrl;
      videoUrlElement.target = '_blank';
      videoUrlElement.textContent = videoTitle || videoUrl;
  
      videoUrlElement.addEventListener('click', function(event) {
        event.preventDefault();
        chrome.tabs.create({ url: videoUrlElement.href });
      });
  
      videoItem.appendChild(videoUrlElement);
  
      const deleteButton = document.createElement('div');
      deleteButton.className = 'deleteButton';
      const icon = document.createElement('img');
      icon.className = 'icon';
      icon.src = '../icons/delete-icon.png';
      icon.alt = 'Удалить';
      deleteButton.appendChild(icon);
      deleteButton.addEventListener('click', function() {
        videoItem.remove();
        saveVideoList();
      });
  
      videoItem.appendChild(deleteButton);
  
      videoList.appendChild(videoItem);
    }
  
    function saveVideoList() {
      const videoItems = Array.from(videoList.getElementsByClassName('videoItem')).map(item => {
        const videoUrl = item.querySelector('.videoUrl').getAttribute('href');
        return {
          url: videoUrl,
          title: item.querySelector('.videoUrl').textContent,
        };
      });
  
      chrome.storage.local.set({ videoList: videoItems });
    }
  
    function loadVideoList() {
      chrome.storage.local.get('videoList', function(result) {
        const videoData = result.videoList;
        if (videoData && videoData.length > 0) {
          videoList.innerHTML = '';
          videoData.forEach(video => addVideoToList(video.url, video.title));
        }
      });
    }
  
    loadVideoList();
  
    function enablePasswordInput() {
      passwordInput.disabled = false;
      savePasswordButton.disabled = false;
    }
  
    function disablePasswordInput() {
      passwordInput.disabled = true;
      savePasswordButton.disabled = true;
    }
  
    passwordCheckbox.addEventListener('change', function() {
      if (passwordCheckbox.checked) {
        enablePasswordInput();
      } else {
        disablePasswordInput();
      }
    });
  
    savePasswordButton.addEventListener('click', function() {
      const password = passwordInput.value.trim();
      if (password) {
        passwordInput.value = '';
        disablePasswordInput();
        isPasswordEnabled = true;
      }
    });
  
    chrome.storage.local.get('isPasswordEnabled', function(result) {
      isPasswordEnabled = result.isPasswordEnabled || false;
      passwordCheckbox.checked = isPasswordEnabled;
      if (isPasswordEnabled) {
        enablePasswordInput();
      } else {
        disablePasswordInput();
      }
    });
  
    chrome.tabs.getCurrent(function(tab) {
      if (!tab.incognito) {
        chrome.tabs.create({ url: 'chrome://newtab' });
      }
    });
  });
                   