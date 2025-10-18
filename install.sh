#!/bin/bash

# Installation Script for Production Watcher Service
# این اسکریپت تمام سرویس‌ها و فایل‌های لازم را نصب و راه‌اندازی می‌کند

set -e  # خروج در صورت خطا

# رنگ‌ها برای نمایش بهتر
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# تابع نمایش پیام
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# بررسی دسترسی root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "لطفاً اسکریپت را با دسترسی root اجرا کنید:"
        echo "sudo ./install.sh"
        exit 1
    fi
}

# بررسی وجود فایل‌های لازم
check_files() {
    print_header "بررسی فایل‌های لازم"
    
    local required_files=(
        "production-watcher.sh"
        "daily-backup.sh"
        "production-watcher.service"
        "production-backup.service"
        "production-backup.timer"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "فایل $file یافت نشد!"
            exit 1
        fi
        print_message "فایل $file موجود است ✓"
    done
}

# نصب وابستگی‌ها
install_dependencies() {
    print_header "نصب وابستگی‌ها"
    
    print_message "به‌روزرسانی لیست پکیج‌ها..."
    apt update
    
    print_message "نصب inotify-tools..."
    apt install -y inotify-tools
    
    print_message "وابستگی‌ها نصب شدند ✓"
}

# تنظیم مجوزها
setup_permissions() {
    print_header "تنظیم مجوزها"
    
    print_message "تنظیم مجوز اجرا برای اسکریپت‌ها..."
    chmod +x production-watcher.sh
    chmod +x daily-backup.sh
    chmod +x install.sh
    
    print_message "مجوزها تنظیم شدند ✓"
}

# ایجاد دایرکتوری‌ها
create_directories() {
    print_header "ایجاد دایرکتوری‌ها"
    
    local directories=(
        "/home/ubuntu/my-next-app/logs"
        "/var/backups/production-logs"
        "/var/backups/production-logs/archives"
        "/etc/systemd/system"
    )
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            print_message "ایجاد دایرکتوری $dir..."
            mkdir -p "$dir"
        else
            print_message "دایرکتوری $dir موجود است ✓"
        fi
    done
    
    # تنظیم مالکیت
    chown -R ubuntu:ubuntu /home/ubuntu/my-next-app/logs
    chown -R ubuntu:ubuntu /var/backups/production-logs
}

# کپی فایل‌های سرویس
copy_service_files() {
    print_header "کپی فایل‌های سرویس"
    
    print_message "کپی فایل‌های systemd..."
    cp production-watcher.service /etc/systemd/system/
    cp production-backup.service /etc/systemd/system/
    cp production-backup.timer /etc/systemd/system/
    
    print_message "فایل‌های سرویس کپی شدند ✓"
}

# کپی اسکریپت‌ها
copy_scripts() {
    print_header "کپی اسکریپت‌ها"
    
    print_message "کپی اسکریپت‌ها به دایرکتوری پروژه..."
    cp production-watcher.sh /home/ubuntu/my-next-app/
    cp daily-backup.sh /home/ubuntu/my-next-app/
    
    # تنظیم مالکیت
    chown ubuntu:ubuntu /home/ubuntu/my-next-app/production-watcher.sh
    chown ubuntu:ubuntu /home/ubuntu/my-next-app/daily-backup.sh
    
    print_message "اسکریپت‌ها کپی شدند ✓"
}

# راه‌اندازی سرویس‌ها
enable_services() {
    print_header "راه‌اندازی سرویس‌ها"
    
    print_message "بارگذاری مجدد systemd..."
    systemctl daemon-reload
    
    print_message "فعال‌سازی سرویس watcher..."
    systemctl enable production-watcher.service
    
    print_message "فعال‌سازی سرویس backup..."
    systemctl enable production-backup.service
    systemctl enable production-backup.timer
    
    print_message "سرویس‌ها فعال شدند ✓"
}

# راه‌اندازی سرویس‌ها
start_services() {
    print_header "راه‌اندازی سرویس‌ها"
    
    print_message "شروع سرویس watcher..."
    systemctl start production-watcher.service
    
    print_message "شروع timer backup..."
    systemctl start production-backup.timer
    
    print_message "سرویس‌ها راه‌اندازی شدند ✓"
}

# نمایش وضعیت
show_status() {
    print_header "وضعیت سرویس‌ها"
    
    print_message "وضعیت سرویس watcher:"
    systemctl status production-watcher.service --no-pager -l
    
    echo ""
    print_message "وضعیت timer backup:"
    systemctl status production-backup.timer --no-pager -l
    
    echo ""
    print_message "وضعیت سرویس backup:"
    systemctl status production-backup.service --no-pager -l
}

# نمایش راهنمای استفاده
show_usage() {
    print_header "راهنمای استفاده"
    
    echo -e "${GREEN}دستورات مفید:${NC}"
    echo "• مشاهده وضعیت سرویس watcher:"
    echo "  sudo systemctl status production-watcher.service"
    echo ""
    echo "• مشاهده لاگ‌های سرویس watcher:"
    echo "  sudo journalctl -u production-watcher.service -f"
    echo ""
    echo "• مشاهده وضعیت timer backup:"
    echo "  sudo systemctl status production-backup.timer"
    echo ""
    echo "• اجرای دستی backup:"
    echo "  sudo systemctl start production-backup.service"
    echo ""
    echo "• توقف سرویس watcher:"
    echo "  sudo systemctl stop production-watcher.service"
    echo ""
    echo "• راه‌اندازی مجدد سرویس watcher:"
    echo "  sudo systemctl restart production-watcher.service"
    echo ""
    echo -e "${GREEN}فایل‌های مهم:${NC}"
    echo "• لاگ‌های watcher: /home/ubuntu/my-next-app/logs/"
    echo "• backup ها: /var/backups/production-logs/"
    echo "• آرشیوها: /var/backups/production-logs/archives/"
}

# تابع اصلی
main() {
    print_header "نصب Production Watcher Service"
    
    check_root
    check_files
    install_dependencies
    setup_permissions
    create_directories
    copy_service_files
    copy_scripts
    enable_services
    start_services
    
    print_header "نصب با موفقیت تکمیل شد!"
    
    show_status
    show_usage
    
    print_message "سرویس‌ها آماده استفاده هستند! 🎉"
}

# اجرای تابع اصلی
main "$@"

