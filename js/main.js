const videoList = document.getElementById('videoList');

function addVideoToList(videoUrl, videoTitle) {
  // Проверяем, есть ли уже такая ссылка в списке видео
  const existingVideoItem = Array.from(videoList.getElementsByClassName('videoItem')).find(item => {
    const itemUrl = item.querySelector('.videoUrl').textContent;
    return itemUrl === videoUrl;
  });

  if (existingVideoItem) {
    // Если ссылка уже существует, не добавляем её снова
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

  const deleteButton = document.createElement('div');
  deleteButton.className = 'deleteButton';
  deleteButton.textContent = 'Удалить';
  deleteButton.addEventListener('click', function() {
    videoItem.remove();
    saveVideoList();
  });

  videoItem.appendChild(videoUrlElement);
  videoItem.appendChild(deleteButton);

  videoList.appendChild(videoItem);
}

// Остальной код остается без изменений
