const AUTH_KEY='smash-burger-admin-access';
if(location.pathname.endsWith('admin.html')&&!sessionStorage.getItem(AUTH_KEY))location.replace('staff-access.html');
const form=document.querySelector('#login-form');
if(form)form.addEventListener('submit',event=>{event.preventDefault();if(document.querySelector('#staff-pin').value==='2026'){sessionStorage.setItem(AUTH_KEY,'true');location.href='admin.html'}else document.querySelector('#error').textContent='رمز الدخول غير صحيح';});
