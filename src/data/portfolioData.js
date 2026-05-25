// CENTRALIZED PORTFOLIO DATA - INDONESIAN VERSION
// Edit file ini untuk menyesuaikan semua konten di website Anda dengan mudah!

export const portfolioData = {
  // Informasi Pribadi & Hero
  profile: {
    name: "Yoga Bima Anggara Putra",
    titles: [
      "Full-Stack Software Engineer",
      "UI/UX Enthusiast",
      "Node.js Expert",
      "Problem Solver"
    ],
    avatarUrl: "", // Biarkan kosong untuk menggunakan avatar huruf, atau masukkan path gambar
    tagline: "Saya membangun aplikasi web berkinerja tinggi dan memiliki visual memukau, memadukan rekayasa perangkat lunak yang tangguh dengan pengalaman pengguna premium.",
    aboutMe: "Saya adalah seorang software engineer yang berdedikasi dengan pengalaman lebih dari 4 tahun dalam menciptakan solusi digital. Saya berspesialisasi dalam ekosistem Node.js, framework frontend modern, dan arsitektur cloud. Filosofi desain saya berfokus pada kecepatan, keanggunan, dan perhatian luar biasa terhadap detail.",
    experienceYears: "5",
    completedProjects: "1",
    happyClients: "15+",
    resumeUrl: "#", // Tambahkan link ke PDF CV/Resume Anda jika sudah siap
    socials: {
      instagram: "https://instagram.com/ygbmaagptr_",
      tiktok: "https://tiktok.com/@bimaa_e",
      email: "mailto:agoyynihbosquee@gmail.com"
    }
  },

  // Pilar Bagian Tentang Saya
  pillars: [
    {
      title: "Arsitektur Bersih",
      description: "Menulis kode modular, teruji, dan mudah dipelihara yang dapat diskalakan dengan lancar seiring pertumbuhan bisnis Anda."
    },
    {
      title: "Performa Utama",
      description: "Mengoptimalkan aset, strategi caching, dan kueri database untuk waktu pemuatan di bawah satu detik."
    },
    {
      title: "Estetika Premium",
      description: "Mendesain tata letak yang sempurna hingga ke tingkat piksel dengan interaksi halus agar pengguna tetap betah."
    }
  ],

  // Riwayat Pengalaman
  experience: [
    {
      role: "Senior Software Engineer",
      company: "TechNova Solutions",
      duration: "2024 - Sekarang",
      description: "Memimpin pengembangan microservices dengan Node.js/TypeScript, meningkatkan throughput API sebesar 40%. Mengarahkan tim yang terdiri dari 4 frontend engineer untuk membangun kembali dashboard SaaS premium menggunakan React."
    },
    {
      role: "Full-Stack Developer",
      company: "Quantum Labs",
      duration: "2022 - 2024",
      description: "Membangun aplikasi web berskala besar menggunakan Express, MongoDB, dan React. Merancang sistem perpesanan real-time menggunakan WebSockets, mengurangi kegagalan koneksi socket sebesar 95%."
    },
    {
      role: "Junior Web Developer",
      company: "Apex Web Studio",
      duration: "2021 - 2022",
      description: "Mengembangkan dan memelihara aplikasi web e-commerce yang responsif. Berkolaborasi dengan desainer untuk mengubah mockup Figma yang kompleks menjadi CSS grid dan animasi yang presisi."
    }
  ],

  // Katalog Keahlian
  skills: [
    {
      category: "Bahasa Pemrograman",
      items: [
        { name: "JavaScript (ES6+)", level: 95, icon: "JS", color: "#f7df1e" },
        { name: "TypeScript", level: 90, icon: "TS", color: "#3178c6" },
        { name: "HTML5 & CSS3", level: 95, icon: "</>", color: "#e34f26" },
        { name: "Python", level: 75, icon: "PY", color: "#3776ab" }
      ]
    },
    {
      category: "Frontend & UI",
      items: [
        { name: "React / Vite", level: 92, icon: "⚛", color: "#61dafb" },
        { name: "Vanilla CSS", level: 95, icon: "✦", color: "#1572b6" },
        { name: "Tailwind", level: 98, icon: "🌊", color: "#38bdf8" },
        { name: "State Management", level: 85, icon: "📦", color: "#764abc" }
      ]
    },
    {
      category: "Backend & Database",
      items: [
        { name: "Node.js & Express", level: 94, icon: "⬡", color: "#68a063" },
        { name: "RESTful APIs", level: 90, icon: "⇄", color: "#ff6b6b" },
        { name: "PostgreSQL", level: 88, icon: "🐘", color: "#336791" },
        { name: "MongoDB", level: 80, icon: "🍃", color: "#47a248" }
      ]
    },
    {
      category: "Peralatan & DevOps",
      items: [
        { name: "Git & GitHub", level: 90, icon: "⎇", color: "#f05032" },
        { name: "Docker", level: 82, icon: "🐳", color: "#2496ed" },
        { name: "AWS Cloud", level: 78, icon: "☁", color: "#ff9900" },
        { name: "CI/CD", level: 85, icon: "🚀", color: "#ffffff" }
      ]
    }
  ],

  // Katalog Proyek
  projects: [
    {
      title: "OmniTask SaaS Platform",
      category: "Fullstack",
      description: "Alat manajemen proyek kolaboratif real-time yang dilengkapi papan kanban drag-and-drop, obrolan langsung, dan izin ruang kerja yang kuat.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "WebSockets"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com"
    },
    {
      title: "NovaStore E-Commerce",
      category: "Frontend",
      description: "Tampilan toko e-commerce pakaian mewah yang menawan, menampilkan transisi yang sangat mulus, pembaruan keranjang instan, dan integrasi Stripe.",
      technologies: ["React", "Vite", "Vanilla CSS", "Stripe API"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com"
    },
    {
      title: "HyperSync Cache DB",
      category: "Backend",
      description: "Server database caching dalam memori yang ringan yang dirancang dengan Node.js, mendukung pasangan kunci-nilai, kebijakan penggusuran data, dan sinkronisasi kluster.",
      technologies: ["Node.js", "TypeScript", "TCP Sockets", "Redis Protocol"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com"
    },
    {
      title: "Aether AI Workspace",
      category: "Fullstack",
      description: "Integrasi ruang kerja bertenaga AI yang merangkum log pengembangan yang panjang, menerjemahkan tugas pengguna, dan memprediksi metrik pengiriman.",
      technologies: ["Vite", "Node.js", "OpenAI API", "PostgreSQL"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com"
    }
  ],

  // Testimoni
  testimonials: [
    {
      quote: "Yoga adalah engineer yang luar biasa. Dia menyelesaikan sistem yang kompleks lebih cepat dari jadwal dengan perhatian luar biasa terhadap detail antarmuka pengguna.",
      name: "Marcus Vance",
      role: "CTO, TechNova Solutions",
      company: "TechNova"
    },
    {
      quote: "Bekerja dengan Yoga membawa perubahan besar bagi kami. Peningkatan kinerja platform yang dia lakukan menghemat ribuan dolar biaya hosting kami.",
      name: "Elena Rostova",
      role: "Product Director, Quantum Labs",
      company: "Quantum Labs"
    }
  ],

  // Artikel Blog
  blogs: [
    {
      title: "Menguasai Pipeline Stream Node.js untuk Penanganan File Berkinerja Tinggi",
      excerpt: "Pelajari cara menggunakan stream Node.js yang hemat memori untuk mengurai dataset log berukuran gigabyte dengan penggunaan memori minimal.",
      date: "15 Mei 2026",
      readTime: "6 menit membaca",
      category: "Backend"
    },
    {
      title: "Mengapa Kami Beralih dari Tailwind ke Variabel CSS Asli di Tahun 2026",
      excerpt: "Ulasan mendalam tentang bagaimana fitur CSS modern asli memberikan fleksibilitas superior, ukuran bundle lebih kecil, dan kontrol lebih besar untuk desain web premium.",
      date: "28 April 2026",
      readTime: "8 menit membaca",
      category: "Frontend"
    },
    {
      title: "Cara Membuat Efek Mengetik yang Mulus di React Tanpa Library Eksternal",
      excerpt: "Tutorial langkah demi langkah untuk membuat transisi efek mengetik (typewriter) yang dapat disesuaikan dan berkinerja tinggi menggunakan React hooks.",
      date: "12 Maret 2026",
      readTime: "4 menit membaca",
      category: "UI/UX"
    }
  ]
};
