// Attach ripple on click and follow-cursor highlight on hover for .btn
(function(){
  const buttons = document.querySelectorAll('.btn');
  if(!buttons.length) return;

  buttons.forEach(btn => {
    // update CSS vars for cursor position
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mx', x + '%');
      btn.style.setProperty('--my', y + '%');
    });

    // ripple on mousedown
    btn.addEventListener('pointerdown', e => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 0.9;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(ripple);
      // remove after animation
      ripple.addEventListener('animationend', () => ripple.remove());
    });

    // accessibility: remove lingering ripples on pointerup outside
    btn.addEventListener('pointerup', ()=>{
      const rip = btn.querySelectorAll('.ripple');
      rip.forEach(r=>r.remove());
    });
  });
})();
