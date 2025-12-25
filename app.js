/* ===== DATA ===== */
const DATA = [
  {
    title: "Vegas Nights",
    desc: "Luxury Party Bus",
    paragraph:
      "Premium party bus experiences built for unforgettable Vegas nights, private celebrations, and high-energy group transportation across the Strip.",
    image: "https://lasvegaspartybuses.com/wp-content/uploads/2025/12/party-bus-logo.png",
    w: "60%",
    h: "60vh",
    x: "0%"
  },
  {
    title: "VIP Transport",
    desc: "Events & Weddings",
    paragraph:
      "Elegant, reliable transportation solutions designed for weddings, corporate events, and upscale private gatherings throughout Las Vegas.",
    image: "https://lasvegaspartybuses.com/wp-content/uploads/2022/08/Las-Vegas-Party-Bus-Logo.png",
    w: "40%",
    h: "45vh",
    x: "55%"
  },
  {
    title: "After Dark",
    desc: "Nightlife Experiences",
    paragraph:
      "Late-night VIP transportation tailored for nightlife, bottle service runs, special events, and unforgettable after-hours Vegas experiences.",
    image: "https://lasvegaspartybuses.com/wp-content/uploads/2025/12/party-bus-logo.png",
    w: "50%",
    h: "50vh",
    x: "15%"
  }
];

const scroller = document.getElementById("scroller");
const stack = document.getElementById("stack");

let target = 0;
let current = 0;
let loopHeight = 0;
let paused = false;

/* 🚀 Drift speed (unchanged) */
let driftSpeed = 1.20;
let hoverSlow = false;

/* ===== Build Cards ===== */
function build() {
  // Create 4 copies for the buffer
  const cardHTML = DATA.map(d => `
    <li class="card" style="--w:${d.w};--h:${d.h};--x:${d.x}">
      <div class="media">
        <img src="${d.image}" />
      </div>
      <div class="overlay">
        <h2>${d.title}</h2>
        <p>${d.desc}</p>
      </div>
    </li>
  `).join("");

  stack.innerHTML = cardHTML + cardHTML + cardHTML + cardHTML;
  
  // 🔑 FIX 1: Round this to a whole number to prevent sub-pixel jumps
  loopHeight = Math.round(stack.scrollHeight / 4);
  
  current = target = loopHeight;
}

build();

/* ===== Scroll ===== */
function onWheel(e) {
  if (paused) return;
  e.preventDefault();
  target += e.deltaY;
}

function animate() {
  if (!paused) {
    target += hoverSlow ? driftSpeed * 0.5 : driftSpeed;
    current += (target - current) * 0.075;

    // 🔑 FIX 2: Simplified Boundaries
    // We have 4 sets. We want to stay in the middle (Set 2 and 3).
    // If we go past Set 3 (into Set 4), jump back to Set 3.
    // If we go before Set 2 (into Set 1), jump forward to Set 2.
    
    if (current > loopHeight * 3) {
      current -= loopHeight;
      target -= loopHeight; // Adjust target too to preserve momentum
    } 
    else if (current < loopHeight) {
      current += loopHeight;
      target += loopHeight;
    }

    scroller.scrollTop = current;
  }
  requestAnimationFrame(animate);
}

scroller.addEventListener("wheel", onWheel, { passive: false });
requestAnimationFrame(animate);

/* ===== Hover Slow ===== */
stack.addEventListener("mouseover", e => {
  if (e.target.closest(".card")) hoverSlow = true;
});
stack.addEventListener("mouseout", e => {
  if (e.target.closest(".card")) hoverSlow = false;
});

/* ===== Modal ===== */
const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalMedia = document.getElementById("modalMedia");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");

/* 🔑 New paragraph container */
let modalParagraph;

stack.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  paused = true;
  document.body.style.cursor = "auto";

  const index = [...stack.children].indexOf(card) % DATA.length;
  const data = DATA[index];

  setTimeout(() => {
    modalMedia.innerHTML = `<img src="${data.image}">`;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    if (!modalParagraph) {
      modalParagraph = document.createElement("p");
      modalParagraph.className = "modal-paragraph";
      modalDesc.after(modalParagraph);
    }

    modalParagraph.textContent = data.paragraph;
    modal.classList.add("is-open");
  }, 300);
});

modalBackdrop.onclick = () => {
  modal.classList.remove("is-open");
  document.body.style.cursor = "none";
  paused = false;
};

modalClose.onclick = e => {
  e.stopPropagation();
  modal.classList.remove("is-open");
  document.body.style.cursor = "none";
  paused = false;
};

/* ===== FAB ===== */
const fab = document.getElementById("fab");
fab.querySelector(".fab-main").onclick = () =>
  fab.classList.toggle("open");
