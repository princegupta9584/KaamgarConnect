<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Dashboard | KaamgarConnect</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <style>
        /* Dashboard Specific Emergency Fix */
        .dashboard-wrapper {
            display: flex;
            gap: 30px;
            max-width: 1300px;
            margin: 0 auto;
            padding: 140px 20px 50px;
        }
        .sidebar {
            width: 300px;
            background: var(--glass);
            border: 1px solid var(--glass-border);
            border-radius: 30px;
            padding: 40px 20px;
            height: fit-content;
            flex-shrink: 0;
        }
        .side-nav {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 30px;
        }
        .side-nav a {
            text-decoration: none;
            color: var(--text-dim);
            padding: 12px 20px;
            border-radius: 12px;
            transition: 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .side-nav a:hover, .side-nav a.active {
            background: var(--accent);
            color: white;
        }
        .dash-content {
            flex-grow: 1;
        }
        .stats-mini {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .mini-card {
            background: var(--glass);
            border: 1px solid var(--glass-border);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
        }
        @media (max-width: 900px) {
            .dashboard-wrapper { flex-direction: column; padding-top: 180px; }
            .sidebar { width: 100%; }
        }
    </style>
</head>
<body class="sub-page">

    <header>
        <div class="nav-container">
            <div class="logo">
                <span class="logo-icon">🧰</span>
                <strong>Kaamgar<span>Connect</span></strong>
            </div>
            <nav id="mainNav">
                <a href="index.html" class="nav-link">Home</a>
                <a href="jobs.html" class="nav-link">Jobs</a>
                <a href="workers.html" class="nav-link">Workers</a>
                <a href="index.html#developers" class="nav-link">Team</a>
                <a href="index.html#contact" class="nav-link">Contact</a>
            </nav>
            <div class="auth-wrapper">
                <div id="userLinks" style="display: flex; align-items: center; gap: 20px;">
                    <div class="user-info-mini" style="text-align: right;">
                        <span id="welcomeUser" style="display: block; font-weight: 800; color: var(--accent);"></span>
                        <small id="userRoleBadge" style="color: var(--text-dim); font-size: 10px; text-transform: uppercase;"></small>
                    </div>
                    <div class="profile-circle" style="background: var(--accent); border: 2px solid white;">
                        <i class="fa-solid fa-chart-pie" style="color: white;"></i>
                    </div>
                    <button onclick="logout()" class="btn-logout" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size: 1.2rem;"><i class="fa-solid fa-power-off"></i></button>
                </div>
            </div>
        </div>
    </header>

    <div class="dashboard-wrapper">
        <aside class="sidebar">
            <div class="user-profile" style="text-align: center;">
                <img src="" id="dashImg" alt="User" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--accent); margin-bottom: 15px;">
                <h3 id="dashName" style="font-size: 1.2rem; color: white;">User Name</h3>
                <span id="userRoleDisplay" style="font-size: 0.8rem; color: var(--accent); font-weight: 800;">VERIFIED ACCOUNT</span>
            </div>
            <nav class="side-nav">
                <a href="#" class="active"><i class="fa fa-th-large"></i> Overview</a>
                <a href="#"><i class="fa fa-user"></i> Profile Settings</a>
                <a href="#"><i class="fa fa-history"></i> My History</a>
                <a href="#"><i class="fa fa-star"></i> My Ratings</a>
                <a href="#" onclick="logout()" style="color: #ff4d4d;"><i class="fa fa-sign-out"></i> Logout</a>
            </nav>
        </aside>

        <main class="dash-content">
            <div class="section-title" style="text-align: left; margin-bottom: 30px;">
                <span style="color: var(--accent); font-weight: 800;">USER PANEL</span>
                <h2 style="font-size: 2.5rem; margin-top: 10px;">Welcome Back!</h2>
                <p style="color: var(--text-dim);">Aapka account overview aur activity yahan hai.</p>
            </div>
            
            <div class="stats-mini">
                <div class="mini-card">
                    <i class="fa fa-bolt" style="color: var(--accent); font-size: 1.5rem; margin-bottom: 10px;"></i>
                    <h4 style="color: var(--text-dim); font-size: 0.9rem;">Total Activity</h4>
                    <p id="activityCount" style="font-size: 2.5rem; font-weight: 800; color: var(--accent);">0</p>
                </div>
                <div class="mini-card">
                    <i class="fa fa-star" style="color: #ffcc00; font-size: 1.5rem; margin-bottom: 10px;"></i>
                    <h4 style="color: var(--text-dim); font-size: 0.9rem;">Avg. Rating</h4>
                    <p style="font-size: 2.5rem; font-weight: 800; color: #ffcc00;">4.8</p>
                </div>
            </div>

            <div id="myJobsSection" style="display: none;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--glass-border); padding-bottom: 15px;">
                    <h3>Manage Your Jobs</h3>
                    <button class="btn-primary" onclick="window.location.href='index.html'" style="height: 40px; padding: 0 20px;">+ New Job</button>
                </div>
                <div id="myJobsList" class="jobs-grid">
                    <p style="color: var(--text-dim);">Loading your jobs...</p>
                </div>
            </div>

            <div id="workerDashboard" style="display: none;">
                <div style="padding: 60px; border: 2px dashed var(--glass-border); border-radius: 30px; text-align: center; background: var(--glass);">
                    <i class="fa-solid fa-screwdriver-wrench" style="font-size: 4rem; color: var(--accent); margin-bottom: 20px; opacity: 0.6;"></i>
                    <h3>Professional Dashboard</h3>
                    <p style="color: var(--text-dim); margin: 15px 0;">Bhai, naye kaam dhoondhne ke liye Jobs section mein jayein.</p>
                    <button class="btn-primary" onclick="window.location.href='jobs.html'">Browse Jobs</button>
                </div>
            </div>
        </main>
    </div>

    <script src="script.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if(user) {
                document.getElementById('dashName').innerText = user.name;
                document.getElementById('welcomeUser').innerText = user.name;
                document.getElementById('userRoleBadge').innerText = user.role;
                document.getElementById('userRoleDisplay').innerText = user.role.toUpperCase() + " ACCOUNT";
                document.getElementById('dashImg').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff7a1a&color=fff`;

                if(user.role.toLowerCase() === 'worker') {
                    document.getElementById('workerDashboard').style.display = 'block';
                    document.getElementById('myJobsSection').style.display = 'none';
                } else {
                    document.getElementById('myJobsSection').style.display = 'block';
                    document.getElementById('workerDashboard').style.display = 'none';
                }
            } else {
                window.location.href = 'index.html';
            }
        });

        function logout() {
            localStorage.removeItem('user');
            window.location.href = "index.html";
        }
    </script>
</body>
</html>
