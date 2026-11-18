
/* ==========================================
   TRUSTSERVE - COMPLETE FRONTEND JAVASCRIPT
   Spring Boot + Spring Security + H2
========================================== */

const SERVICES = [
    {
        id: 'cleaning',
        name: 'Home Cleaning',
        icon: '🧹',
        desc: 'Deep cleaning, kitchen, bathroom and full-home care.',
        base: 799
    },
    {
        id: 'plumbing',
        name: 'Plumbing',
        icon: '🔧',
        desc: 'Tap repairs, leak fixes, fittings and pipe work.',
        base: 399
    },
    {
        id: 'electrical',
        name: 'Electrical Work',
        icon: '⚡',
        desc: 'Safe installation, wiring checks and electrical repairs.',
        base: 499
    },
    {
        id: 'tutoring',
        name: 'Tutoring',
        icon: '📚',
        desc: 'Personal learning support from subject tutors.',
        base: 599
    }
];

const $ = id => document.getElementById(id);

const get = key =>
    JSON.parse(localStorage.getItem('ts_' + key) || '[]');

const set = (key, value) =>
    localStorage.setItem('ts_' + key, JSON.stringify(value));

https://trustserve-r0vq.onrender.com/api/auth/login
let selectedService = 'cleaning';

let currentUser =
    JSON.parse(localStorage.getItem('ts_user') || 'null');


/* ==========================================
   COMMON FUNCTIONS
========================================== */

function toast(message) {
    const element = $('toast');

    if (!element) return;

    element.textContent = message;
    element.classList.add('show');

    setTimeout(() => {
        element.classList.remove('show');
    }, 2600);
}

function serviceById(id) {
    return SERVICES.find(service => service.id === id) || SERVICES[0];
}

function fillSelect(id) {
    const element = $(id);

    if (!element) return;

    element.innerHTML = SERVICES.map(service =>
        `<option value="${service.id}">${service.name}</option>`
    ).join('');
}

function price(id, size = 1, urgency = 1) {
    const base =
        serviceById(id).base *
        Number(size) *
        Number(urgency);

    return [
        Math.round(base * 0.9 / 10) * 10,
        Math.round(base * 1.2 / 10) * 10
    ];
}

function updatePrice() {
    if (!$('priceService') || !$('jobSize') ||
        !$('urgency') || !$('priceBand')) return;

    const [low, high] = price(
        $('priceService').value,
        $('jobSize').value,
        $('urgency').value
    );

    $('priceBand').textContent =
        `₹ ${low.toLocaleString('en-IN')} – ₹ ${high.toLocaleString('en-IN')}`;
}

function updateGroup() {
    if (!$('groupService') || !$('groupEstimate') || !$('homes')) return;

    const [low, high] = price($('groupService').value);

    $('groupEstimate').textContent =
        `₹ ${Math.round(low * 0.85).toLocaleString('en-IN')} – ₹ ${Math.round(high * 0.85).toLocaleString('en-IN')}`;
}

function renderServices() {
    if (!$('serviceGrid')) return;

    $('serviceGrid').innerHTML = SERVICES.map(service => `
        <article class="service-card">
            <div class="service-icon">${service.icon}</div>
            <h3>${service.name}</h3>
            <p>${service.desc}</p>
            <div class="price">Starting from ₹${service.base}</div>
            <button class="btn btn-light"
                onclick="openBooking('${service.id}')">
                Book service →
            </button>
        </article>
    `).join('');
}

function openModal(html) {
    if (!$('modalContent') || !$('modalBackdrop')) return;

    $('modalContent').innerHTML = html;
    $('modalBackdrop').classList.add('open');
}

function closeModal() {
    if ($('modalBackdrop')) {
        $('modalBackdrop').classList.remove('open');
    }
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}


/* ==========================================
   USER ACCOUNT
========================================== */

function updateAccountButton() {
    if (!$('loginBtn')) return;

    $('loginBtn').textContent = currentUser
        ? (currentUser.role === 'ADMIN'
            ? 'Admin Account'
            : 'My Account')
        : 'Login';
}

function saveCurrentUser(user) {
    currentUser = {
        name: user.name,
        email: user.email,
        role: user.role
    };

    // Only profile information is stored locally.
    // Passwords and authentication sessions are not stored here.

    localStorage.setItem(
        'ts_user',
        JSON.stringify(currentUser)
    );

    updateAccountButton();
}

function clearCurrentUser() {
    currentUser = null;

    localStorage.removeItem('ts_user');

    updateAccountButton();
}


/* ==========================================
   CUSTOMER LOGIN AND REGISTRATION
========================================== */

async function auth(mode = 'login') {

    openModal(mode === 'login' ? `
        <h2>Welcome back</h2>
        <p>Sign in to your TrustServe account.</p>

        <form id="authForm">

            <label>
                Email
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com">
            </label>

            <label>
                Password
                <input
                    type="password"
                    name="password"
                    required
                    minlength="8"
                    placeholder="Your password">
            </label>

            <button class="btn btn-primary" type="submit">
                Login
            </button>

            <p>
                New here?
                <a href="#" id="switchAuth">
                    Create an account
                </a>
            </p>

        </form>
    ` : `
        <h2>Create your account</h2>
        <p>Join TrustServe to manage your service bookings.</p>

        <form id="authForm">

            <label>
                Full name
                <input name="name" required>
            </label>

            <label>
                Email
                <input type="email" name="email" required>
            </label>

            <label>
                Mobile
                <input
                    name="phone"
                    pattern="[0-9]{10}"
                    required
                    placeholder="10-digit number">
            </label>

            <label>
                Password
                <input
                    type="password"
                    name="password"
                    minlength="8"
                    required>
            </label>

            <button class="btn btn-primary" type="submit">
                Create account
            </button>

            <p>
                Already registered?
                <a href="#" id="switchAuth">Login</a>
            </p>

        </form>
    `);

    $('authForm').addEventListener('submit', async event => {

        event.preventDefault();

        const data = Object.fromEntries(
            new FormData(event.target)
        );

        try {

            // CUSTOMER REGISTRATION

            if (mode === 'register') {

                const registerResponse = await fetch(
                    `${API_BASE}/auth/register`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: data.name,
                            email: data.email,
                            password: data.password
                        })
                    }
                );

                const registerResult =
                    await registerResponse.json();

                if (!registerResponse.ok) {
                    throw new Error(
                        registerResult.message ||
                        'Registration failed'
                    );
                }
            }

            // CUSTOMER / ADMIN LOGIN

            const loginResponse = await fetch(
                `${API_BASE}/auth/login`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password
                    })
                }
            );

            const loginResult =
                await loginResponse.json();

            if (!loginResponse.ok) {
                throw new Error(
                    loginResult.message || 'Login failed'
                );
            }

            saveCurrentUser(loginResult);

            closeModal();

            toast(
                `Welcome to TrustServe, ${currentUser.name}!`
            );

        } catch (error) {

            console.error('Authentication error:', error);

            toast(error.message || 'Authentication failed');

        }
    });

    $('switchAuth').addEventListener('click', event => {

        event.preventDefault();

        auth(mode === 'login' ? 'register' : 'login');

    });
}


/* ==========================================
   ACCOUNT MENU AND LOGOUT
========================================== */

function accountMenu() {

    if (!currentUser) {
        auth('login');
        return;
    }

    openModal(`
        <h2>My Account</h2>

        <p><b>${escapeHTML(currentUser.name)}</b></p>

        <p>${escapeHTML(currentUser.email)}</p>

        <p>Role: ${escapeHTML(currentUser.role)}</p>

        ${currentUser.role === 'ADMIN'
            ? `<button class="btn btn-light" id="accountAdmin">
                Admin Dashboard
               </button>`
            : `<button class="btn btn-light" id="accountBookings">
                My Bookings
               </button>`
        }

        <button class="btn btn-primary" id="logoutBtn">
            Logout
        </button>
    `);

    if ($('accountBookings')) {
        $('accountBookings').onclick = bookings;
    }

    if ($('accountAdmin')) {
        $('accountAdmin').onclick = admin;
    }

    $('logoutBtn').onclick = logout;
}

async function logout() {

    try {

        const response = await fetch(
            `${API_BASE}/auth/logout`,
            {
                method: 'POST',
                credentials: 'include'
            }
        );

        if (!response.ok) {
            throw new Error('Logout request failed');
        }

        clearCurrentUser();

        closeModal();

        toast('You have been logged out.');

    } catch (error) {

        console.error('Logout error:', error);

        toast('Unable to log out. Check your backend.');

    }
}


/* ==========================================
   CUSTOMER BOOKING
========================================== */

async function openBooking(id) {

    if (!currentUser || currentUser.role !== 'CUSTOMER') {

        toast('Please log in with a customer account.');

        auth('login');

        return;
    }

    selectedService = id;

    const service = serviceById(id);

    openModal(`
        <h2>Book ${service.name}</h2>

        <p>Your booking request will be saved in the TrustServe database.</p>

        <form id="bookingForm">

            <div class="form-grid">

                <label class="full">
                    Full name
                    <input
                        name="name"
                        required
                        value="${escapeHTML(currentUser.name)}">
                </label>

                <label class="full">
                    Email address
                    <input
                        type="email"
                        name="email"
                        required
                        value="${escapeHTML(currentUser.email)}"
                        readonly>
                </label>

                <label>
                    Mobile number
                    <input
                        name="phone"
                        required
                        pattern="[0-9]{10}"
                        placeholder="10-digit number">
                </label>

                <label>
                    Preferred date
                    <input
                        name="date"
                        type="date"
                        required
                        min="${new Date().toISOString().slice(0, 10)}">
                </label>

                <label class="full">
                    Address
                    <input
                        name="address"
                        required
                        placeholder="House / flat, society, area">
                </label>

                <label class="full">
                    Describe the work
                    <textarea
                        name="details"
                        rows="3"
                        placeholder="Tell us what needs to be done">
                    </textarea>
                </label>

            </div>

            <div class="notice">
                Indicative estimate:
                ₹${price(id)[0]} – ₹${price(id)[1]}.
                Final price is confirmed after job review.
            </div>

            <button class="btn btn-primary" type="submit">
                Confirm Booking
            </button>

        </form>
    `);

    $('bookingForm').addEventListener('submit', async event => {

        event.preventDefault();

        const data = Object.fromEntries(
            new FormData(event.target)
        );

        const bookingData = {

            customerName: data.name,

            email: currentUser.email,

            phone: data.phone,

            service: service.name,

            address: data.address,

            preferredDate: data.date,

            details: data.details

        };

        try {

            const response = await fetch(
                `${API_BASE}/bookings`,
                {
                    method: 'POST',

                    credentials: 'include',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(bookingData)
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                throw new Error(
                    errorText || `Booking failed (${response.status})`
                );
            }

            const savedBooking = await response.json();

            closeModal();

            toast(
                `Booking successfully saved! ID: ${savedBooking.id}`
            );

        } catch (error) {

            console.error('Booking error:', error);

            toast('Booking failed: ' + error.message);

        }

    });
}


/* ==========================================
   MY BOOKINGS - CUSTOMER
========================================== */

async function bookings() {

    if (!currentUser || currentUser.role !== 'CUSTOMER') {

        auth('login');

        return;
    }

    openModal(`
        <h2>My Bookings</h2>
        <p>Loading your booking history...</p>
    `);

    try {

        const response = await fetch(
            `${API_BASE}/bookings/my`,
            {
                method: 'GET',
                credentials: 'include'
            }
        );

        if (!response.ok) {

            throw new Error(
                `Unable to fetch bookings (${response.status})`
            );

        }

        const myBookings = await response.json();

        $('modalContent').innerHTML = `
            <h2>My Bookings</h2>

            <p>Your service booking history.</p>

            ${myBookings.length > 0

                ? myBookings.map(booking => `

                    <div class="notice">

                        <h3>${escapeHTML(booking.service)}</h3>

                        <p>
                            <b>Booking ID:</b>
                            #${escapeHTML(booking.id)}
                        </p>

                        <p>
                            <b>Name:</b>
                            ${escapeHTML(booking.customerName)}
                        </p>

                        <p>
                            <b>Date:</b>
                            ${escapeHTML(booking.preferredDate)}
                        </p>

                        <p>
                            <b>Status:</b>
                            ${escapeHTML(booking.status)}
                        </p>

                    </div>

                `).join('')

                : `<div class="notice">
                    You have no bookings yet.
                   </div>`

            }

            <button class="btn btn-light" onclick="closeModal()">
                Close
            </button>
        `;

    } catch (error) {

        console.error('My Bookings Error:', error);

        $('modalContent').innerHTML = `
            <h2>My Bookings</h2>

            <div class="notice">
                Unable to load your bookings.
                Your session may have expired.
                Please log in again.
            </div>

            <button class="btn btn-light" onclick="closeModal()">
                Close
            </button>
        `;

    }
}


/* ==========================================
   ADMIN DASHBOARD
========================================== */

async function admin() {

    if (!currentUser || currentUser.role !== 'ADMIN') {

        auth('login');

        return;
    }

    openModal(`
        <h2>Admin Dashboard</h2>
        <p>Loading booking information...</p>
    `);

    try {

        const [bookingResponse, metricsResponse] =
            await Promise.all([

                fetch(`${API_BASE}/bookings`, {
                    credentials: 'include'
                }),

                fetch(`${API_BASE}/metrics/bookings`, {
                    credentials: 'include'
                })

            ]);

        if (!bookingResponse.ok) {

            throw new Error(
                `Unable to load bookings (${bookingResponse.status})`
            );

        }

        const allBookings = await bookingResponse.json();

        let totalBookings = allBookings.length;

        if (metricsResponse.ok) {

            const metrics = await metricsResponse.json();

            totalBookings = metrics.total;

        }

        const statuses = [

            'REQUESTED',

            'ACCEPTED',

            'PROFESSIONAL_ASSIGNED',

            'IN_PROGRESS',

            'COMPLETED',

            'CANCELLED'

        ];

        $('modalContent').innerHTML = `

            <h2>Admin Dashboard</h2>

            <p>Manage all TrustServe customer bookings.</p>

            <div class="notice">
                Total Bookings:
                <b>${totalBookings}</b>
            </div>

            ${allBookings.length

                ? `

                    <table class="admin-table">

                        <tr>
                            <th>Service / ID</th>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>

                        ${allBookings.map(booking => `

                            <tr>

                                <td>
                                    ${escapeHTML(booking.service)}
                                    <br>
                                    #${escapeHTML(booking.id)}
                                </td>

                                <td>
                                    ${escapeHTML(booking.customerName)}
                                </td>

                                <td>
                                    ${escapeHTML(booking.email)}
                                    <br>
                                    ${escapeHTML(booking.phone)}
                                </td>

                                <td>
                                    ${escapeHTML(booking.preferredDate)}
                                </td>

                                <td>

                                    <select
                                        onchange="changeStatus(${Number(booking.id)}, this.value)">

                                        ${statuses.map(status => `

                                            <option
                                                value="${status}"
                                                ${status === booking.status ? 'selected' : ''}>

                                                ${status.replaceAll('_', ' ')}

                                            </option>

                                        `).join('')}

                                    </select>

                                </td>

                            </tr>

                        `).join('')}

                    </table>

                `

                : `<div class="notice">
                    No bookings found.
                   </div>`

            }

            <button class="btn btn-light" onclick="closeModal()">
                Close
            </button>

        `;

    } catch (error) {

        console.error('Admin Dashboard Error:', error);

        $('modalContent').innerHTML = `

            <h2>Admin Dashboard</h2>

            <div class="notice">
                Unable to load booking information.
                Your admin session may have expired.
                Please log in again.
            </div>

            <button class="btn btn-light" onclick="closeModal()">
                Close
            </button>

        `;

    }
}


/* ==========================================
   ADMIN - UPDATE BOOKING STATUS
========================================== */

async function changeStatus(id, status) {

    if (!currentUser || currentUser.role !== 'ADMIN') {

        toast('Admin login required.');

        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/bookings/${id}/status`,
            {
                method: 'PATCH',

                credentials: 'include',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        if (!response.ok) {

            throw new Error(
                `Failed to update booking status (${response.status})`
            );

        }

        const updatedBooking = await response.json();

        toast(
            `Booking #${updatedBooking.id} updated to ${updatedBooking.status}`
        );

        admin();

    } catch (error) {

        console.error('Status Update Error:', error);

        toast('Unable to update booking status: ' + error.message);

    }
}


/* ==========================================
   SAFE VISIT
========================================== */

function safeVisit() {

    openModal(`

        <h2>SafeVisit check-in</h2>

        <p>
            Record the start and end of a booked service visit
            in this prototype.
        </p>

        <div class="notice">
            Safety prototype only: this does not share live location,
            contact emergency services, or replace local emergency support.
        </div>

        <label>
            Booking ID
            <input id="safeId" placeholder="e.g. TS1234567">
        </label>

        <label>
            Visit status
            <select id="safeStatus">
                <option>Visit started</option>
                <option>Visit completed</option>
                <option>Need assistance (demo flag)</option>
            </select>
        </label>

        <button class="btn btn-primary" id="safeSubmit">
            Save visit update
        </button>

        <div id="safeLog"></div>

    `);

    $('safeSubmit').onclick = () => {

        const logs = get('safe');

        logs.unshift({

            id: $('safeId').value,

            status: $('safeStatus').value,

            time: new Date().toLocaleString()

        });

        set('safe', logs);

        $('safeLog').innerHTML = `
            <div class="notice">
                Update saved: ${escapeHTML($('safeStatus').value)}
            </div>
        `;

        toast('SafeVisit update saved');

    };
}


/* ==========================================
   SOCIETY GROUP REQUEST
========================================== */

function groupCreate() {

    const societyName = $('societyName').value.trim();

    if (!societyName) {

        toast('Please enter society name');

        return;
    }

    const homes = Number($('homes').value);

    if (homes < 2 || homes > 100) {

        toast('Enter 2 to 100 homes');

        return;
    }

    const service = serviceById($('groupService').value);

    const [low, high] = price(service.id);

    const record = {

        society: societyName,

        homes: homes,

        service: service.name,

        estimate:
            `₹${Math.round(low * 0.85)}–₹${Math.round(high * 0.85)} per home`,

        created: new Date().toISOString()

    };

    const groups = get('groups');

    groups.unshift(record);

    set('groups', groups);

    toast('Society group request saved!');

}


/* ==========================================
   PAGE EVENT HANDLERS
========================================== */

if ($('menuToggle')) {

    $('menuToggle').onclick = () =>
        $('nav').classList.toggle('open');

}

if ($('modalClose')) {

    $('modalClose').onclick = closeModal;

}

if ($('modalBackdrop')) {

    $('modalBackdrop').onclick = event => {

        if (event.target === $('modalBackdrop')) {
            closeModal();
        }

    };

}

if ($('loginBtn')) {

    $('loginBtn').onclick = accountMenu;

}

if ($('joinBtn')) {

    $('joinBtn').onclick = () => auth('register');

}

if ($('adminBtn')) {

    $('adminBtn').addEventListener('click', () => {

        if (currentUser && currentUser.role === 'ADMIN') {

            admin();

        } else {

            auth('login');

        }

    });

}

if ($('priceService')) {

    $('priceService').onchange = updatePrice;

}

if ($('jobSize')) {

    $('jobSize').onchange = updatePrice;

}

if ($('urgency')) {

    $('urgency').onchange = updatePrice;

}

if ($('groupService')) {

    $('groupService').onchange = updateGroup;

}

if ($('homes')) {

    $('homes').oninput = updateGroup;

}

if ($('bookFromPrice')) {

    $('bookFromPrice').onclick = () =>
        openBooking($('priceService').value);

}


/* ==========================================
   INITIALIZE APPLICATION
========================================== */

fillSelect('priceService');

fillSelect('groupService');

renderServices();

updatePrice();

updateGroup();

updateAccountButton();
