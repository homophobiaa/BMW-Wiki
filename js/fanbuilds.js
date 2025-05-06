const apiUrl = 'https://681a1bbf1ac115563507d4d6.mockapi.io/fanbuilds';

const form = document.getElementById('fanbuildForm');
const list = document.getElementById('fanbuildsList');

async function fetchBuilds() {
    const res = await fetch(apiUrl);
    const builds = await res.json();
    list.innerHTML = '';
    builds.reverse().forEach(build => {
        const card = document.createElement('div');
        card.className = 'fanbuild-card';
        card.innerHTML = `
      <h3>${build.carModel}</h3>
      <p><strong>Owner:</strong> ${build.username}</p>
      <p><strong>Mods:</strong> ${build.mods}</p>
      <p><strong>Cost:</strong> ${build.totalPrice} лв</p>
      ${build.hpGains ? `<p><strong>HP Gains:</strong> ${build.hpGains}hp</p>` : ''}
      ${build.imageUrl ? `<img src="${build.imageUrl}" alt="BMW Build">` : ''}
      <div class="card-buttons">
        <button onclick="deleteBuild(${build.id})">🗑 Delete</button>
        <button onclick="editBuild(${build.id})">✏ Edit</button>
      </div>
    `;
        list.appendChild(card);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const build = {
        username: document.getElementById('username').value,
        carModel: document.getElementById('carModel').value,
        mods: document.getElementById('mods').value,
        totalPrice: document.getElementById('totalPrice').value,
        hpGains: document.getElementById('hpGains').value || undefined,
        imageUrl: document.getElementById('imageUrl').value || undefined,
    };

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(build)
    });

    form.reset();
    fetchBuilds();
});

async function deleteBuild(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchBuilds();
}

async function editBuild(id) {
    const res = await fetch(`${apiUrl}/${id}`);
    const build = await res.json();

    document.getElementById('username').value = build.username;
    document.getElementById('carModel').value = build.carModel;
    document.getElementById('mods').value = build.mods;
    document.getElementById('totalPrice').value = build.totalPrice;
    document.getElementById('hpGains').value = build.hpGains || '';
    document.getElementById('imageUrl').value = build.imageUrl || '';

    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
}

fetchBuilds();