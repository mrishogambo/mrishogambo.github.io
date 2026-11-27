/* Shared behavior and safe content fixes for the static school site. */
document.addEventListener('DOMContentLoaded', () => {
  const fixes = document.createElement('link');
  fixes.rel = 'stylesheet';
  fixes.href = 'site-fixes.css';
  document.head.appendChild(fixes);

  const nav = document.querySelector('.main-nav');
  const toggle = nav?.querySelector('.nav-toggle');
  const menu = nav?.querySelector('ul');
  const setMenuOpen = (open) => {
    if (!toggle || !menu) return;
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  };
  if (toggle && menu) {
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setMenuOpen(false);
    });
  }

  // Generic placeholder images are not real portraits. Keep actual photos and
  // give each placeholder a distinct initials avatar derived from the person's name.
  document.querySelectorAll('.person-card img, .teacher-card img, .dept-avatar').forEach(img => {
    const src = img.getAttribute('src') || '';
    if (/^(ok\.png)$/i.test(src.split('/').pop()) || !img.complete || img.naturalWidth === 0) {
      const card = img.closest('.person-card, .teacher-card, .dept-body');
      const name = card?.querySelector('h3')?.textContent.trim() || 'School staff';
      const role = card?.querySelector('.person-role, .role, .dept-role')?.textContent.trim() ||
        (card?.classList.contains('dept-body') ? 'Head of Department' : 'School staff');
      const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'S';
      const avatar = document.createElement('div');
      avatar.className = `${img.className} initials-avatar`;
      avatar.setAttribute('role', 'img');
      avatar.setAttribute('aria-label', `${name}, ${role}`);
      avatar.textContent = initials;
      img.replaceWith(avatar);
    } else {
      const card = img.closest('.person-card, .teacher-card, .dept-body');
      const name = card?.querySelector('h3')?.textContent.trim();
      const role = card?.querySelector('.person-role, .role, .dept-role')?.textContent.trim() || 'School staff';
      if (name) img.alt = `${name} — ${role}`;
    }
  });

  // Department cards use a consistent image, name, title, then phone structure.
  document.querySelectorAll('.dept-body').forEach(body => {
    const name = body.querySelector('h3');
    const details = body.querySelector('p');
    if (!name || !details) return;
    const text = details.textContent.trim().replace(/\s+/g, ' ');
    const phone = text.match(/\+255\s*\d[\d\s]{8,}/)?.[0]?.replace(/\s+/g, ' ').trim();
    const role = text.replace(/\s*[·|—-]\s*\+255.*$/, '').trim() || 'Head of Department';
    details.className = 'dept-role';
    details.textContent = role;
    let phoneLine = body.querySelector('.dept-phone');
    if (phone) {
      phoneLine ||= document.createElement('p');
      phoneLine.className = 'dept-phone';
      phoneLine.textContent = phone.replace(/\+255\s*(\d{3})\s*(\d{3})\s*(\d{3})/, '+255 $1 $2 $3');
      details.after(phoneLine);
    }
    const image = body.querySelector('.dept-avatar, .initials-avatar');
    if (image) body.prepend(image);
    body.append(name, details);
    if (phoneLine) body.append(phoneLine);
  });

  // Shared descriptions and footer details; contact values intentionally remain TODOs.
  if (!document.querySelector('meta[name="description"]')) {
    const description = document.createElement('meta');
    description.name = 'description';
    description.content = `${document.title.replace(/\s*[|—-].*$/, '')} information for Mrisho Gambo Secondary School.`;
    document.head.appendChild(description);
  }
  document.querySelectorAll('.site-footer').forEach(footer => {
    if (!footer.querySelector('.footer-contact')) {
      const contact = document.createElement('p');
      contact.className = 'footer-contact';
      contact.innerHTML = 'Address: <!-- TODO: Add verified school address. --> To be confirmed · Phone: <!-- TODO: Add verified general school phone. --> To be confirmed · Email: <!-- TODO: Add verified school email. --> To be confirmed';
      footer.appendChild(contact);
    }
  });

  // Keep the notes page title and navigation label identical everywhere.
  document.querySelectorAll('.main-nav a[href="notes.html"]').forEach(link => link.textContent = 'Notes & Exams');
  if (location.pathname.endsWith('/notes.html') || location.pathname === 'notes.html') {
    const title = document.querySelector('main > .page-title');
    if (title) title.textContent = 'Notes & Exams';
    const intro = document.querySelector('main > .page-subtitle');
    if (intro && !intro.textContent.includes('external resources')) {
      intro.insertAdjacentText('afterend', ' These materials are external resources; please check each provider for accuracy and availability.');
    }
    const section = document.querySelector('main > section');
    if (section) {
      const todo = document.createElement('p');
      todo.className = 'content-list materials-todo';
      todo.textContent = 'TODO: Add notes for Geography, Literature in English, Business Studies and Bookkeeping.';
      section.appendChild(todo);
    }
  }

  // Basic content corrections that do not alter reported facts.
  document.querySelectorAll('main').forEach(main => {
    main.innerHTML = main.innerHTML.replace(/academic,administrative/g, 'academic, administrative')
      .replace(/students prefects/g, 'student prefects')
      .replace(/evey year/gi, 'every year')
      .replace(/Eventually/g, 'School updates')
      .replace(/Winter Holidays/g, 'End-of-Year Holidays');
  });

  if (location.pathname.endsWith('/home.html') || location.pathname === 'home.html') {
    const count = document.querySelector('.stat-num');
    if (count) count.textContent = String(document.querySelectorAll('.dept-grid').length ? document.querySelectorAll('.dept-grid').item(0).querySelectorAll('.dept-card').length : 12);
    const admissions = [...document.querySelectorAll('a.btn')].find(link => /See Admissions|Admission History/i.test(link.textContent));
    if (admissions) admissions.textContent = 'Apply Now';
    const notifications = document.querySelector('.notifications-box ul');
    if (notifications) notifications.innerHTML = '<li>End-of-Year Holidays: 25th December – 5th January.</li><li>Sports Day was held on 10 November 2026.</li>';
    const events = document.querySelector('.events-box ul');
    if (events) events.innerHTML = '<li>Past event: Sports Day — 10 November 2026.</li><!-- TODO: Confirm upcoming event dates against the News page before publishing. -->';
  }

  if (location.pathname.endsWith('/about.html') || location.pathname === 'about.html') {
    const achievements = [...document.querySelectorAll('main section')].find(section => /Our Achievements/.test(section.textContent));
    if (achievements) achievements.innerHTML = '<h2>Our Achievements</h2><p><!-- TODO: Add verified school achievements and dates before publishing. --> Achievement details to be confirmed.</p>';
    const main = document.querySelector('main');
    if (main) main.insertAdjacentHTML('afterbegin', '<p><!-- TODO: Confirm founding year and school location. --> Founding year and location to be confirmed.</p>');
    const services = [...document.querySelectorAll('main section')].find(section => /Our Services/.test(section.textContent));
    if (services) services.insertAdjacentHTML('afterbegin', '<!-- TODO: Verify claims about boarding, bus services and small class sizes before publishing. -->');
    const deputy = [...document.querySelectorAll('.person-card')].find(card => /^Lomitu$/i.test(card.querySelector('h3')?.textContent.trim() || ''));
    if (deputy) deputy.insertAdjacentHTML('beforeend', '<!-- TODO: Confirm Deputy Headmaster surname. -->');
  }

  if (location.pathname.endsWith('/departments.html') || location.pathname === 'departments.html') {
    const counts = [...document.querySelectorAll('.dept-grid')];
    if (counts[0]) counts[0].dataset.departmentCount = String(counts[0].querySelectorAll('.dept-card').length);
    const abu = [...document.querySelectorAll('.dept-card')].filter(card => /Abu Salim/.test(card.textContent));
    if (abu.length > 1) abu[1].insertAdjacentHTML('beforeend', '<!-- TODO: Abu Salim is listed as head of both Environment and Sports & Games. Confirm before changing either listing. -->');
    const table = document.querySelector('table');
    if (table) {
      const wrap = table.closest('.table-wrap');
      if (wrap) {
        wrap.hidden = true;
        const todo = document.createElement('p');
        todo.textContent = 'TODO: Add current student prefect names and year before publishing.';
        wrap.after(todo);
      }
    }
    document.querySelectorAll('.dept-phone').forEach(phone => {
      if (/\+255/.test(phone.textContent)) phone.textContent = phone.textContent.replace(/\+255\s*(\d{3})\s*(\d{3})\s*(\d{3})/, '+255 $1 $2 $3');
    });
  }

  if (location.pathname.endsWith('/results.html') || location.pathname === 'results.html') {
    document.querySelectorAll('.results-table tbody').forEach(tbody => {
      if (!tbody.querySelector('tr') || [...tbody.querySelectorAll('td')].every(td => /^[-—\s]*$/.test(td.textContent))) {
        const table = tbody.closest('table');
        if (table) table.replaceWith(Object.assign(document.createElement('p'), { textContent: 'Results will be published after the official NECTA release.' }));
      }
    });
    document.querySelectorAll('main p').forEach(p => {
      p.textContent = p.textContent.replace(/report also from.*specifically overalled/gi, 'report from the official NECTA results portal, using the school and examination details provided by NECTA.');
    });
  }

  if (location.pathname.endsWith('/contact.html') || location.pathname === 'contact.html') {
    document.querySelectorAll('a[href="tel:+255700000000"]').forEach(link => link.replaceWith(document.createTextNode('TODO: Add verified school phone number.')));
    const deputy = [...document.querySelectorAll('.teacher-card')].find(card => /Deputy Headmaster/i.test(card.textContent));
    const deputyImage = deputy?.querySelector('img');
    if (deputyImage) {
      const avatar = document.createElement('div');
      avatar.className = 'initials-avatar contact-avatar';
      avatar.setAttribute('role', 'img');
      avatar.setAttribute('aria-label', 'Deputy Headmaster Lomitu, initials avatar');
      avatar.textContent = 'L';
      deputyImage.replaceWith(avatar);
    }
    const form = document.querySelector('.contact-form form');
    if (form && form.getAttribute('action') === '#') {
      form.insertAdjacentHTML('beforebegin', '<p>Contact form not connected yet. Please use the verified school contact details when available.</p><!-- TODO: Connect this form to a working submission endpoint. -->');
      form.addEventListener('submit', event => event.preventDefault());
    }
    if (document.querySelector('.contact-grid')) {
      document.querySelector('.contact-grid').insertAdjacentHTML('afterend', '<p>School phone: To be confirmed. School email: To be confirmed. Office hours: To be confirmed. <!-- TODO: Replace personal Gmail addresses with verified school-domain emails and confirm office hours. --></p>');
    }
  }

  if (location.pathname.endsWith('/news.html') || location.pathname === 'news.html') {
    document.querySelectorAll('.openModal').forEach(link => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'openModal';
      button.dataset.modal = link.dataset.modal;
      button.textContent = link.textContent;
      button.setAttribute('aria-haspopup', 'dialog');
      link.replaceWith(button);
      button.addEventListener('click', () => {
        const modal = document.getElementById(button.dataset.modal);
        if (modal) { modal.style.display = 'block'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); }
      });
    });
    document.querySelectorAll('.modal').forEach(modal => {
      const imgs = [...modal.querySelectorAll('img')];
      // Files are only shown when they load; hide a gallery card if none do.
      imgs.forEach(img => img.addEventListener('error', () => img.remove()));
      const checkGallery = () => {
        const card = document.querySelector(`.openModal[data-modal="${modal.id}"]`)?.closest('.news-item');
        if (card && !modal.querySelector('img')) card.hidden = true;
      };
      setTimeout(checkGallery, 600);
      modal.querySelector('.close-btn')?.addEventListener('click', () => { modal.style.display = 'none'; });
    });
    const sports = document.querySelector('#bestSportsModal');
    if (sports) sports.querySelector('.modal-content')?.insertAdjacentHTML('afterbegin', '<p><!-- TODO: This list appears to be test data because one student holds every award. Confirm before changing or publishing. --></p>');
    document.querySelectorAll('#bestSportsModal, #bestSubjectsModal').forEach(modal => modal.querySelector('.modal-content')?.insertAdjacentHTML('afterbegin', '<!-- TODO: Confirm parent/guardian consent before publishing student names. -->'));
  }
});
