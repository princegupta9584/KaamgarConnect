function closeM(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

document.addEventListener('click', (e) => {
    if (e.target.closest('#openLogin')) {
        document.getElementById('loginModal').style.display = 'block';
    }
    if (e.target.closest('#openReg')) {
        document.getElementById('regModal').style.display = 'block';
    }
    if (e.target.closest('#postJobBtn')) {
        document.getElementById('jobModal').style.display = 'block';
    }
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const guestLinks = document.getElementById('guestLinks');
    const userLinks = document.getElementById('userLinks');
    const welcomeUser = document.getElementById('welcomeUser');
    const userRoleBadge = document.getElementById('userRoleBadge');
    const postJobBtn = document.getElementById('postJobBtn');

    if (user) {
        if (guestLinks) guestLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        
        if (welcomeUser) welcomeUser.innerText = user.name.split(' ')[0];
        if (userRoleBadge) userRoleBadge.innerText = user.role;

        if (postJobBtn) {
            if (user.role.toLowerCase() === 'customer') {
                postJobBtn.style.display = 'inline-block';
            } else {
                postJobBtn.style.display = 'none';
            }
        }
    } else {
        if (guestLinks) guestLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
        if (postJobBtn) postJobBtn.style.display = 'none';
    }
}

function handleNavHighlight() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (page === href || (page === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

let coords = { lat: null, lng: null };
const getLocBtn = document.getElementById('getLoc');
if (getLocBtn) {
    getLocBtn.onclick = () => {
        const status = document.getElementById('locStatus');
        status.innerText = "Scanning...";
        navigator.geolocation.getCurrentPosition(p => {
            coords.lat = p.coords.latitude;
            coords.lng = p.coords.longitude;
            status.innerText = "✅ Location Locked";
            status.style.color = "#25D366";
        }, () => {
            status.innerText = "❌ Denied";
            alert("Please allow location access to register.");
        });
    };
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            loginId: document.getElementById('lId').value,
            password: document.getElementById('lPass').value
        };
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = "index.html"; 
            } else {
                alert(data.error);
            }
        } catch (err) { alert("Login failed."); }
    };
}

const regForm = document.getElementById('regForm');
if (regForm) {
    regForm.onsubmit = async (e) => {
        e.preventDefault();
        if (!coords.lat) return alert("Pehle location lock karein!");
        const payload = {
            name: document.getElementById('rName').value,
            mobile: document.getElementById('rMob').value,
            aadhaar: document.getElementById('rAad').value,
            password: document.getElementById('rPass').value,
            address: document.getElementById('rAddr').value,
            role: document.getElementById('rRole').value,
            lat: coords.lat, lng: coords.lng
        };
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("Registration Success! Logging you in...");
                const logRes = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ loginId: payload.mobile, password: payload.password })
                });
                const logData = await logRes.json();
                localStorage.setItem('user', JSON.stringify(logData.user));
                window.location.href = "index.html";
            } else {
                const d = await res.json();
                alert(d.error);
            }
        } catch (err) { alert("Registration failed."); }
    };
}

const jobForm = document.getElementById('jobForm');
if (jobForm) {
    jobForm.onsubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const payload = {
            customerId: user._id,
            customerName: user.name,
            customerMobile: user.mobile, 
            title: document.getElementById('jTitle').value,
            description: document.getElementById('jDesc').value,
            budget: document.getElementById('jBudget').value,
            category: document.getElementById('jCat').value,
            location: user.address || "Bhopal"
        };
        const res = await fetch('/api/post-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert("Job Posted!");
            location.reload();
        }
    };
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('cName').value,
            email: document.getElementById('cEmail').value,
            message: document.getElementById('cMsg').value
        };
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert("Message sent to Prince & Team! We will contact you soon.");
            contactForm.reset();
        }
    };
}

async function updateLiveStats() {
    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();
        if(document.getElementById('statUsers')) document.getElementById('statUsers').innerText = stats.totalUsers;
        if(document.getElementById('statActive')) document.getElementById('statActive').innerText = stats.activeJobs;
        if(document.getElementById('statDone')) document.getElementById('statDone').innerText = stats.completedJobs;
    } catch (err) { console.log("Stats failed"); }
}

function initGSAP() {
    if(typeof gsap !== 'undefined') {
        gsap.from(".reveal-text", { y: 80, opacity: 0, duration: 1, ease: "power3.out" });
        gsap.from(".fade-in", { opacity: 0, y: 30, duration: 1, delay: 0.5, stagger: 0.2 });
    }
}

async function loadAllJobs() {
    const feed = document.getElementById('jobsFeed');
    if (!feed) return;
    const res = await fetch('/api/all-jobs');
    const jobs = await res.json();
    feed.innerHTML = jobs.length === 0 ? '<p style="text-align:center; color:#94a3b8;">No jobs found.</p>' : '';
    
    jobs.forEach(j => {
        const waMsg = encodeURIComponent(`Hi ${j.customerName}, I am interested in: ${j.title}`);
        feed.innerHTML += `
            <div class="job-card" style="border:1px solid rgba(255,255,255,0.1); padding:20px; border-radius:15px; background:rgba(255,255,255,0.03); margin-bottom:15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="color:#ff7a1a; margin:0;">${j.title}</h3>
                    <span style="font-size:12px; background:rgba(255,255,255,0.1); padding:4px 10px; border-radius:5px;">${j.category.toUpperCase()}</span>
                </div>
                <p style="margin:10px 0; color:#94a3b8;">${j.description}</p>
                <div style="display:flex; justify-content:space-between; font-weight:bold; margin-top:10px; color:#f8fafc;">
                    <span>💰 ₹${j.budget}</span>
                    <span>📍 ${j.location}</span>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <a href="https://wa.me/91${j.customerMobile}?text=${waMsg}" target="_blank" class="btn-primary" style="flex:1; text-align:center; text-decoration:none; padding:10px; border-radius:8px;">WhatsApp</a>
                    <a href="tel:${j.customerMobile}" class="btn-glass" style="flex:1; text-align:center; text-decoration:none; padding:10px; border-radius:8px;">Call</a>
                </div>
            </div>`;
    });
}

async function loadNearbyWorkers() {
    const list = document.getElementById('workersList');
    if (!list) return;
    const res = await fetch('/api/workers-near-me');
    const workers = await res.json();
    list.innerHTML = workers.length === 0 ? '<p style="text-align:center; color:#94a3b8;">No workers found.</p>' : '';
    workers.forEach(w => {
        const stars = "⭐".repeat(Math.round(w.rating || 5));
        list.innerHTML += `
            <div class="worker-card" style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:20px; border-radius:15px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
                <div>
                    <h3 style="margin:0;">${w.name}</h3>
                    <p style="color:#ff7a1a; font-weight:bold; margin:5px 0;">${w.role.toUpperCase()} | ${stars}</p>
                    <p style="font-size:12px; color:#94a3b8;">Verified Professional</p>
                </div>
                <button class="btn-primary" onclick="window.location.href='tel:${w.mobile}'">Hire Now</button>
            </div>`;
    });
}

async function setupDashboard() {
    const dashName = document.getElementById('dashName');
    const myJobsList = document.getElementById('myJobsList');
    if (!dashName) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { window.location.href = "index.html"; return; }

    dashName.innerText = user.name;
    const userRole = document.getElementById('userRole');
    if(userRole) userRole.innerText = user.role.toUpperCase();

    if (user.role === 'customer') {
        const section = document.getElementById('myJobsSection');
        if(section) section.style.display = 'block';
        const res = await fetch('/api/all-jobs');
        const allJobs = await res.json();
        const myJobs = allJobs.filter(j => j.customerId === user._id);
        
        if(myJobsList) {
            myJobsList.innerHTML = myJobs.map(j => `
                <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:15px; border:1px solid rgba(255,255,255,0.1); margin-bottom:15px;">
                    <h4 style="color:#ff7a1a; margin-top:0;">${j.title}</h4>
                    <p style="font-size:14px; color:#94a3b8;">Budget: ₹${j.budget}</p>
                    <button onclick="deleteJob('${j._id}')" style="background:rgba(255,77,77,0.1); color:#ff4d4d; border:1px solid #ff4d4d; padding:8px; border-radius:5px; cursor:pointer; width:100%; margin-top:10px;">
                        Delete Request
                    </button>
                </div>`).join('');
        }
    }
}

async function deleteJob(id) {
    if(!confirm("Kya aap ise hatana chahte hain?")) return;
    const res = await fetch(`/api/delete-job/${id}`, { method: 'DELETE' });
    if(res.ok) { alert("Deleted!"); setupDashboard(); }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateLiveStats();
    initGSAP();
    loadNearbyWorkers();
    loadAllJobs();
    setupDashboard();
    handleNavHighlight();
});