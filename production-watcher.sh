#!/bin/bash

# Production Folder Watcher Script
# این اسکریپت تغییرات پوشه production را رصد کرده و لاگ می‌کند

# تنظیمات اصلی - این مقادیر را بر اساس پروژه خود تغییر دهید
WATCH_DIR="/home/user/my-next-app/production"
LOG_DIR="/home/user/my-next-app/logs"
BACKUP_DIR="/var/backups/production-logs"
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"

# ایجاد دایرکتوری‌های مورد نیاز
mkdir -p "$LOG_DIR"
mkdir -p "$BACKUP_DIR"

# فایل لاگ برای خود اسکریپت
SCRIPT_LOG="$LOG_DIR/watcher.log"

# تابع لاگ کردن
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$SCRIPT_LOG"
}

# تابع ایجاد لاگ فایل CSV
create_log_file() {
    local action="$1"
    local file_path="$2"
    local timestamp=$(date '+%Y-%m-%d_%H-%M-%S')
    
    # نام فولدر بر اساس نام پروژه
    local project_name=$(basename "$(dirname "$WATCH_DIR")")
    local log_folder="$LOG_DIR/$project_name"
    
    # ایجاد فولدر لاگ اگر وجود نداشته باشد
    mkdir -p "$log_folder"
    
    local log_file="$log_folder/log-${timestamp}.csv"
    
    # ایجاد هدر CSV اگر فایل وجود نداشته باشد
    if [ ! -f "$log_file" ]; then
        echo "Timestamp,Action,File,Size,Modified" > "$log_file"
    fi
    
    # اضافه کردن اطلاعات فایل
    local file_size=""
    local file_modified=""
    
    if [ -f "$file_path" ]; then
        file_size=$(stat -c%s "$file_path" 2>/dev/null || echo "0")
        file_modified=$(stat -c%y "$file_path" 2>/dev/null || echo "unknown")
    fi
    
    echo "$timestamp,$action,$file_path,$file_size,$file_modified" >> "$log_file"
    
    log_message "Change logged: $action on $file_path"
}

# تابع backup روزانه
daily_backup() {
    local today=$(date '+%Y-%m-%d')
    local backup_folder="$BACKUP_DIR/$today"
    
    mkdir -p "$backup_folder"
    
    # کپی کردن تمام فایل‌های CSV از دیروز
    if [ -d "$LOG_DIR" ]; then
        find "$LOG_DIR" -name "*.csv" -type f -exec cp {} "$backup_folder/" \;
        log_message "Daily backup completed to $backup_folder"
    fi
}

# اجرای backup اولیه
daily_backup

log_message "Production watcher started for directory: $WATCH_DIR"

# رصد تغییرات
while true; do
    # استفاده از inotifywait برای رصد تغییرات
    if inotifywait -r -e modify,create,delete,move,moved_to,moved_from "$WATCH_DIR" 2>/dev/null; then
        # دریافت اطلاعات تغییر
        local changed_file="$1"
        local event_type="$2"
        
        # لاگ کردن تغییر
        create_log_file "$event_type" "$changed_file"
        
        # بررسی اینکه آیا باید backup روزانه انجام شود
        local current_time=$(date '+%H:%M')
        if [ "$current_time" = "23:59" ]; then
            daily_backup
        fi
    else
        # اگر خطایی رخ داد، صبر کن و دوباره تلاش کن
        log_message "Error in inotifywait, retrying in 5 seconds..."
        sleep 5
    fi
done
