# ColdBrew — VPS'ga Deploy Qilish Qo'llanmasi

Bu qo'llanma backend (Express + MongoDB, EJS admin panel) va frontend (React SPA)ni bitta VPS serverga qanday joylashtirishni ko'rsatadi. Rasm fayllari (`/uploads`) lokal diskda saqlanganligi sababli VPS tanlandi — bu yerda disk doimiy bo'lgani uchun qo'shimcha kod o'zgarishi shart emas.

## 0. Talab qilinadigan narsalar

- VPS hisob (tavsiya: **DigitalOcean** Droplet yoki **Hetzner Cloud**, Ubuntu 22.04 LTS, kamida 1 vCPU / 2GB RAM)
- Domen nomi (ixtiyoriy, lekin SSL uchun tavsiya etiladi — masalan Namecheap/GoDaddy'dan)
- MongoDB Atlas hisobingiz allaqachon mavjud (loyihada ishlatilmoqda)
- SSH orqali serverga ulanish imkoniyati

---

## 1. VPS'ni tayyorlash

```bash
# Serverga SSH orqali ulaning
ssh root@YOUR_SERVER_IP

# Tizimni yangilash
apt update && apt upgrade -y

# Node.js 20 LTS o'rnatish
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx

# PM2 — backendni doimiy ishlab turish uchun process manager
npm install -g pm2

# Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

## 2. MongoDB Atlas — VPS IP manzilini ruxsat ro'yxatiga qo'shish

Atlas Dashboard → **Network Access** → **Add IP Address** → VPS serveringizning statik IP manzilini kiriting (yoki vaqtinchalik test uchun `0.0.0.0/0`, lekin production uchun tavsiya etilmaydi).

## 3. Backend'ni deploy qilish

```bash
cd /var/www
git clone <sizning-repo-manzilingiz> coldbrew
cd coldbrew

npm install
cp .env.example .env
nano .env   # MONGO_URL, SESSION_SECRET, SECRET_TOKEN, NODE_ENV=production,
            # ALLOWED_ORIGINS=https://sizning-domeningiz.com kiriting

npm run build   # dist/ papkasini yaratadi (tsc + views/public nusxalanadi)

pm2 start dist/server.js --name coldbrew-backend
pm2 save
pm2 startup   # server qayta yoqilganda avtomatik ishga tushishi uchun
```

Backend endi `localhost:3003` da ishlayapti (faqat server ichida ko'rinadi, tashqariga Nginx orqali chiqariladi — pastga qarang).

## 4. Frontend'ni build qilish

```bash
cd /var/www
git clone <sizning-frontend-repo-manzilingiz> coldbrew-react
cd coldbrew-react

npm install
cp .env.example .env
nano .env   # REACT_APP_API_URL=https://sizning-domeningiz.com kiriting

npm run build   # build/ papkasini yaratadi — bu statik HTML/JS/CSS
```

`build/` papkasi endi Nginx orqali statik fayl sifatida serve qilinadi.

## 5. Nginx sozlash

`/etc/nginx/sites-available/coldbrew` faylini yarating:

```nginx
server {
    listen 80;
    server_name sizning-domeningiz.com;

    # ── FRONTEND (React SPA) ──
    root /var/www/coldbrew-react/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # ── BACKEND API va Admin panel ──
    location ~ ^/(admin|member|product|order|content|health|uploads) {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/coldbrew /etc/nginx/sites-enabled/
nginx -t   # sintaksisni tekshirish
systemctl restart nginx
```

## 6. SSL (Let's Encrypt, bepul)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d sizning-domeningiz.com
```

Certbot avtomatik ravishda Nginx configingizni HTTPS uchun yangilaydi va sertifikatni har 90 kunda avtomatik yangilab turadi.

## 7. Tekshirish

- `https://sizning-domeningiz.com` — React sayt ochilishi kerak
- `https://sizning-domeningiz.com/admin` — Admin panel ochilishi kerak
- `https://sizning-domeningiz.com/health` — `{"status":"ok"}` qaytarishi kerak
- Admin panelda mahsulot yaratib/tahrirlab, rasm yuklab ko'ring — server qayta ishga tushirilgandan keyin ham (`pm2 restart coldbrew-backend`) rasm yo'qolmasligini tekshiring

## 8. Kelajakda yangilash

```bash
cd /var/www/coldbrew && git pull && npm install && npm run build && pm2 restart coldbrew-backend
cd /var/www/coldbrew-react && git pull && npm install && npm run build
```

---

## Muhim eslatmalar

- `.env` fayllarni hech qachon git'ga commit qilmang (allaqachon `.gitignore`da bor).
- `SESSION_SECRET` va `SECRET_TOKEN` uchun kuchli, tasodifiy qiymatlar generatsiya qiling: `openssl rand -hex 32`
- `/uploads` papkasini muntazam zaxira (backup) qiling — masalan `rsync` yoki VPS provayderning snapshot funksiyasi orqali, disk yo'qolgan taqdirda rasm fayllari ham yo'qolib ketmasligi uchun.
