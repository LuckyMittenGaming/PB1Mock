/* ===== DATA ===== */
const DATA = [
  {
    title: "Vegas Nights",
    desc: "Luxury Party Bus",
    paragraph:
      "Premium party bus experiences built for unforgettable Vegas nights, private celebrations, and high-energy group transportation across the Strip.",
    image:
      "https://lasvegaspartybuses.com/wp-content/uploads/2025/12/party-bus-logo.png",
    w: "60%",
    h: "60vh",
    x: "0%"
  },
  {
    title: "VIP Transport",
    desc: "Events & Weddings",
    paragraph:
      "Elegant, reliable transportation solutions designed for weddings, corporate events, and upscale private gatherings throughout Las Vegas.",
    image:
      "https://lasvegaspartybuses.com/wp-content/uploads/2022/08/Las-Vegas-Party-Bus-Logo.png",
    w: "40%",
    h: "45vh",
    x: "55%"
  },
  {
    title: "After Dark",
    desc: "Nightlife Experiences",
    paragraph:
      "Late-night VIP transportation tailored for nightlife, bottle service runs, special events, and unforgettable after-hours Vegas experiences.",
    image:
      "https://lasvegaspartybuses.com/wp-content/uploads/2025/12/party-bus-logo.png",
    w: "50%",
    h: "50vh",
    x: "15%"
  }
];

/* ===== DOM ===== */
const scroller = document.getElementById("scroller");
const stack = document.getElementById("stack");

const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalMedia = document.getElementById("modalMedia");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");

/* ===== STATE ===== */
let target = 0;
let current = 0;
let loopHeight = 0;
let paused = false;

/* 🚀 Drift speed */
let driftSpeed = 1.2;
let hoverSlow = false;

/* ===== BUILD CARDS ===== */
function build() {
  stack.innerHTML = DATA.map(
    d => `
    <li class="card" style="--w:${d.w};--h:${d.h};--x:${d.x}">
      <div class="media">
        <img src="${d.image}" />
      </div>
      <div class="overlay">
        <h2>${d.title}</h2>
        <p>${d.desc}</p>
      </div>
    </li>
  `
  ).join("");

  stack.innerHTML += stack.innerHTML;

  loopHeight = stack.scrollHeight / 2;
  current = target = loopHeight;
}

build();

/* ===== DESKTOP WHEEL SCROLL ===== */
function onWheel(e) {
  if (paused) return;
  e.preventDefault();
  target += e.deltaY;
}

scroller.addEventListener("wheel", onWheel, { passive: false });

/* ===== TOUCH SCROLL (MOBILE FIX) ===== */
let touchStartY = 0;
let touchLastY = 0;

scroller.addEventListener(
  "touchstart",
  e => {
    if (paused) return;
    touchStartY = e.touches[0].clientY;
    touchLastY = touchStartY;
  },
  { passive: false }
);

scroller.addEventListener(
  "touchmove",
  e => {
    if (paused) return;
    e.preventDefault();

    const currentY = e.touches[0].clientY;
    const deltaY = touchLastY - currentY;

    target += deltaY * 1.2; // swipe sensitivity
    touchLastY = currentY;
  },
  { passive: false }
);

/* ===== ANIMATION LOOP ===== */
function animate() {
  if (!paused) {
    target += hoverSlow ? driftSpeed * 0.5 : driftSpeed;
    current += (target - current) * 0.065;

    if (current < loopHeight * 0.25) {
      current += loopHeight;
      target += loopHeight;
    } else if (current > loopHeight * 1.75) {
      current -= loopHeight;
      target -= loopHeight;
    }

    scroller.scrollTop = current;
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

/* ===== HOVER SLOW ===== */
stack.addEventListener("mouseover", e => {
  if (e.target.closest(".card")) hoverSlow = true;
});

stack.addEventListener("mouseout", e => {
  if (e.target.closest(".card")) hoverSlow = false;
});

/* ===== MODAL ===== */
let modalParagraph;

stack.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  paused = true;
  document.body.style.cursor = "auto";

  const index = [...stack.children].indexOf(card) % DATA.length;
  const data = DATA[index];

  setTimeout(() => {
    modalMedia.innerHTML = `<img src="${data.image}" />`;
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
