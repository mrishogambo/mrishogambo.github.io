/* Shared behavior for the static school website. */
(() => {
  const initialize = () => {
    const path = location.pathname.split('/').pop() || 'index.html';
    const isPage = name => path === name;
    const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'site-fixes.css';
    document.head.appendChild(stylesheet);

    // Ensure every page has a concise search description.
    if (!document.querySelector('meta[name="description"]')) {
      const description = document.createElement('meta');
      description.name = 'description';
      description.content = `${document.title.replace(/\s*[|—-].*$/, '')} information from Mrisho Gambo Secondary School.`;
      document.head.appendChild(description);
    }

    // Mobile menu: CSS and behavior share the same .open class and button selector.
    const nav = document.querySelector('.main-nav');
    const toggle = nav?.querySelector('.nav-toggle');
    const menu = nav?.querySelector('ul');
    const setMenuOpen = open => {
      if (!toggle || !menu) return;
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };
    if (toggle && menu) {
      toggle.type = 'button';
      setMenuOpen(false);
      toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
      menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setMenuOpen(false);
      });
    }
    document.querySelectorAll('.main-nav a[href="notes.html"]').forEach(link => link.textContent = 'Notes & Exams');

    // Distinct initials avatars replace generic or unavailable staff photos.
    const initialsFor = name => name.trim().split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase() || 'S';
    const makeAvatar = (name, role, className) => {
      const avatar = document.createElement('div');
      avatar.className = `${className} initials-avatar`;
      avatar.setAttribute('role', 'img');
      avatar.setAttribute('aria-label', `${name} — ${role}`);
      avatar.textContent = initialsFor(name);
      return avatar;
    };
    document.querySelectorAll('.dept-body').forEach(body => {
      const image = body.querySelector('img');
      const nameElement = body.querySelector('h3');
      const details = body.querySelector('p');
      if (!nameElement || !details) return;
      const name = nameElement.textContent.trim();
      const oldText = details.textContent.replace(/\s+/g, ' ').trim();
      const phoneMatch = oldText.match(/\+255\s*[\d\s-]+/);
      const role = oldText.replace(/\s*[·|—-]?\s*\+255[\d\s-]+.*$/, '').trim() || 'Head of Department';
      const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ').trim().replace(/\+255\s*(\d{3})\s*(\d{3})\s*(\d{3})/, '+255 $1 $2 $3') : '';
      let portrait = image;
      if (image && /(^|\/)ok\.png$/i.test(image.getAttribute('src') || '')) {
        portrait = makeAvatar(name, role, 'dept-avatar');
      } else if (image) {
        image.alt = `${name} — ${role}`;
        image.addEventListener('error', () => image.replaceWith(makeAvatar(name, role, 'dept-avatar')), { once: true });
      } else {
        portrait = makeAvatar(name, role, 'dept-avatar');
      }
      nameElement.textContent = name;
      details.className = 'dept-role';
      details.textContent = role;
      const phoneElement = phone ? Object.assign(document.createElement('p'), { className: 'dept-phone', textContent: phone }) : null;
      body.replaceChildren(portrait, nameElement, details, ...(phoneElement ? [phoneElement] : []));
    });

    // Add useful alt text to any remaining content image that lacks it.
    document.querySelectorAll('img').forEach(image => {
      if (image.hasAttribute('alt') && image.alt.trim()) return;
      const context = image.closest('.teacher-card, .person-card, .news-item, header, section');
      const name = context?.querySelector('h2, h3, .person-role')?.textContent.trim();
      image.alt = name ? `Image related to ${name}` : 'Mrisho Gambo Secondary School';
    });

    // Use the same footer details everywhere; verified contact values are intentionally pending.
    document.querySelectorAll('.site-footer').forEach(footer => {
      footer.innerHTML = '<p>&copy; 2026 Mrisho Gambo Secondary School. All Rights Reserved.</p><p class="footer-contact">Address: To be confirmed · Phone: To be confirmed · Email: To be confirmed</p><!-- TODO: Add verified school address, general phone number and school email. -->';
    });

    // Home page content: keep dates consistent with the News page and avoid unverified upcoming events.
    if (isPage('home.html') || isPage('index.html')) {
      const count = document.querySelector('.stat-num');
      if (count) count.textContent = '12';
      const admissionLink = [...document.querySelectorAll('a.btn')].find(link => /See Admissions|Admission History/i.test(link.textContent));
      if (admissionLink) admissionLink.textContent = 'Apply Now';
      const admissionCopy = [...document.querySelectorAll('.card p')].find(p => /admission history/i.test(p.textContent));
      if (admissionCopy) admissionCopy.textContent = 'Learn how to apply to the Mrisho Gambo family.';
      const notices = document.querySelector('.notifications-box ul');
      if (notices) notices.innerHTML = '<li>End-of-Year Holidays: 25th December – 5th January.</li><li>Past event: Sports Day — 10 November 2026.</li>';
      const eventsBox = document.querySelector('.events-box');
      if (eventsBox) {
        eventsBox.querySelector('h3').textContent = 'Events';
        eventsBox.querySelector('ul').innerHTML = '<li>Past event: Sports Day — 10 November 2026.</li><!-- TODO: Confirm upcoming event dates with the school before publishing. -->';
      }
    }

    if (isPage('about.html')) {
      const main = document.querySelector('main');
      if (main) main.insertAdjacentHTML('afterbegin', '<p><!-- TODO: Confirm the school founding year and location. -->Founding year and location: to be confirmed.</p>');
      const achievements = [...document.querySelectorAll('main section')].find(section => /Our Achievements/.test(section.textContent));
      if (achievements) achievements.innerHTML = '<h2>Our Achievements</h2><p><!-- TODO: Add verified achievements and dates only. -->Achievement details to be confirmed.</p>';
      const services = [...document.querySelectorAll('main section')].find(section => /Our Services/.test(section.textContent));
      if (services) services.insertAdjacentHTML('afterbegin', '<!-- TODO: Verify claims about boarding facilities and bus services before publishing. -->');
      const strategies = [...document.querySelectorAll('main section')].find(section => /Our Strategies/.test(section.textContent));
      strategies?.querySelectorAll('li').forEach(item => {
        if (/small class sizes/i.test(item.textContent)) item.insertAdjacentHTML('beforebegin', '<!-- TODO: Verify the small-class-size claim before publishing. -->');
      });
      const deputy = [...document.querySelectorAll('.person-card')].find(card => /^Lomitu$/i.test(card.querySelector('h3')?.textContent.trim() || ''));
      if (deputy) deputy.insertAdjacentHTML('beforeend', '<!-- TODO: Confirm Deputy Headmaster surname. -->');
    }

    if (isPage('departments.html')) {
      const subtitle = document.querySelector('.page-subtitle');
      if (subtitle) subtitle.textContent = subtitle.textContent.replace('academic,administrative', 'academic, administrative').replace('students prefects', 'student prefects');
      // TODO: Ask the site owner to confirm Abu Salim's two department assignments before changing either listing.
      const prefectTable = document.querySelector('table');
      if (prefectTable && [...prefectTable.querySelectorAll('tbody tr')].every(row => /^[-—\s]*$/.test(row.cells[1]?.textContent || ''))) {
        const wrapper = prefectTable.closest('.table-wrap');
        if (wrapper) wrapper.hidden = true;
        const section = prefectTable.closest('section');
        const heading = section?.querySelector('h2');
        if (heading) heading.textContent = 'Student Government';
        const note = document.createElement('p');
        note.textContent = 'Current student prefect names and year to be confirmed.';
        note.insertAdjacentHTML('beforeend', '<!-- TODO: Add current year and prefect names when supplied. -->');
        wrapper?.after(note);
      }
      const phoneTodo = document.createElement('p');
      phoneTodo.className = 'staff-phone-todo';
      phoneTodo.innerHTML = '<!-- TODO: Confirm staff consent to publishing their phone numbers. -->';
      document.querySelector('main')?.append(phoneTodo);
    }

    if (isPage('results.html')) {
      const table = document.querySelector('.results-table');
      const cells = table ? [...table.querySelectorAll('tbody td')] : [];
      if (table && cells.length && cells.every(cell => /^[-—\s]*$/.test(cell.textContent))) {
        table.replaceWith(Object.assign(document.createElement('p'), { textContent: 'Results will be published after the official NECTA release.' }));
      }
      document.querySelectorAll('main p').forEach(p => {
        p.textContent = p.textContent.replace(/report also from\s+.*?specifically overalled/gi, 'report from the official NECTA results portal, following the instructions provided by NECTA.');
      });
    }

    if (isPage('news.html')) {
      document.querySelector('.eyebrow')?.replaceChildren(document.createTextNode('School updates'));
      document.querySelectorAll('main p').forEach(p => {
        p.textContent = p.textContent.replace(/evey/gi, 'every').replace(/^view the best/i, 'View the best');
      });
      // Use buttons rather than placeholder links, and keep the modal keyboard-operable.
      document.querySelectorAll('.openModal').forEach(link => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'openModal';
        button.dataset.modal = link.dataset.modal;
        button.textContent = link.textContent;
        button.setAttribute('aria-haspopup', 'dialog');
        link.replaceWith(button);
      });
      // Image galleries currently reuse the same files; hide them until unique approved photos are supplied.
      document.querySelectorAll('.modal').forEach(modal => {
        const hasPhotos = modal.querySelector('img');
        if (hasPhotos) {
          modal.hidden = true;
          const card = document.querySelector(`.openModal[data-modal="${modal.id}"]`)?.closest('.news-item');
          if (card) card.hidden = true;
          return;
        }
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.querySelector('.close-btn')?.addEventListener('click', () => { modal.style.display = 'none'; });
      });
      document.querySelectorAll('.openModal').forEach(button => button.addEventListener('click', () => {
        const modal = document.getElementById(button.dataset.modal);
        if (!modal || modal.hidden) return;
        modal.style.display = 'block';
        modal.querySelector('.close-btn')?.focus();
      }));
      document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', event => { if (event.target === modal) modal.style.display = 'none'; });
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') document.querySelectorAll('.modal').forEach(modal => { modal.style.display = 'none'; });
      });
      document.querySelectorAll('#bestSubjectsModal .modal-content, #bestSportsModal .modal-content').forEach(content => {
        content.insertAdjacentHTML('afterbegin', '<!-- TODO: Confirm parent/guardian consent before publishing student names. -->');
      });
      const sports = document.querySelector('#bestSportsModal .modal-content');
      if (sports) sports.insertAdjacentHTML('afterbegin', '<p><!-- TODO: The Best Students in Sports list appears to be test data because one student holds every award. Confirm before changing or publishing. --></p>');
    }

    if (isPage('notes.html')) {
      const title = document.querySelector('main .page-title');
      if (title) title.textContent = 'Notes & Exams';
      const intro = document.querySelector('main .page-subtitle');
      if (intro) intro.textContent = `${intro.textContent.trim()} These materials are external resources; check each provider for accuracy and availability.`;
      const notesSection = [...document.querySelectorAll('main section')].find(section => /Studying materials/i.test(section.textContent));
      if (notesSection) notesSection.insertAdjacentHTML('beforeend', '<p class="materials-todo"><!-- TODO: Add notes for Geography, Literature in English, Business Studies and Bookkeeping. -->Notes still needed: Geography, Literature in English, Business Studies and Bookkeeping.</p>');
    }

    if (isPage('contact.html')) {
      document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        if (/\+255\s*700\s*000\s*000/.test(link.textContent) || /700000000/.test(link.getAttribute('href') || '')) {
          link.replaceWith(document.createTextNode('Phone number to be confirmed.'));
        }
      });
      document.querySelectorAll('.teacher-card').forEach(card => {
        const deputy = /Deputy Headmaster/i.test(card.textContent);
        const img = card.querySelector('img');
        if (deputy && img) img.replaceWith(makeAvatar('Lomitu', 'Deputy Headmaster', 'teacher-photo'));
        card.querySelectorAll('a[href^="mailto:"]').forEach(email => {
          if (/gmail\.com$/i.test(email.getAttribute('href') || '')) email.insertAdjacentHTML('afterend', ' <!-- TODO: Replace personal Gmail address with a verified school-domain email. -->');
        });
      });
      const contactInfo = document.querySelector('.contact-grid');
      if (contactInfo && !document.querySelector('.general-contact')) {
        contactInfo.insertAdjacentHTML('afterend', '<p class="general-contact">General school phone: To be confirmed. General school email: To be confirmed. Office hours: To be confirmed. <!-- TODO: Add verified school phone, email and office hours; replace personal Gmail addresses with school-domain emails. --></p>');
      }
      const form = document.querySelector('.contact-form form');
      if (form && form.getAttribute('action') === '#') {
        form.insertAdjacentHTML('beforebegin', '<p class="form-status">This form is not connected yet and cannot send messages. <!-- TODO: Connect the form to a working submission endpoint. --></p>');
        form.addEventListener('submit', event => event.preventDefault());
      }
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
