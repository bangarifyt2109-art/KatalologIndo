let semuaData = [];
let dataAktif = [];
let halaman = 1;
const perHalaman = 10;

fetch("data/katalog.json")
  .then(res => res.json())
  .then(data => {

    semuaData = data;
    dataAktif = data;

    tampilkan();

    /* =========================
       SEARCH FLEXIBLE
    ========================= */

    const searchInput = document.getElementById("search");

   searchInput.addEventListener("input", function(){

  const keyword = this.value.toLowerCase().trim();

  halaman = 1;

  // 🔥 UBAH HASH URL
  if(keyword === ""){
    window.location.hash = "katalog";
  } else {
    const slug = keyword.replace(/\s+/g, "-");
    window.location.hash = `katalog/${slug}`;
  }

  // kalau kosong
  if(keyword === ""){
    dataAktif = semuaData;
    tampilkan();
    return;
  }

  // pecah kata
  const kataCari = keyword.split(" ");

  dataAktif = semuaData.filter(item => {

    // gabungkan semua text
    const gabung = `
      ${item.nama || ""}
      ${item.kategori || ""}
      ${(item.keyword || []).join(" ")}
    `.toLowerCase();

    // flexible search
    return kataCari.some(kata => 
      gabung.includes(kata)
    );

  });

  tampilkan();

    });

  });
function tampilkan(){
  const katalog = document.getElementById("katalog");
  const nomorWA = "628";

  katalog.innerHTML = "";

  const start = (halaman - 1) * perHalaman;
  const end = start + perHalaman;
  const dataTampil = dataAktif.slice(start, end);

  dataTampil.forEach(item => {

    const pesan = `Halo kak 👋
Saya mau pesan undangan

✨ Tema: ${item.nama}
🔗 Preview: ${item.link}`;

    const linkWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

    katalog.innerHTML += `

    <div class="relative">

      <div class="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition duration-300 hover:-translate-y-2 overflow-hidden border border-white/40 backdrop-blur">

        <!-- gambar -->
        <div class="relative">

          <img src="${item.gambar}"
            class="w-full aspect-[3/4] sm:aspect-[4/5] object-cover">

        </div>

        <!-- nama tema -->
<div class="px-3 pt-3 text-center text-sm sm:text-base font-semibold">
  ${item.nama}
</div>

<!-- harga -->
<div class="text-center text-[#ee4d2d] text-base font-bold mt-1 mb-3">
  Rpxxx - Rpxxx
</div>

<!-- tombol -->
<div class="p-3 flex flex-col gap-2">

          <a href="${item.link}" target="_blank"
          class="w-full text-center bg-black text-white py-3 rounded-xl text-sm font-semibold active:scale-95 transition">

            👁️ Lihat Demo

          </a>

          <a href="${linkWA}" target="_blank"
          class="w-full text-center bg-green-500 text-white py-3 rounded-xl text-sm font-semibold active:scale-95 transition">

            💬 Pesan Sekarang

          </a>

        </div>

      </div>

    </div>

    `;

  });

  renderPagination();
}

function filterKategori(kategori){
  halaman = 1;

  if(kategori === "all"){
    dataAktif = semuaData;
  } else {
    dataAktif = semuaData.filter(item => item.kategori === kategori);
  }

  tampilkan();

  document.querySelectorAll(".btn-filter").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
}
/* =========================
   🔥 TAMBAH DI BAWAH INI
========================= */
function renderPagination(){
  let container = document.getElementById("pagination");

  if(!container){
    container = document.createElement("div");
    container.id = "pagination";
    container.className = "flex justify-center gap-3 mt-6";
    document.querySelector("#katalog").after(container);
  }

  const totalHalaman = Math.ceil(dataAktif.length / perHalaman);

  container.innerHTML = `
  <button onclick="prevPage()" 
    class="px-5 py-2.5 rounded-full border border-white/40 bg-white/70 backdrop-blur shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1 ${halaman === 1 ? 'opacity-40 cursor-not-allowed' : ''}">
    
    ← Prev
  </button>

  <div class="px-5 py-2.5 rounded-full bg-black text-white text-sm shadow-lg">
    ${halaman} / ${totalHalaman}
  </div>

  <button onclick="nextPage()" 
    class="px-5 py-2.5 rounded-full bg-black text-white shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-1 ${halaman === totalHalaman ? 'opacity-40 cursor-not-allowed' : ''}">
    
    Next →
  </button>
`;
}

function nextPage(){
  const totalHalaman = Math.ceil(dataAktif.length / perHalaman);

  if(halaman < totalHalaman){

    halaman++;
    tampilkan();

    const el = document.getElementById("kategori");

    const y = el.getBoundingClientRect().top
            + window.pageYOffset - 80;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  }
}

function prevPage(){

  if(halaman > 1){

    halaman--;
    tampilkan();

    const el = document.getElementById("kategori");

    const y = el.getBoundingClientRect().top
            + window.pageYOffset - 80;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  }
}
    // ======================
// BUKA SEARCH DARI URL
// ======================

window.addEventListener("load", () => {

  const hash = window.location.hash;

  if(hash.includes("katalog/")){

    const keyword = hash.split("katalog/")[1]
      .replace(/-/g, " ");

    const searchInput = document.getElementById("search");

    if(searchInput){

      searchInput.value = keyword;

      const kataCari = keyword.toLowerCase().split(" ");

      dataAktif = semuaData.filter(item => {

        const gabung = `
          ${item.nama || ""}
          ${item.kategori || ""}
          ${(item.keyword || []).join(" ")}
        `.toLowerCase();

        return kataCari.some(kata =>
          gabung.includes(kata)
        );

      });

      tampilkan();

    }

  }

});
fetch("data/porto.json")
  .then(res => res.json())
  .then(data => {

    const porto = document.getElementById("portoList");

if (!porto) return;

const prevBtn = document.getElementById("prevPorto");
const nextBtn = document.getElementById("nextPorto");
const pageInfo = document.getElementById("pageInfo");

if (!prevBtn || !nextBtn || !pageInfo) return;

const perPage = window.innerWidth < 768 ? 8 : 12;
let currentPage = 1;
const totalPages = Math.ceil(data.length / perPage);

    function renderPage(page) {

      porto.innerHTML = "";

      const start = (page - 1) * perPage;
      const end = start + perPage;

      data.slice(start, end).forEach(item => {

        porto.innerHTML += `
          <div class="group">
            <a href="${item.link}" target="_blank">

              <div class="overflow-hidden rounded-2xl">
                <img
                  src="${item.gambar}"
                  alt="${item.nama}"
                  class="w-full aspect-square object-cover transition duration-500 group-hover:scale-105"
                >
              </div>

              <div class="mt-2 text-center text-xs md:text-sm font-semibold leading-tight line-clamp-2 min-h-[38px]">
                ${item.nama.replace(" Of ", " Of <br>")}
              </div>

            </a>
          </div>
        `;
      });

      document.getElementById("pageInfo").textContent =
        `${page} / ${totalPages}`;

      document.getElementById("prevPorto").disabled = page === 1;
      document.getElementById("nextPorto").disabled = page === totalPages;

      document.getElementById("prevPorto").classList.toggle(
        "opacity-40",
        page === 1
      );

      document.getElementById("nextPorto").classList.toggle(
        "opacity-40",
        page === totalPages
      );
    }

    renderPage(currentPage);

    document.getElementById("nextPorto").addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);

        document
          .getElementById("porto")
          .scrollIntoView({ behavior: "smooth" });
      }
    });

    document.getElementById("prevPorto").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);

        document
          .getElementById("porto")
          .scrollIntoView({ behavior: "smooth" });
      }
    });

  });
