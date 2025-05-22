document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initDashboard();
  initNotifications();
  initStages();
  initLibrary();
  initProfile();
  initAnimations();
});

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      navLinks.forEach(item => {
        item.classList.remove('active');
      });
      this.classList.add('active');
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 150;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = '#' + section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  });
}

function initDashboard() {
  const progressIndicator = document.querySelector('.progress-indicator');
  if (progressIndicator) {
    const targetProgress = parseInt(progressIndicator.textContent);
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      if (currentProgress >= targetProgress) {
        clearInterval(progressInterval);
      } else {
        currentProgress++;
        progressIndicator.textContent = currentProgress + '%';
      }
    }, 20);
  }
  const deadlines = document.querySelectorAll('.deadline-item');
  deadlines.forEach(deadline => {
    const dateText = deadline.textContent.split(' - ')[1];
    if (dateText) {
      const deadlineDate = new Date(dateText);
      const today = new Date();
      const diffTime = Math.abs(deadlineDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const countdownBadge = document.createElement('span');
      countdownBadge.classList.add('countdown-badge');
      if (diffDays <= 7) {
        countdownBadge.classList.add('urgent');
      }
      countdownBadge.textContent = `${diffDays} days left`;
      deadline.appendChild(countdownBadge);
    }
  });
}

function initNotifications() {
  const notificationIcon = document.querySelector('.notifications');
  if (notificationIcon) {
    notificationIcon.addEventListener('click', () => {
      let dropdown = document.querySelector('.notification-dropdown');
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.classList.add('notification-dropdown');
        const notificationItems = [
          { title: 'Research seminar tomorrow', time: '1 hour ago' },
          { title: 'New library resources available', time: '1 day ago' },
          { title: 'Supervisor scheduled a meeting', time: '2 days ago' }
        ];
        const notificationList = document.createElement('ul');
        notificationList.classList.add('notification-list');
        notificationItems.forEach(item => {
          const listItem = document.createElement('li');
          listItem.classList.add('notification-item');
          listItem.innerHTML = `
            <div class="notification-content">
              <h4>${item.title}</h4>
              <span class="notification-time">${item.time}</span>
            </div>
            <button class="mark-read">✓</button>
          `;
          notificationList.appendChild(listItem);
        });
        dropdown.appendChild(notificationList);
        const footer = document.createElement('div');
        footer.classList.add('notification-footer');
        footer.innerHTML = `
          <a href="#notifications">View all notifications</a>
          <button class="mark-all-read">Mark all as read</button>
        `;
        dropdown.appendChild(footer);
        notificationIcon.appendChild(dropdown);
        const markReadButtons = dropdown.querySelectorAll('.mark-read');
        markReadButtons.forEach(button => {
          button.addEventListener('click', function(e) {
            e.stopPropagation();
            const notificationItem = this.closest('.notification-item');
            notificationItem.classList.add('read');
            const notificationCount = document.querySelector('.notification-count');
            let count = parseInt(notificationCount.textContent);
            notificationCount.textContent = --count;
            if (count === 0) {
              notificationCount.style.display = 'none';
            }
          });
        });
        const markAllButton = dropdown.querySelector('.mark-all-read');
        markAllButton.addEventListener('click', function(e) {
          e.stopPropagation();
          const notificationItems = dropdown.querySelectorAll('.notification-item');
          notificationItems.forEach(item => {
            item.classList.add('read');
          });
          const notificationCount = document.querySelector('.notification-count');
          notificationCount.textContent = '0';
          notificationCount.style.display = 'none';
        });
        document.addEventListener('click', function(e) {
          if (!notificationIcon.contains(e.target)) {
            dropdown.classList.remove('show');
          }
        });
      }
      dropdown.classList.toggle('show');
    });
  }
}

function initStages() {
  const stageCards = document.querySelectorAll('.stage-card');
  stageCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
  });
  const stageButtons = document.querySelectorAll('.stage-button');
  stageButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const originalText = this.textContent;
      this.textContent = 'Loading...';
      this.style.pointerEvents = 'none';
      setTimeout(() => {
        this.textContent = originalText;
        this.style.pointerEvents = 'auto';
        showNotification('Application submitted successfully!', 'success');
      }, 1500);
    });
  });
  const tableRows = document.querySelectorAll('.stages-table tr');
  tableRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
      this.style.backgroundColor = '#f8f9fa';
    });
    row.addEventListener('mouseleave', function() {
      this.style.backgroundColor = '';
    });
  });
}

function initLibrary() {
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  if (searchInput && searchButton) {
    function performSearch() {
      const query = searchInput.value.trim();
      if (query) {
        searchButton.textContent = 'Searching...';
        searchButton.disabled = true;
        setTimeout(() => {
          searchButton.textContent = 'Search';
          searchButton.disabled = false;
          showNotification(`Found ${Math.floor(Math.random() * 50) + 10} results for "${query}"`, 'info');
        }, 1500);
      }
    }
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    searchInput.addEventListener('input', function() {
      const query = this.value.trim();
      if (query.length > 2) {
        let suggestions = document.querySelector('.search-suggestions');
        if (!suggestions) {
          suggestions = document.createElement('div');
          suggestions.classList.add('search-suggestions');
          this.parentNode.appendChild(suggestions);
        }
        const mockSuggestions = [
          'Machine Learning Research Papers',
          'Data Analysis Methodologies',
          'Statistical Analysis Tools',
          'Research Design Principles',
          'Academic Writing Guidelines'
        ];
        const filteredSuggestions = mockSuggestions.filter(suggestion => 
          suggestion.toLowerCase().includes(query.toLowerCase())
        );
        suggestions.innerHTML = '';
        filteredSuggestions.slice(0, 3).forEach(suggestion => {
          const item = document.createElement('div');
          item.classList.add('suggestion-item');
          item.textContent = suggestion;
          item.addEventListener('click', () => {
            searchInput.value = suggestion;
            suggestions.style.display = 'none';
          });
          suggestions.appendChild(item);
        });
        suggestions.style.display = filteredSuggestions.length > 0 ? 'block' : 'none';
      }
    });
  }
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  const resourceLinks = document.querySelectorAll('.resource-item a');
  resourceLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const resourceName = this.textContent;
      addToRecentDownloads(resourceName);
      showNotification(`Accessing: ${resourceName}`, 'info');
    });
  });
}

function addToRecentDownloads(resourceName) {
  const recentDownloadsList = document.querySelector('.downloads-list');
  if (recentDownloadsList) {
    const newDownload = document.createElement('li');
    newDownload.classList.add('download-item');
    const today = new Date().toLocaleDateString();
    newDownload.innerHTML = `
      <span class="download-name">${resourceName}</span>
      <span class="download-date">${today}</span>
    `;
    recentDownloadsList.insertBefore(newDownload, recentDownloadsList.firstChild);
    const items = recentDownloadsList.querySelectorAll('.download-item');
    if (items.length > 5) {
      items[items.length - 1].remove();
    }
    newDownload.style.opacity = '0';
    newDownload.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      newDownload.style.transition = 'all 0.3s ease';
      newDownload.style.opacity = '1';
      newDownload.style.transform = 'translateX(0)';
    }, 100);
  }
}

function initProfile() {
  const editImageButton = document.querySelector('.edit-profile-image');
  if (editImageButton) {
    editImageButton.addEventListener('click', function() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const profilePic = document.querySelector('.profile-pic');
            profilePic.src = e.target.result;
            showNotification('Profile picture updated successfully!', 'success');
          };
          reader.readAsDataURL(file);
        }
      });
      fileInput.click();
    });
  }
  const editFields = document.querySelectorAll('.edit-field');
  editFields.forEach(editIcon => {
    editIcon.addEventListener('click', function() {
      const profileField = this.closest('.profile-field');
      const fieldValue = profileField.querySelector('.field-value');
      const currentValue = fieldValue.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentValue;
      input.classList.add('field-input');
      fieldValue.style.display = 'none';
      fieldValue.parentNode.insertBefore(input, fieldValue.nextSibling);
      input.focus();
      input.select();
      function saveField() {
        fieldValue.textContent = input.value;
        fieldValue.style.display = 'inline';
        input.remove();
        showNotification('Field updated successfully!', 'success');
      }
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          saveField();
        }
      });
      input.addEventListener('blur', saveField);
    });
  });
  const addPublicationButton = document.querySelector('.add-publication');
  if (addPublicationButton) {
    addPublicationButton.addEventListener('click', function() {
      const publicationsList = document.querySelector('.publications-list');
      const newPublication = document.createElement('li');
      newPublication.classList.add('publication-item');
      newPublication.innerHTML = `
        <span class="publication-title">New Publication Title</span>
        <span class="publication-journal">Journal Name, Year</span>
        <a href="#publication" class="publication-link">Edit</a>
      `;
      publicationsList.appendChild(newPublication);
      newPublication.style.opacity = '0';
      newPublication.style.transform = 'translateY(20px)';
      setTimeout(() => {
        newPublication.style.transition = 'all 0.3s ease';
        newPublication.style.opacity = '1';
        newPublication.style.transform = 'translateY(0)';
      }, 100);
      showNotification('New publication added. Click to edit details.', 'info');
    });
  }
  const updateProfileButton = document.querySelector('.update-profile');
  const exportCVButton = document.querySelector('.export-cv');
  if (updateProfileButton) {
    updateProfileButton.addEventListener('click', function() {
      this.textContent = 'Updating...';
      this.disabled = true;
      setTimeout(() => {
        this.textContent = 'Update Profile';
        this.disabled = false;
        showNotification('Profile updated successfully!', 'success');
      }, 2000);
    });
  }
  if (exportCVButton) {
    exportCVButton.addEventListener('click', function() {
      this.textContent = 'Generating...';
      this.disabled = true;
      setTimeout(() => {
        this.textContent = 'Export CV';
        this.disabled = false;
        showNotification('CV exported successfully!', 'success');
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'CV_John_Doe.pdf';
        link.click();
      }, 2000);
    });
  }
}

function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  const animateElements = document.querySelectorAll('.stat-card, .stage-card, .category-item, .technique-card');
  animateElements.forEach(element => {
    observer.observe(element);
  });
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.site-header');
    if (header) {
      const rate = scrolled * -0.5;
      header.style.transform = `translateY(${rate}px)`;
    }
  });
  const cards = document.querySelectorAll('.stat-card, .stage-card, .category-item, .technique-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.classList.add('notification-toast', type);
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#2ecc71';
      break;
    case 'error':
      notification.style.backgroundColor = '#e74c3c';
      break;
    case 'warning':
      notification.style.backgroundColor = '#f39c12';
      break;
    default:
      notification.style.backgroundColor = '#3498db';
  }
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function initThemeToggle() {
  const themeToggle = document.createElement('button');
  themeToggle.classList.add('theme-toggle');
  themeToggle.innerHTML = '🌓';
  themeToggle.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background-color: var(--primary-color);
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  `;
  document.body.appendChild(themeToggle);
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
      this.innerHTML = '☀️';
      showNotification('Dark theme activated', 'info');
    } else {
      this.innerHTML = '🌓';
      showNotification('Light theme activated', 'info');
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
});

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
      showNotification('Search activated', 'info');
    }
  }
  if (e.key === 'Escape') {
    const dropdown = document.querySelector('.notification-dropdown.show');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedScroll = debounce(function() {
}, 10);
