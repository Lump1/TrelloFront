import '/.styles.css'

document.addEventListener("click", function(e) {
  let t = document.getElementById('sidenav-button-temlates-menu-js');
  if (e.target.id != 'sidenav-button-temlates-js' && e.target.id != 'sidenav-button-temlates-menu-js') {
    t.style.display = 'none';
  } else if (e.target.id == 'sidenav-button-temlates-js') {
    t.style.display = (t.style.display != 'block') ? 'block' : 'none';
  }
});


document.addEventListener("click", function(e) {
  let w = document.getElementById('sidenav-button-bIerps-js');
  if (e.target.id != 'sidenav-button-Ws-js' && e.target.id != 'sidenav-button-bIerps-js') {
    w.style.display = 'none';
  } else if (e.target.id == 'sidenav-button-Ws-js') {
    w.style.display = (w.style.display != 'block') ? 'block' : 'none';
  }
});
