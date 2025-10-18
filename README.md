# Production Watcher Service

سرویس رصد پوشه production برای پروژه‌های Next.js که تغییرات فایل‌ها را رصد کرده و لاگ می‌کند.

## ویژگی‌ها

- 🔍 رصد تغییرات پوشه production در زمان واقعی
- 📝 ثبت تغییرات در فایل‌های CSV با جزئیات کامل
- 💾 backup روزانه خودکار فایل‌های لاگ
- 📦 آرشیو فشرده فایل‌های لاگ
- 🗑️ پاک کردن خودکار فایل‌های قدیمی (پس از 30 روز)
- 🔄 راه‌اندازی خودکار با systemd
- 📊 لاگ کامل تمام عملیات

## فایل‌های پروژه

- `production-watcher.sh` - اسکریپت اصلی رصد پوشه
- `daily-backup.sh` - اسکریپت backup روزانه
- `production-watcher.service` - فایل سرویس systemd برای watcher
- `production-backup.service` - فایل سرویس systemd برای backup
- `production-backup.timer` - فایل timer برای اجرای روزانه backup
- `install.sh` - اسکریپت نصب و راه‌اندازی

## نصب سریع

```bash
# کلون کردن پروژه (اختیاری)
git clone <repository-url>
cd production-watcher

# اجرای اسکریپت نصب با دسترسی root
sudo ./install.sh
```

## تنظیمات دستی

### 1. تنظیم مسیرها

در فایل `production-watcher.sh` مسیرهای زیر را تغییر دهید:

```bash
WATCH_DIR="/home/user/my-next-app/production"  # مسیر پوشه production
LOG_DIR="/home/user/my-next-app/logs"          # مسیر ذخیره لاگ‌ها
BACKUP_DIR="/var/backups/production-logs"      # مسیر backup
```

### 2. تنظیم کاربر

در فایل‌های `.service` کاربر را تغییر دهید:

```ini
User=ubuntu  # نام کاربر مورد نظر
Group=ubuntu # گروه کاربر مورد نظر
```

## دستورات مدیریت

### مشاهده وضعیت سرویس‌ها

```bash
# وضعیت watcher
sudo systemctl status production-watcher.service

# وضعیت timer backup
sudo systemctl status production-backup.timer

# وضعیت سرویس backup
sudo systemctl status production-backup.service
```

### مدیریت سرویس watcher

```bash
# شروع سرویس
sudo systemctl start production-watcher.service

# توقف سرویس
sudo systemctl stop production-watcher.service

# راه‌اندازی مجدد
sudo systemctl restart production-watcher.service

# فعال/غیرفعال کردن
sudo systemctl enable production-watcher.service
sudo systemctl disable production-watcher.service
```

### مدیریت backup

```bash
# اجرای دستی backup
sudo systemctl start production-backup.service

# مشاهده وضعیت timer
sudo systemctl list-timers production-backup.timer

# فعال/غیرفعال کردن timer
sudo systemctl enable production-backup.timer
sudo systemctl disable production-backup.timer
```

## مشاهده لاگ‌ها

### لاگ‌های سرویس watcher

```bash
# مشاهده لاگ‌های اخیر
sudo journalctl -u production-watcher.service -n 50

# مشاهده لاگ‌ها به صورت real-time
sudo journalctl -u production-watcher.service -f

# مشاهده لاگ‌های روز جاری
sudo journalctl -u production-watcher.service --since today
```

### لاگ‌های سرویس backup

```bash
# مشاهده لاگ‌های backup
sudo journalctl -u production-backup.service -n 50

# مشاهده لاگ‌های timer
sudo journalctl -u production-backup.timer -n 50
```

### فایل‌های لاگ CSV

```bash
# مشاهده فایل‌های لاگ
ls -la /home/ubuntu/my-next-app/logs/

# مشاهده محتوای یک فایل لاگ
cat /home/ubuntu/my-next-app/logs/project-name/log-2024-01-15_14-30-25.csv
```

## ساختار فایل‌های لاگ

### فایل‌های CSV

هر تغییر در فایل‌های production به صورت یک رکورد در فایل CSV ثبت می‌شود:

```csv
Timestamp,Action,File,Size,Modified
2024-01-15_14-30-25,MODIFIED,/home/user/my-next-app/production/app/page.js,1024,2024-01-15 14:30:25
2024-01-15_14-31-10,CREATE,/home/user/my-next-app/production/new-file.js,512,2024-01-15 14:31:10
```

### انواع عملیات

- `MODIFIED` - تغییر فایل موجود
- `CREATE` - ایجاد فایل جدید
- `DELETE` - حذف فایل
- `MOVE` - جابجایی فایل
- `MOVED_TO` - انتقال فایل به مسیر
- `MOVED_FROM` - انتقال فایل از مسیر

## ساختار backup

### دایرکتوری backup

```
/var/backups/production-logs/
├── 2024-01-15/           # فولدر backup روز 15 ژانویه
│   ├── log-2024-01-15_*.csv
│   └── ...
├── 2024-01-16/           # فولدر backup روز 16 ژانویه
│   └── ...
└── archives/             # آرشیوهای فشرده
    ├── production-logs-2024-01-15.tar.gz
    └── ...
```

## تنظیمات پیشرفته

### تغییر زمان backup

برای تغییر زمان backup، فایل `production-backup.timer` را ویرایش کنید:

```ini
[Timer]
OnCalendar=daily@23:59  # تغییر زمان به 23:59
```

### تغییر مدت نگهداری

در فایل `daily-backup.sh` متغیر `RETENTION_DAYS` را تغییر دهید:

```bash
RETENTION_DAYS=60  # نگهداری فایل‌ها به مدت 60 روز
```

### اضافه کردن فیلتر

برای فیلتر کردن فایل‌های خاص، فایل `production-watcher.sh` را ویرایش کنید:

```bash
# مثال: نادیده گیری فایل‌های .tmp
if [[ "$file_path" == *.tmp ]]; then
    continue
fi
```

## عیب‌یابی

### مشکلات رایج

1. **سرویس شروع نمی‌شود:**
   ```bash
   sudo journalctl -u production-watcher.service -n 50
   ```

2. **مجوزهای فایل:**
   ```bash
   sudo chown -R ubuntu:ubuntu /home/ubuntu/my-next-app/
   sudo chmod +x /home/ubuntu/my-next-app/production-watcher.sh
   ```

3. **وابستگی‌های گمشده:**
   ```bash
   sudo apt install inotify-tools
   ```

### بررسی وضعیت سیستم

```bash
# بررسی استفاده از CPU و RAM
top -p $(pgrep -f production-watcher)

# بررسی استفاده از دیسک
du -sh /var/backups/production-logs/

# بررسی فایل‌های باز
lsof | grep production-watcher
```

## حذف نصب

```bash
# توقف سرویس‌ها
sudo systemctl stop production-watcher.service
sudo systemctl stop production-backup.timer

# غیرفعال کردن سرویس‌ها
sudo systemctl disable production-watcher.service
sudo systemctl disable production-backup.service
sudo systemctl disable production-backup.timer

# حذف فایل‌های سرویس
sudo rm /etc/systemd/system/production-watcher.service
sudo rm /etc/systemd/system/production-backup.service
sudo rm /etc/systemd/system/production-backup.timer

# بارگذاری مجدد systemd
sudo systemctl daemon-reload

# حذف فایل‌ها (اختیاری)
sudo rm -rf /var/backups/production-logs/
sudo rm /home/ubuntu/my-next-app/production-watcher.sh
sudo rm /home/ubuntu/my-next-app/daily-backup.sh
```

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.

## مشارکت

برای گزارش باگ یا پیشنهاد ویژگی جدید، لطفاً issue ایجاد کنید.