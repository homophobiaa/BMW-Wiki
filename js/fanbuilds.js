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

        // Convert timestamp to readable date
        const date = new Date(build.createdAt * 1000);
        const formattedDate = date.toLocaleDateString('bg-BG'); // or 'en-US' for English format


        card.innerHTML = `
      <h3>${build.carModel}</h3>
      <p><strong>Owner:</strong> ${build.username}</p>
      <p><strong>Mods:</strong> ${build.mods}</p>
      <p><strong>Cost:</strong> ${build.totalPrice} лв</p>
      ${build.hpGains ? `<p><strong>HP Gains:</strong> ${build.hpGains}hp</p>` : ''}
      <p><strong>Build type:</strong> ${build.buildType}</p>
      ${build.imageUrl ? `<img src="${build.imageUrl}" alt="BMW Build">` : ''}
      <p><strong>Posted on:</strong> ${formattedDate}</p>
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
        hpGains: document.getElementById('hpGains').value || null,
        buildType: document.getElementById('buildType').value,
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

// Open the modal to edit the build
async function editBuild(id) {
    const res = await fetch(`${apiUrl}/${id}`);
    const build = await res.json();

    // Set values in the modal form
    document.getElementById('editUsername').value = build.username;
    document.getElementById('editCarModel').value = build.carModel;
    document.getElementById('editMods').value = build.mods;
    document.getElementById('editTotalPrice').value = build.totalPrice;
    document.getElementById('editHpGains').value = build.hpGains || '';
    document.getElementById('editImageUrl').value = build.imageUrl || '';
    document.getElementById('editBuildType').value = build.buildType;

    // Show the modal
    document.getElementById('editModal').style.display = 'block';

    // Handle form submission for editing
    document.getElementById('editForm').onsubmit = async function (e) {
        e.preventDefault();

        const updatedBuild = {
            username: document.getElementById('editUsername').value,
            carModel: document.getElementById('editCarModel').value,
            mods: document.getElementById('editMods').value,
            totalPrice: document.getElementById('editTotalPrice').value,
            hpGains: document.getElementById('editHpGains').value || null,
            buildType: document.getElementById('editBuildType').value,
            imageUrl: document.getElementById('editImageUrl').value || undefined,
        };

        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBuild)
        });

        // Close the modal and refresh the builds list
        document.getElementById('editModal').style.display = 'none';
        fetchBuilds();
    };
}

window.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('editModal').style.display = 'none';
        });
    }
});


fetchBuilds();
