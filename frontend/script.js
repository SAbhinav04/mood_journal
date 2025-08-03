const form = document.getElementById('journal-form');
const entryText = document.getElementById('entry-text');
const entriesList = document.getElementById('entries-list');

window.addEventListener('DOMContentLoaded', fetchEntries);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = entryText.value.trim();
    if (!text) return;
    await fetch('/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    entryText.value = '';
    fetchEntries();
});

async function fetchEntries() {
    const res = await fetch('/entries');
    const entries = await res.json();
    entriesList.innerHTML = '';
    entries.reverse().forEach(entry => {
        const li = document.createElement('li');
        li.className = `entry ${entry.mood}`;
        li.innerHTML = `
            <div class="meta">
                <span>${new Date(entry.timestamp).toLocaleString()}</span>
                <span style="float:right;">Mood: <strong>${entry.mood}</strong></span>
            </div>
            <div>${entry.text}</div>
        `;
        entriesList.appendChild(li);
    });
}
