// Shared comic-avatar treatment for all people photos.
document.addEventListener('DOMContentLoaded', () => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'comic-people.css';
  document.head.appendChild(css);

  document.querySelectorAll('.person-photo, .dept-avatar, .teacher-card > img').forEach(img => {
    img.replaceWith(createAvatar('🧑🏾‍🏫', 'cartoon-person'));
  });

  document.querySelectorAll('.hero > img').forEach(img => {
    img.replaceWith(createAvatar('🧑🏾‍🎓  🧑🏿‍🎓  🧑🏽‍🎓', 'cartoon-students', true));
  });

  document.querySelectorAll('.modal-content img').forEach(img => img.remove());

  document.querySelectorAll('.modal-content').forEach(modal => {
    if (!modal.querySelector('.cartoon-montage')) {
      const montage = document.createElement('div');
      montage.className = 'cartoon-montage';
      montage.setAttribute('aria-label', 'Comic illustration');
      montage.textContent = '📚  🔬  🏆  ⚡';
      const closeButton = modal.querySelector('.close-btn');
      modal.insertBefore(montage, closeButton);
    }
  });

  const teacherSlide = document.querySelector('.slideshow-teachers .slide');
  if (teacherSlide) teacherSlide.classList.add('cartoon-teachers-slide');

  function createAvatar(text, className, wide = false) {
    const avatar = document.createElement('div');
    avatar.className = `${className}${wide ? ' cartoon-students-wide' : ''}`;
    avatar.setAttribute('role', 'img');
    avatar.setAttribute('aria-label', 'Anonymous cartoon-style person illustration');
    avatar.textContent = text;
    return avatar;
  }
});
