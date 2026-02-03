// API Base URL
const API_URL = 'http://localhost:4000';

// ตรวจสอบ token เมื่อโหลดหน้า
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        // ถ้ามี token ให้ไปหน้า profile
        loadProfile();
    }
});

// แสดงหน้าต่างๆ
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// แสดงข้อความ
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    // ซ่อนข้อความหลัง 5 วินาที
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// ลงทะเบียน
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    const tel = document.getElementById('register-tel').value;
    
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'กำลังลงทะเบียน...';
    
    try {
        const response = await fetch(`${API_URL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name, tel }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('register-message', 'ลงทะเบียนสำเร็จ! กำลังเข้าสู่ระบบ...', 'success');
            
            // รอ 1 วินาที แล้วไปหน้า login
            setTimeout(() => {
                document.getElementById('login-email').value = email;
                document.getElementById('login-password').value = password;
                showPage('login-page');
                e.target.reset();
            }, 1000);
        } else {
            const errorMsg = data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน';
            showMessage('register-message', Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg, 'error');
        }
    } catch (error) {
        showMessage('register-message', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
        console.error('Error:', error);
    } finally {
        btn.disabled = false;
        btn.textContent = 'ลงทะเบียน';
    }
});

// เข้าสู่ระบบ
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'กำลังเข้าสู่ระบบ...';
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // บันทึก token
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_email', email);
            
            showMessage('login-message', 'เข้าสู่ระบบสำเร็จ!', 'success');
            
            // รอ 500ms แล้วไปหน้า profile
            setTimeout(() => {
                loadProfile();
                e.target.reset();
            }, 500);
        } else {
            const errorMsg = data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
            showMessage('login-message', errorMsg, 'error');
        }
    } catch (error) {
        showMessage('login-message', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
        console.error('Error:', error);
    } finally {
        btn.disabled = false;
        btn.textContent = 'เข้าสู่ระบบ';
    }
});

// โหลดข้อมูล profile
async function loadProfile() {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
        showPage('login-page');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // แสดงข้อมูล
            document.getElementById('user-email').textContent = data.email;
            document.getElementById('user-token').textContent = token;
            
            showPage('profile-page');
        } else {
            // Token ไม่ถูกต้องหรือหมดอายุ
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_email');
            showPage('login-page');
            showMessage('login-message', 'กรุณาเข้าสู่ระบบอีกครั้ง', 'error');
        }
    } catch (error) {
        showMessage('profile-message', 'ไม่สามารถโหลดข้อมูลได้', 'error');
        console.error('Error:', error);
    }
}

// ออกจากระบบ
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    showPage('login-page');
    showMessage('login-message', 'ออกจากระบบสำเร็จ', 'success');
}
